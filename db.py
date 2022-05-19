import sqlite3
import encrypt


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
        "CREATE TABLE secrets ( organization TEXT, username TEXT, password BLOB, salt BLOB, UNIQUE (username, organization) );"
    )


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
    cur.execute(
        f"SELECT salt FROM secrets WHERE username = '{username}' AND organization = '{organization}';"
    )

    try:
        salt, *_ = cur.fetchone()
    except TypeError:
        return None

    cur.execute(
        f"SELECT password FROM secrets WHERE username = '{username}' AND organization = '{organization}';"
    )

    try:
        token, *_ = cur.fetchone()
    except TypeError:
        return None

    key, _ = encrypt.generate_key(master_key=master_key, salt=salt)
    password = encrypt.decrypt(token=token, key=key)

    return password


if __name__ == "__main__":
    init()
