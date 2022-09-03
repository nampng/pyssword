from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import db
from pydantic import BaseModel
from sqlite3 import IntegrityError
import config
import json


class Secret(BaseModel):
    organization: str = "default"
    username: str = "default"
    password: str

    def __iter__(self):
        return iter((self.organization, self.username, self.password))


class Message(BaseModel):
    message: str
    data: Union[str, None]


app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

db.init()

master_key = None


@app.post("/key/", response_model=Message)
async def set_master_key(secret: Secret):

    _, _, key = secret

    try:
        db.set_master_key(master_key=key)
    except config.MasterKeyAlreadyExists:
        return Message(message="A master key already exists, try logging in.")

    global master_key
    master_key = key

    return Message(message="Master key set.")


@app.post("/login/", response_model=Message)
async def check_master_key(secret: Secret):

    _, _, key = secret

    try:
        is_logged_in = db.check_master_key(master_key=key)
    except TypeError:
        return Message(message="No master key, try making one.", data='2')

    if not is_logged_in:
        return Message(message="Wrong master key.", data='0')

    global master_key
    master_key = key

    return Message(message="Logged in.", data='1')


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


@app.post("/delete/", response_model=Message)
async def delete_password(secret: Secret):

    organization, username, _ = secret

    if master_key is None:
        return Message(message="Please supply a master key")

    db.delete_password(username=username, organization=organization)

    return Message(message=f"Username deleted from {organization}")


@app.post("/update/", response_model=Message)
async def update_password(secret: Secret):
    organization, username, password = secret

    if master_key is None:
        return Message(message="Please supply a master key")

    db.update_password(username=username, password=password, organization=organization)

    return Message(message=f"Password updated for {username} in {organization}")


@app.post("/get/", response_model=Message)
async def get_password(secret: Secret):
    organization, username, _ = secret

    if master_key is None:
        return Message(message="Please supply a master key")

    password = db.get_password(
        master_key=master_key,
        username=username,
        organization=organization,
    )

    return Message(message="Password retrieved", data=password)


@app.post("/get/all", response_model=Message)
async def get_usernames_and_organizations():

    if master_key is None:
        return Message(message="Please supply a master key")

    org_dict = db.get_usernames_and_orgs()

    return Message(message="Password retrieved", data=json.dumps(org_dict))