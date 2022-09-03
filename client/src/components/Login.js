import React from 'react'

export default function Login(props) {
    const [key, setKey] = React.useState('');
    const [msg, setMsg] = React.useState('');

    const handleChange = (event) => {
        setKey(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = { 'password': key };
        fetch("/login", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(resp => {
                setMsg(resp.message)
                if (resp.data === '1') {
                    props.setIsLoggedIn(true)
                }
            })
            .then(console.log("Called /login/"))
    }

    const handleRegister = (event) => {
        event.preventDefault();
        const data = { 'password': key };
        fetch("/key", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(resp => setMsg(resp.message))
    }

    return (
        <div className='container w-50'>
            <form onSubmit={handleSubmit}>
                <div className='my-3'>
                    <label className='form-label'>Master key</label>
                    <input type='password' className='form-control' onChange={handleChange}></input>
                </div>
                <div className='my-3'>
                    <button type="submit" className='btn btn-primary'>Log In</button>
                </div>
                <div>
                    <button className='btn btn-secondary' onClick={handleRegister}>Register</button>
                </div>
            </form>
            <div className='my-3'>
                {msg === '' ? null : <p className='text-danger'>{msg}</p>}
            </div>
        </div>
    );
}