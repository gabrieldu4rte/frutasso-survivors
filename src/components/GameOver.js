import React, { useState, useEffect } from 'react';
import './GameOver.css';

const GameOver = ({ score, timeAlive, onRestart }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleRestart = () => {
    setIsVisible(false);
    setTimeout(() => {
      onRestart();
    }, 300);
  };

  return (
    <div className={`game-over-overlay ${isVisible ? 'visible' : ''}`}>
      <div className="game-over-content">
        <div className="game-over-title">GAME OVER</div>
        <div className="game-over-stats">
          <div className="stat-item">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time Survived:</span>
            <span className="stat-value">{Math.floor(timeAlive / 60)}s</span>
          </div>
        </div>
        <button className="restart-button" onClick={handleRestart}>
          TRY AGAIN
        </button>
      </div>
    </div>
  );
};

export default GameOver;