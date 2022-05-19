from typing import Union
from fastapi import FastAPI
import db
from pydantic import BaseModel
from sqlite3 import IntegrityError


class Secret(BaseModel):
    organization: str = "default"
    username: Union[str, None]
    password: Union[str, None]

    def __iter__(self):
        return iter((self.organization, self.username, self.password))


class Message(BaseModel):
    message: str


app = FastAPI()


@app.post("/add/", response_model=Message)
async def add_password(secret: Secret):
    organization, username, password = secret

    master_key = "test"

    if password is None:
        return Message(message="Password required")
    if username is None:
        return Message(message="Password required")

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
async def delete_password(username: str = None, organization: str = "default"):
    if username is None:
        return Message(message="Username required")

    db.delete_password(username=username, organization=organization)

    return Message(message=f"Username deleted from {organization}")


@app.put("/update/", response_model=Message)
async def update_password(secret: Secret):
    organization, username, password = secret

    db.update_password(username=username, password=password, organization=organization)

    return Message(message=f"Password updated for {username} in {organization}")


@app.get("/get/", response_model=Message)
async def get_password(username: str = None, organization: str = "default"):
    master_key = "test"

    if username is None:
        return Message(message="Username required")

    return db.get_password(
        master_key=master_key,
        username=username,
        organization=organization,
    )
