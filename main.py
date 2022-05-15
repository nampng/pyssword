from fastapi import FastAPI
import db

app = FastAPI()

@app.get("/add/{organization}/{username}/{password}")
async def add_password(organization: str, username: str, password: str):
    return db.add_password(username=username, password=password, organization=organization)

@app.get("/delete/{organization}/{username}")
async def delete_password(organization: str, username: str):
    return db.delete_password(username=username, organization=organization)

@app.get("/update/{organization}/{username}/{password}")
async def update_password(organization: str, username: str, password: str):
    return db.update_password(username=username, password=password, organization=organization)

@app.get("/get/{organization}/{username}")
async def get_password(organization: str, username: str):
    return db.get_password(username=username, organization=organization)

@app.get("/get/{organization}")
async def get_organization_usernames(organization: str):
    return db.get_organization_usernames(organization=organization)