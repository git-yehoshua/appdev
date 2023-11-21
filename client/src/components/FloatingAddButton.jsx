import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import '../styles/floating-add-button.css';

const FloatingAddButton = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/admin');
  };

  return (
    <button className="floating-add-button" onClick={handleButtonClick}>
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
};

export default FloatingAddButton;
