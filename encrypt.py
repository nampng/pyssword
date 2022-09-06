import base64
import os
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


def generate_key(master_key: str, salt: bytes = None):
    if salt is None:
        salt = os.urandom(16)

    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=390000,
    )

    key = base64.urlsafe_b64encode(kdf.derive(master_key.encode("utf-8")))

    return (key, salt)


def encrypt(password: str, key: bytes):
    f = Fernet(key)
    token = f.encrypt(password.encode("utf-8"))
    return token


def decrypt(token: bytes, key: bytes):
    f = Fernet(key)

    try:
        password = f.decrypt(token).decode("utf-8")
    except Exception as e:
        print(e)
        return None

    return password


if __name__ == "__main__":
    pass
