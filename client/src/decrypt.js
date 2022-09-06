import fernet from 'fernet';
import crypto from 'crypto';
import { Buffer } from 'buffer';

export function decryptToken(masterKey, salt, token) {
    // var fernet = require('fernet');
    // const crypto = require('crypto');


    let derivedKey = ''

    try {
        derivedKey = crypto.pbkdf2Sync(masterKey, salt, 390000, 32, 'sha256');
    } catch (error) {
        throw error;
    }

    var base64Key = btoa(String.fromCharCode.apply(null, new Uint8Array(derivedKey)));

    // let base64Key = Buffer.from(derivedKey).toString('base64url')
    // let base64Key = atob(derivedKey)

    // return "NOT THE REAL RESULT"

    var secret = new fernet.Secret(base64Key);
    var derivedToken = new fernet.Token({
        secret: secret,
        token: token,
        ttl: 0
    })

    return derivedToken.decode();
}

// function testFunction() {
//     // Result should be 123
//     let salt = Buffer.from("K9WidnukxwGPszhXCOLNSg==", "base64url")
//     let masterKey = "123456"
//     let token = "gAAAAABjFm_IIz8HW5-XZ2APRSrVTyW932L5Q4HZpaOJv93h4qFIiugIgLymw51J0DEOlTqbjOvICGUT-FkjK5wAGvYj6GWbEQ=="

//     result = decryptToken(masterKey, salt, token)

//     console.log(`result: ${result}`)
// }

// testFunction()