import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import '../styles/floating-history-button.css';

const FloatingHistoryButton = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/history');
  };

  return (
    <button className="floating-history-button" onClick={handleButtonClick}>
      <FontAwesomeIcon icon={faHistory} />
    </button>
  );
};

export default FloatingHistoryButton;
