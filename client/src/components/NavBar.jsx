import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
const navigate = useNavigate();

  const clickToHome = () => {
    navigate('/');
  };

  const clickToSignup = () => {
    navigate('/signup');
  }
  return (
    <div>
    <nav className="navbar sticky shadow">
    <ul>
        <button onClick={clickToHome}>
          <FontAwesomeIcon className='home-icon' icon={faHome}/> Home
        </button> 
        <button onClick={clickToSignup}>
          Sign up <FontAwesomeIcon icon={faUserPlus}/>
        </button>
    </ul>
  </nav>
  </div>
  )
}

export default NavBar