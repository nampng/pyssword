from fastapi import FastAPI
import db

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/post-password/{organization}/{username}/{password}")
async def post_password(organization: str, username: str, password: str):
    db.post_password(username=username, password=password, organization=organization)

