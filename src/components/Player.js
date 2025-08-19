import React, { useState, useEffect } from 'react';
import './Player.css';

const Player = ({ x, y, isMoving, direction }) => {
  const [animationFrame, setAnimationFrame] = useState(0);

  // Tileset configuration for 10 rows x 6 columns (using first 6 rows)
  const FRAME_WIDTH = 42;  // Width of each frame in pixels
  const FRAME_HEIGHT = 42; // Height of each frame in pixels
  const DISPLAY_SIZE = 96; // Display size (much larger for better visibility)
  const COLUMNS = 6;       // Number of columns in tileset
  const ANIMATION_SPEED = 200; // Milliseconds between frames

  // Row definitions based on direction and state
  const ROWS = {
    IDLE_DOWN: 0,    // Idle facing camera (down)
    IDLE_RIGHT: 1,   // Idle facing right
    IDLE_UP: 2,      // Idle facing back (up)
    MOVE_DOWN: 3,    // Movement facing down
    MOVE_RIGHT: 4,   // Movement facing right
    MOVE_UP: 5       // Movement facing up
  };

  useEffect(() => {
    const animationTimer = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % COLUMNS);
    }, ANIMATION_SPEED);

    return () => clearInterval(animationTimer);
  }, [COLUMNS, ANIMATION_SPEED]);

  // Determine which row to use based on movement state and direction
  const getAnimationRow = () => {
    if (isMoving) {
      switch (direction) {
        case 'up': return ROWS.MOVE_UP;
        case 'down': return ROWS.MOVE_DOWN;
        case 'left': return ROWS.MOVE_RIGHT; // Use right row, will be mirrored
        case 'right': return ROWS.MOVE_RIGHT;
        default: return ROWS.MOVE_DOWN;
      }
    } else {
      switch (direction) {
        case 'up': return ROWS.IDLE_UP;
        case 'down': return ROWS.IDLE_DOWN;
        case 'left': return ROWS.IDLE_RIGHT; // Use right row, will be mirrored
        case 'right': return ROWS.IDLE_RIGHT;
        default: return ROWS.IDLE_DOWN;
      }
    }
  };

  const currentRow = getAnimationRow();
  const backgroundX = -(animationFrame * DISPLAY_SIZE);
  const backgroundY = -(currentRow * DISPLAY_SIZE);

  // Mirror sprite for left direction
  const shouldMirror = direction === 'left';

  return (
    <div
      className="player"
      style={{
        left: x - DISPLAY_SIZE / 2,
        top: y - DISPLAY_SIZE / 2,
        width: DISPLAY_SIZE,
        height: DISPLAY_SIZE,
        backgroundPosition: `${backgroundX}px ${backgroundY}px`,
        transform: shouldMirror ? 'scaleX(-1)' : 'none'
      }}
    />
  );
};

export default Player;