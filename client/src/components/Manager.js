import React from "react";
import Button from "react-bootstrap/esm/Button";

import AddMenu from "./AddMenu";

import { decryptToken } from "../decrypt";

function Credential(props) {
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)

    React.useEffect(() => {
        const data = { "organization": props.orgName, "username": props.username, "password": "" };
        fetch('/get/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(resp => {
                let salt, token;
                let masterKey = props.masterKey;
                [salt, token] = resp.data;

                let res = decryptToken(masterKey, salt, token)

                setPassword(res)
            })
            .then(console.log(`Called /get/ for ${props.orgName}, ${props.username}`))
    }, [props.masterKey, props.orgName, props.username])

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
    }

    const handleShow = () => {
        setShowPassword(!showPassword);
    }

    const handleDelete = () => {
        const data = { "organization": props.orgName, "username": props.username, "password": "" };
        fetch('/delete/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(() => {
                let currData = { ...props.data };
                delete currData[props.orgName][props.username];
                props.setData(currData);
            })
            .then(console.log(`Called /delete/ for ${props.orgName}, ${props.username}`))
    }

    return (
        <div className="d-flex flex-row justify-content-between align-items-center h-100 fs-5 border-bottom">
            <div className="d-flex align-items-center w-50 h-auto">
                <p className="vertical">Username: {props.username}</p>
            </div>
            <div className="d-flex align-items-center w-50">
                <p className="vertical">Password: {showPassword ? password : '*'.repeat(5)}</p>
            </div>
            <div className="d-flex align-items-center">
                <Button className="btn-success" onClick={handleCopy}>Copy</Button>
                <Button className="mx-3" onClick={handleShow}>{showPassword ? "Hide" : "Show"}</Button>
                <Button className="btn-danger" onClick={handleDelete}>Delete</Button>
            </div>
        </div>
    );
}

function Organization(props) {
    let rows = [];

    for (let username in props.usernames) {
        console.log(`Adding username ${username}`)
        rows.push(<Credential key={username} username={username} orgName={props.orgName} setData={props.setData} data={props.data} masterKey={props.masterKey} />)
    }

    return (
        <div className="my-2 p-3 bg-light">
            <h1 className="border-bottom">{props.orgName}</h1>
            {rows}
        </div>
    );
}

// Why do an API call every time? Just API call what's changed in the dict.
// So let's do this. Call /get/all in the beginning which will get us all of the orgs and users we need -> convert to dict
// We can alter the dict when doing a /add/ or /delete/ call.
// We can then render each of these orgs and users w/o calling /get/.
// If we need the passwords to be shown / copied, THEN call the /get/ API since we need it at that time only

export default function Manager(props) {
    const [data, setData] = React.useState({});

    React.useEffect(() => {
        fetch('/get/all', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(resp => setData(JSON.parse(resp.data)))
            .then(console.log("Called /get/all/"))

    }, [])

    let rows = [];

    for (let org in data) {
        if (Object.keys(data[org]).length === 0) {
            continue;
        }

        // console.log(`Adding org ${org} with contains ${JSON.stringify(data[org])}`);
        rows.push(<Organization key={org} orgName={org} usernames={data[org]} setData={setData} data={data} masterKey={props.masterKey} />)
    }

    return (
        <div className="d-flex flex-column justify-contents-center my-5">
            <AddMenu setData={setData} data={data} />
            <div className="container my-3">
                {rows.length === 0 ? <h1>No credentials. Add some with the button above!</h1> : rows}
            </div>
        </div>
    );
}