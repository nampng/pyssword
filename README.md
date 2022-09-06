# pyssword

Pyssword is my attempt at making a password management app like BitWarden, and is mostly just for fun and learning.

That being said, it's certainly not the best and you should **NOT** use this as an actual password manager. For that I recommend BitWarden which I use for my everyday password needs.

## Whats Inside

The backend is written in Python using FastAPI, SQLite, and the crytography library.

The frontend consists of a React app that uses Bootstrap for styling.

## How It Works

### Backend
#### Running the FastAPI app and interacting with the API

To run the backend, first install the modules in `requirements.txt` (`pip install -r requirements.txt`)

Then you can do `uvicorn --port 3001 --reload main:app` which will run the application.

Upon starting, the application will attempt to create a fresh database if one doesn't already exist.

Assuming that a fresh database hasn't been made yet, then you'll need to supply a master key, which you can do by sending a post request to `/key/` with the "password" field in the JSON as your desired master key. 

The contents of every post request used in this app should look like this:

```
{
  "organization": str || None,
  "username": str || None,
  "password": str || None,
}
```

After doing so, you'll also be logged in and ready to use the app. If you already have an existing database and master key set, send a post request to `/login/` to set the global master key variable in the application.

You can then call `/get/`, `/add/`, `/delete/`, or `/get/all/` to get passwords, add passwords, delete passwords, or get the entire collection of organizations and usernames within the database.

#### Encryption
Encryption is done by using the Fernet encryption algorithm, which can be easily used in the [cryptography](https://cryptography.io/en/latest/fernet/) library.
The encryption done is symmetric, so a secret key will be used to encrypt and decrpyt our passwords.

In this case, our secret key is our master key, which is how I suspect BitWarden does it, but I'm not sure.

Currently, encryption and decryption is done entirely in the backend and the password is sent to the frontend in PLAIN TEXT. Yeah, no good. However, I'm attempting to make changes [in this branch](/nampng/pyssword/tree/server-encrypt-client-decrypt) so that encryption is done on the server side and decryption is done on the client side.

### Frontend

## Plans For The Future


