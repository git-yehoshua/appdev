import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, useActionData } from 'react-router-dom';
import Dashboard from './modules/dashboard';
import Admin from './modules/admin';
import { useState } from 'react';
import Login from './modules/Login';
import Signup from './modules/Signup';

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <div>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path='/admin' element={isLoggedIn ? <Admin /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/signup' element ={<Signup/>}/>
        </Routes>
       </Router>
      </div>
    </>
  )
}

export default App
