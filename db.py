from collections import defaultdict
import sqlite3
import encrypt
import config


def db(db_name: str = "default.db"):
    def db_action(func):
        def wrapper(*args, **kwargs):
            connection = sqlite3.connect(db_name)
            cursor = connection.cursor()
            result = func(cursor, *args, **kwargs)
            connection.commit()
            connection.close()
            return result

        return wrapper

    return db_action


@db()
def init(cur: sqlite3.Cursor):
    """
    Creates 'secrets' table
    """
    cur.execute(
        "CREATE TABLE IF NOT EXISTS secrets ( organization TEXT, username TEXT, password BLOB, salt BLOB, UNIQUE (username, organization) );"
    )

    cur.execute("CREATE TABLE IF NOT EXISTS master ( password BLOB, salt BLOB );")


@db()
def set_master_key(cur: sqlite3.Cursor, master_key: str):

    cur.execute("SELECT * from master")

    if cur.fetchall():
        raise config.MasterKeyAlreadyExists

    key, salt = encrypt.generate_key(master_key=master_key)
    token = encrypt.encrypt(password=master_key, key=key)

    query = "INSERT INTO master (password, salt) VALUES (?, ?)"
    data = (token, salt)

    cur.execute(query, data)


@db()
def check_master_key(cur: sqlite3.Cursor, master_key: str):

    if master_key is None:
        return False

    cur.execute(f"SELECT salt FROM master;")

    try:
        salt, *_ = cur.fetchone()
    except TypeError:
        raise

    cur.execute(f"SELECT password FROM master;")

    try:
        token, *_ = cur.fetchone()
    except TypeError:
        raise

    key, _ = encrypt.generate_key(master_key=master_key, salt=salt)
    password = encrypt.decrypt(token=token, key=key)

    if password != master_key:
        return False

    return True


@db()
def add_password(
    cur: sqlite3.Cursor,
    master_key: str,
    username: str,
    password: bytes,
    organization: str = "default",
):

    key, salt = encrypt.generate_key(master_key=master_key)
    token = encrypt.encrypt(password=password, key=key)

    query = f"INSERT INTO secrets (organization, username, password, salt) VALUES (?, ?, ?, ?);"

    print(salt)

    data = (organization, username, token, salt)

    cur.execute(query, data)


@db()
def delete_password(cur: sqlite3.Cursor, username: str, organization: str = "default"):
    cur.execute(
        f"DELETE FROM secrets WHERE username = '{username}' AND organization = '{organization}';"
    )


@db()
def update_password(
    cur: sqlite3.Cursor,
    master_key: str,
    username: str,
    password: str,
    organization: str = "default",
):
    key, salt = encrypt.generate_key(master_key=master_key)
    token = encrypt.encrypt(password=password, key=key)

    cur.execute(
        f"UPDATE secrets SET password = '{token}', salt = '{salt}' WHERE username = '{username}' AND organization = '{organization}';"
    )


@db()
def get_password(
    cur: sqlite3.Cursor,
    master_key: str,
    username: str,
    organization: str = "default",
):
    """
    Decrypt a token from DB by using the given master key.
    """
    cur.execute(
        f"SELECT salt FROM secrets WHERE username = '{username}' AND organization = '{organization}';"
    )

    try:
        salt, *_ = cur.fetchone()
    except TypeError:
        return None # should raise instead of none

    cur.execute(
        f"SELECT password FROM secrets WHERE username = '{username}' AND organization = '{organization}';"
    )

    try:
        token, *_ = cur.fetchone()
    except TypeError:
        return None # should raise instead of none

    key, _ = encrypt.generate_key(master_key=master_key, salt=salt)
    password = encrypt.decrypt(token=token, key=key)

    return password

@db()
def get_usernames_and_orgs(cur: sqlite3.Cursor,):
    cur.execute(
        f"SELECT organization, username FROM secrets;"
    )

    result = {}

    for row in cur:
        org, user = row
        if org in result:
            result[org][user] = None
        else:
            result[org] = {user: None}

    return result


if __name__ == "__main__":
    # init()
    res = get_password(username="test")
    print(res)
