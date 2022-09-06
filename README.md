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

After doing so, you'll also be logged in and ready to use the app. If you already have an existing database and master key made, send a post request to `/login/` to set the global master key variable in the application and you're good to go.

You can then call `/get/`, `/add/`, `/delete/`, or `/get/all/` to get passwords, add passwords, delete passwords, or get the entire collection of organizations and usernames within the database.

#### Encryption
Encryption is done by using the [cryptography](https://cryptography.io/en/latest/fernet/) library, which uses the Fernet encryption algorithm.

The encryption is symmetric, so a secret key will be used to encrypt and decrypt our passwords.

In this case, our secret key is our master key, which is how I suspect BitWarden does it, but I'm not sure.

Currently, encryption and decryption is done entirely in the backend and the passwords are sent to the frontend in **PLAIN TEXT**. Yeah, not good. However, I'm attempting to make changes [in this branch](/nampng/pyssword/tree/server-encrypt-client-decrypt) so that encryption is done on the server side and decryption is done on the client side, which would be a step in the right direction. I'm not too proficient in JavaScript, React, Node.js, etc. so that will be a separate learning experience for me.

### Frontend

#### React

Run the React app by doing `npm start` in the `/client` directory.

Honestly, I don't really have much to say about this part of the code other than that I learned a lot.

I read through the React docs and implemented what I learned with some okayish JavaScript code. There are inefficiencies that are clear and that I will tackle later on, but for now *it works*™.

## Plans For The Future

Again, check out [this branch](/nampng/pyssword/tree/server-encrypt-client-decrypt) if you want to check out my further work on this project.
I mostly want to make the interactions between the frontend and backend to be safe but also want the React frontend to be more responsive and nice looking as well.

If things go well, I might just use this project as my personal password manager.

If you've made it this far, thanks for reading and checking out my project!
