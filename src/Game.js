import React, { useState, useEffect } from 'react';
import Player from './components/Player';
import Enemy from './components/Enemy';
import mapImage from './assets/map.png';
import './Game.css';

const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 600;
const MAP_WIDTH = 2400;  // 3x viewport width
const MAP_HEIGHT = 1800; // 3x viewport height

const Game = () => {
  const [player, setPlayer] = useState({ x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2, health: 100 });
  const [enemies, setEnemies] = useState([]);
  const [keys, setKeys] = useState({});
  const [gameTime, setGameTime] = useState(0);
  const [playerMoving, setPlayerMoving] = useState(false);
  const [playerDirection, setPlayerDirection] = useState('down');
  const [camera, setCamera] = useState({ x: 0, y: 0 });

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop using requestAnimationFrame for smoother performance
  useEffect(() => {
    let animationId;
    let lastTime = 0;

    const gameLoop = (currentTime) => {
      if (currentTime - lastTime >= 16) { // ~60 FPS
        setGameTime(prev => prev + 1);
        lastTime = currentTime;

        // Move player
        setPlayer(prev => {
          let newX = prev.x;
          let newY = prev.y;
          let moving = false;
          let direction = playerDirection;

          if (keys['a'] || keys['A'] || keys['ArrowLeft']) {
            newX -= 4;
            moving = true;
            direction = 'left';
          }
          if (keys['d'] || keys['D'] || keys['ArrowRight']) {
            newX += 4;
            moving = true;
            direction = 'right';
          }
          if (keys['w'] || keys['W'] || keys['ArrowUp']) {
            newY -= 4;
            moving = true;
            direction = 'up';
          }
          if (keys['s'] || keys['S'] || keys['ArrowDown']) {
            newY += 4;
            moving = true;
            direction = 'down';
          }

          // Keep player in bounds of the larger map
          newX = Math.max(48, Math.min(MAP_WIDTH - 48, newX));
          newY = Math.max(48, Math.min(MAP_HEIGHT - 48, newY));

          // Update movement state
          setPlayerMoving(moving);
          setPlayerDirection(direction);

          return { ...prev, x: newX, y: newY };
        });

        // Update camera to follow player
        setCamera(prev => {
          const targetX = player.x - VIEWPORT_WIDTH / 2;
          const targetY = player.y - VIEWPORT_HEIGHT / 2;

          // Keep camera within map bounds
          const clampedX = Math.max(0, Math.min(MAP_WIDTH - VIEWPORT_WIDTH, targetX));
          const clampedY = Math.max(0, Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT, targetY));

          return { x: clampedX, y: clampedY };
        });

        // Spawn enemies around the player's current area
        if (Math.random() < 0.005) {
          const side = Math.floor(Math.random() * 4);
          let x, y;

          switch (side) {
            case 0: x = camera.x - 50; y = camera.y + Math.random() * VIEWPORT_HEIGHT; break;
            case 1: x = camera.x + VIEWPORT_WIDTH + 50; y = camera.y + Math.random() * VIEWPORT_HEIGHT; break;
            case 2: x = camera.x + Math.random() * VIEWPORT_WIDTH; y = camera.y - 50; break;
            case 3: x = camera.x + Math.random() * VIEWPORT_WIDTH; y = camera.y + VIEWPORT_HEIGHT + 50; break;
          }

          // Keep enemies within map bounds
          x = Math.max(0, Math.min(MAP_WIDTH, x));
          y = Math.max(0, Math.min(MAP_HEIGHT, y));

          // Random vegetable/fruit emojis
          const enemyTypes = ['🥕', '🥬', '🥒', '🍅', '🥔', '🌽', '🍎', '🍊', '🍌', '🥦', '🍇', '🍓'];
          const randomEmoji = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

          setEnemies(prev => [...prev, {
            id: Date.now() + Math.random(),
            x,
            y,
            health: 1,
            type: randomEmoji
          }]);
        }

        // Move enemies toward player
        setEnemies(prev => prev.map(enemy => {
          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0) {
            const speed = 1.5;
            return {
              ...enemy,
              x: enemy.x + (dx / distance) * speed,
              y: enemy.y + (dy / distance) * speed
            };
          }
          return enemy;
        }));

      }
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [keys, player.x, player.y]);

  return (
    <div className="game-container">
      <div
        className="viewport"
        style={{
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          className="world"
          style={{
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            transform: `translate(-${camera.x}px, -${camera.y}px)`,
            backgroundImage: `url(${mapImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            position: 'absolute'
          }}
        >
          <Player
            x={player.x}
            y={player.y}
            isMoving={playerMoving}
            direction={playerDirection}
          />
          {enemies.map(enemy => (
            <Enemy key={enemy.id} x={enemy.x} y={enemy.y} type={enemy.type} />
          ))}
        </div>
      </div>
      <div className="ui">
        <div>Health: {player.health}</div>
        <div>Time: {Math.floor(gameTime / 60)}s</div>
        <div>Enemies: {enemies.length}</div>
        <div>Position: ({Math.floor(player.x)}, {Math.floor(player.y)})</div>
      </div>
    </div>
  );
};

export default Game;