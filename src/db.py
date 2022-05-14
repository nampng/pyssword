import sqlite3

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
    cur.execute("CREATE TABLE secrets ( username TEXT, password TEXT, organization TEXT, UNIQUE (username, organization) );")

@db()
def add_password(cur: sqlite3.Cursor, username: str, password: str, organization: str = "default"):
    cur.execute(f"INSERT INTO secrets (username, password, organization) VALUES ('{username}', '{password}', '{organization}');")

@db()
def delete_password(cur: sqlite3.Cursor, username: str, organization: str = "default"):
    cur.execute(f"DELETE FROM secrets WHERE username = '{username}' and organization = '{organization}';")

@db()
def update_password(cur: sqlite3.Cursor, username: str, password: str, organization: str = "default"):
    cur.execute(f"UPDATE secrets SET password = '{password}' WHERE username = '{username}' and organization = '{organization}';")

@db()
def get_password(cur: sqlite3.Cursor, username: str, organization: str = "default"):
    cur.execute(f"SELECT password FROM secrets WHERE username = '{username}' and organization = '{organization}';")
    password, *_ = cur.fetchone()
    return password


if __name__ == "__main__":
    pass
