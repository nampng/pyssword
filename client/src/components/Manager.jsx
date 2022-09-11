import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";

import AddMenu from "./AddMenu";

function Credential(props) {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
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
            .then(resp => setPassword(resp.data))
            .then(console.log(`Called /get/ for ${props.orgName}, ${props.username}`))
    }, [])

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
        rows.push(<Credential key={username} username={username} orgName={props.orgName} setData={props.setData} data={props.data} />)
    }

    return (
        <div className="my-2 p-3 bg-light">
            <h1 className="border-bottom">{props.orgName}</h1>
            {rows}
        </div>
    );
}

export default function Manager(props) {
    const [data, setData] = useState({});

    console.log("Rendered");

    useEffect(() => {
        fetch('/get/all', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(resp => {
                setData(JSON.parse(resp.data))
            })
            .then(console.log("Called /get/all/"))
    }, [])


    let rows = []

    for (let org in data) {
        if (Object.keys(data[org]).length === 0) {
            continue;
        }

        // console.log(`Adding org ${org} with contains ${JSON.stringify(data[org])}`);
        rows.push(<Organization key={org} orgName={org} usernames={data[org]} setData={setData} data={data} />)
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