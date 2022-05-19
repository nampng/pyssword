from typing import Union
from fastapi import FastAPI
import db
from pydantic import BaseModel
from sqlite3 import IntegrityError
import config


class Secret(BaseModel):
    organization: str = "default"
    username: str
    password: str

    def __iter__(self):
        return iter((self.organization, self.username, self.password))


class Message(BaseModel):
    message: str
    data: Union[str, None]


app = FastAPI()

db.init()

master_key = None


@app.post("/key/", response_model=Message)
async def set_master_key(key: str):

    try:
        db.set_master_key(master_key=key)
    except config.MasterKeyAlreadyExists:
        return Message(message="A master key already exists, try logging in.")

    global master_key
    master_key = key

    return Message(message="Master key set.")


@app.get("/login/", response_model=Message)
async def check_master_key(key: str):

    try:
        is_logged_in = db.check_master_key(master_key=key)
    except TypeError:
        return Message(message="No master key, try making one.")

    if not is_logged_in:
        return Message(message="Wrong master key.")

    global master_key
    master_key = key

    return Message(message="Master key set.")


@app.post("/add/", response_model=Message)
async def add_password(secret: Secret):
    organization, username, password = secret

    if master_key is None:
        return Message(message="Please supply a master key")

    try:
        db.add_password(
            master_key=master_key,
            username=username,
            password=password,
            organization=organization,
        )
    except IntegrityError:
        return Message(message="Password already exists.")

    return Message(message=f"Password added to {organization} for username {username}")


@app.delete("/delete/", response_model=Message)
async def delete_password(username: str, organization: str = "default"):
    if master_key is None:
        return Message(message="Please supply a master key")

    db.delete_password(username=username, organization=organization)

    return Message(message=f"Username deleted from {organization}")


@app.put("/update/", response_model=Message)
async def update_password(secret: Secret):
    organization, username, password = secret

    if master_key is None:
        return Message(message="Please supply a master key")

    db.update_password(username=username, password=password, organization=organization)

    return Message(message=f"Password updated for {username} in {organization}")


@app.get("/get/", response_model=Message)
async def get_password(username: str, organization: str = "default"):
    if master_key is None:
        return Message(message="Please supply a master key")

    password = db.get_password(
        master_key=master_key,
        username=username,
        organization=organization,
    )

    return Message(message="Password retrieved", data=password)
