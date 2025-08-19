import React from 'react';
import './StartScreen.css';
import backgroundImage from '../assets/background.png';
import titleImage from '../assets/title.png';
import StartButton from './StartButton';

const StartScreen = ({ onStartGame }) => {
  return (
    <div className="start-screen">
      <div className="start-screen-background">
        <img 
          src={backgroundImage} 
          alt="Game background" 
          className="background-image"
        />
      </div>
      
      <div className="start-screen-content">
        <div className="title-container">
          <img 
            src={titleImage} 
            alt="Game title" 
            className="title-image"
          />
        </div>
        
        <div className="button-container">
          <StartButton onClick={onStartGame} />
        </div>
      </div>
    </div>
  );
};

export default StartScreen;