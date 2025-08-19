import React, { useState } from 'react';
import Game from './Game';
import StartScreen from './components/StartScreen';
import LoadingScreen from './components/LoadingScreen';

const App = () => {
  const [gameState, setGameState] = useState('initial-loading');

  const handleInitialLoadComplete = () => {
    setGameState('start-screen');
  };

  const handleStartGame = () => {
    setGameState('game-loading');
  };

  const handleGameLoadComplete = () => {
    setGameState('playing');
  };

  const handleGameOver = (finalScore, timeAlive) => {
    console.log(`Game Over! Score: ${finalScore}, Time: ${Math.floor(timeAlive / 60)}s`);
    setGameState('game-over-loading');
  };

  const handleGameOverLoadComplete = () => {
    setGameState('start-screen');
  };

  return (
    <div className="app">
      {gameState === 'initial-loading' && (
        <LoadingScreen 
          onLoadComplete={handleInitialLoadComplete}
          minLoadTime={2000}
        />
      )}
      {gameState === 'start-screen' && (
        <StartScreen onStartGame={handleStartGame} />
      )}
      {gameState === 'game-loading' && (
        <LoadingScreen 
          onLoadComplete={handleGameLoadComplete}
          minLoadTime={1500}
        />
      )}
      {gameState === 'playing' && (
        <Game isActive={gameState === 'playing'} onGameOver={handleGameOver} />
      )}
      {gameState === 'game-over-loading' && (
        <LoadingScreen 
          onLoadComplete={handleGameOverLoadComplete}
          minLoadTime={1500}
        />
      )}
    </div>
  );
};

export default App;