import React, { useState } from 'react';
import './StartButton.css';

/**
 * @param {Object} props
 * @param {Function} props.onClick 
 */
const StartButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonImagePath = require('../assets/startbutton.png');

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      className="start-button"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundImage: `url(${buttonImagePath})`,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}
      aria-label="Start Game"
      type="button"
    >
    </button>
  );
};

export default StartButton;