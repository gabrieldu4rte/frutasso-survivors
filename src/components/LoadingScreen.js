import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onLoadComplete, minLoadTime = 2000 }) => {
  const [animationFrame, setAnimationFrame] = useState(0);
  const [dots, setDots] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Player animation configuration (same as Player component)
  const DISPLAY_SIZE = 96;
  const COLUMNS = 6;
  const ANIMATION_SPEED = 200;
  const MOVE_DOWN_ROW = 3; // Use the running down animation

  // Animate the player sprite
  useEffect(() => {
    const animationTimer = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % COLUMNS);
    }, ANIMATION_SPEED);

    return () => clearInterval(animationTimer);
  }, [COLUMNS, ANIMATION_SPEED]);

  // Animate the loading dots
  useEffect(() => {
    const dotsTimer = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotsTimer);
  }, []);

  // Handle loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      if (onLoadComplete) {
        onLoadComplete();
      }
    }, minLoadTime);

    return () => clearTimeout(timer);
  }, [minLoadTime, onLoadComplete]);

  const backgroundX = -(animationFrame * DISPLAY_SIZE);
  const backgroundY = -(MOVE_DOWN_ROW * DISPLAY_SIZE);

  return (
    <div className={`loading-screen ${isComplete ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-player">
          <div
            className="player-sprite"
            style={{
              width: DISPLAY_SIZE,
              height: DISPLAY_SIZE,
              backgroundPosition: `${backgroundX}px ${backgroundY}px`
            }}
          />
        </div>
        <div className="loading-text">
          Loading{dots}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;