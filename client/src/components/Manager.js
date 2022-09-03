import React from "react";
import Button from "react-bootstrap/esm/Button";

import AddMenu from "./AddMenu";

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
            .then(resp => setPassword(resp.data))
            .then(console.log(`Called /get/ for ${props.orgName}, ${props.username}`))
    })

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
            .then(() => props.handleReload())
            .then(console.log(`Called /delete/ for ${props.orgName}, ${props.username}`))
    }

    return (
        <div className="d-flex flex-row justify-content-between align-items-center h-100">
            <div className="d-flex align-items-center w-50">
                <p className="">Username: {props.username}</p>
            </div>
            <div className="d-flex align-items-center w-50">
                <p className="">Password: {showPassword ? password : '*'.repeat(5)}</p>
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

    for (let username of props.usernames) {
        rows.push(<Credential key={username} username={username} orgName={props.orgName} handleReload={props.handleReload} />)
    }

    return (
        <div className="my-2 p-3 bg-light">
            <h1 className="border-bottom">{props.orgName}</h1>
            {rows}
        </div>
    );
}

export default function Manager(props) {
    const [data, setData] = React.useState("{}");
    const [reload, setReload] = React.useState(false);

    React.useEffect(() => {
        fetch('/get/all', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(resp => setData(resp.data))
            .then(console.log("Called /get/all/"))
    })

    let handleReload = () => {
        setReload(!reload);
    }

    let rows = [];
    let dict = JSON.parse(data)

    for (let org in dict) {
        rows.push(<Organization key={org} orgName={org} usernames={dict[org]} handleReload={handleReload} />)
    }

    return (
        <div className="d-flex flex-column justify-contents-center my-3">
            <AddMenu handleReload={handleReload} />
            <div className="container my-3">
                {rows.length === 0 ? <h1>No credentials. Add some with the button above!</h1> : rows}
            </div>
        </div>
    );
}