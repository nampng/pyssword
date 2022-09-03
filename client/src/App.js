import React from 'react'
import Login from './components/Login'
import Manager from './components/Manager'


import './App.css';

function App() {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  if (!isLoggedIn) {
    return (
      <div className='d-flex flex-column justify-content-center align-items-center vh-100'>
        {<Login setIsLoggedIn={setIsLoggedIn} />}
      </div>
    );
  }

  return (
    <div className='d-flex flex-column'>
      <div className='container'>
        <h1>Pyssword</h1>
      </div>
      <Manager />
    </div>
  );
}

export default App;
