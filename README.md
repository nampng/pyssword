# pyssword - BitWarden Clone

BitWarden is a cool password management app so I wanted to see if I could try making it myself.

Pardon me if the terminology here is wrong or mixed up. Let me know if that is the case.

Have done:
1. Create an API to create, delete, update, and get passwords.
2. Encrypt and decrypt passwords based on a master key.
    - I'm not sure if BitWarden does it this way, but it makes sense:
        - encryption: 
        1. kdf made with a random salt -> encryption key derived from kdf(master_key)
        2. encryption key used to encrypt password
        3. store encrypted password and salt
        - decryption:
        4. To reverse the encryption you will need the EXACT same encryption key
        5. grab salt from DB to get the kdf
        6. get the same encryption key by doing kdf(master_key)
        7. decrypt by doing key.decrypt(encrypted_password)

Todo:
1. Make a fancy UI for the API
