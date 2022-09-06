import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

export default function AddMenu(props) {
    const [show, setShow] = useState(false);
    const [org, setOrg] = useState('default');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const clearForm = () => {
        setOrg('default');
        setUsername('');
        setPassword('');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const payload = { "organization": org, "username": username, "password": password }
        fetch("/add", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(() => {
                let orgData = { ...props.data[org] } || {};
                console.log(`Before change is: ${JSON.stringify(orgData)}`)
                orgData[username] = null;

                let newData = { ...props.data };
                newData[org] = orgData;
                props.setData(newData);
            })
            .then(console.log(`Called /add/ for ${org}, ${username}`))
            .then(clearForm())
    }

    return (
        <div className='container'>
            <Button variant="primary" onClick={handleShow}>
                Add Credential
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="addForm" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Organization</Form.Label>
                            <Form.Control required type="text" placeholder="Organization" value={org} onChange={(e) => setOrg(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control required type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button type="submit" form="addForm" variant="primary" onClick={handleClose}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}