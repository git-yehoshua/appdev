import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/');
  };
  return (
    <div>
    <nav className="navbar sticky shadow">
    <ul>
        <button onClick={handleButtonClick}>
            <FontAwesomeIcon icon={faHome}/>
            </button> 
    </ul>
  </nav>
  </div>
  )
}

export default NavBar