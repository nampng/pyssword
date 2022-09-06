# pyssword - BitWarden Clone

BitWarden is a cool password management app so I wanted to see if I could try making it myself.

Current happenings:

So currently, encryption and decryption happens on the backend, and the frontend's only purpose is to just allow to user to call the API easily and have a nice UI to see and interact with their passwords.

However, a glaring problem is present, which will be fixed up sooner or later. The problem is that the passwords are sent over to the frontend unencrypted. Ideally, I want to encrypt the passwords on the backend and then retrieve the token when calling the API. I can then decrypt the token on the frontend.
