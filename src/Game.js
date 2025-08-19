import React, { useState, useEffect } from 'react';
import Player from './components/Player';
import Enemy from './components/Enemy';
import Projectile from './components/Projectile';
import GameOver from './components/GameOver';
import mapImage from './assets/map.png';
import './Game.css';

// Dynamic viewport dimensions based on window size with minimum constraints
const getViewportDimensions = () => ({
  width: Math.max(320, window.innerWidth), // Minimum width for very small screens
  height: Math.max(240, window.innerHeight) // Minimum height for very small screens
});

const MAP_SCALE = 3; // Map is 3x larger than viewport
const getMapDimensions = (viewportWidth, viewportHeight) => ({
  width: viewportWidth * MAP_SCALE,
  height: viewportHeight * MAP_SCALE
});

// Enemy types and progression (reduced speeds)
const ENEMY_TYPES = {
  1: { emojis: ['🍓'], health: 1, speed: 1.0, damage: 5 },
  2: { emojis: ['🍎'], health: 2, speed: 1.2, damage: 8 },
  3: { emojis: ['🍊'], health: 3, speed: 1.4, damage: 12 },
  4: { emojis: ['🍌'], health: 4, speed: 1.6, damage: 15 }
};

const Game = ({ isActive = true, onGameOver }) => {
  const [viewportDimensions, setViewportDimensions] = useState(getViewportDimensions());
  const mapDimensions = getMapDimensions(viewportDimensions.width, viewportDimensions.height);

  const [player, setPlayer] = useState({
    x: mapDimensions.width / 2,
    y: mapDimensions.height / 2,
    health: 100,
    maxHealth: 100,
    damage: 1
  });
  const [enemies, setEnemies] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [keys, setKeys] = useState({});
  const [gameTime, setGameTime] = useState(0);
  const [playerMoving, setPlayerMoving] = useState(false);
  const [playerDirection, setPlayerDirection] = useState('down');
  const [camera, setCamera] = useState({
    x: mapDimensions.width / 2 - viewportDimensions.width / 2,
    y: mapDimensions.height / 2 - viewportDimensions.height / 2
  });
  const [lastFireTime, setLastFireTime] = useState(0);
  const [lastDamageTime, setLastDamageTime] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerFlashing, setPlayerFlashing] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  // Handle window resize with debouncing for better performance
  useEffect(() => {
    let resizeTimeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setViewportDimensions(getViewportDimensions());
      }, 100); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Reset game state only when becoming active (not on viewport changes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isActive) {
      const newMapDimensions = getMapDimensions(viewportDimensions.width, viewportDimensions.height);
      setPlayer({
        x: newMapDimensions.width / 2,
        y: newMapDimensions.height / 2,
        health: 100,
        maxHealth: 100,
        damage: 1
      });
      setEnemies([]);
      setProjectiles([]);
      setGameTime(0);
      setPlayerMoving(false);
      setPlayerDirection('down');
      setCamera({
        x: newMapDimensions.width / 2 - viewportDimensions.width / 2,
        y: newMapDimensions.height / 2 - viewportDimensions.height / 2
      });
      setLastFireTime(0);
      setLastDamageTime(0);
      setScore(0);
      setIsGameOver(false);
      setPlayerFlashing(false);
      setFinalScore(0);
      setFinalTime(0);
    }
  }, [isActive]); // Intentionally excluding viewportDimensions to prevent game reset on resize

  // Handle game over restart
  const handleGameOverRestart = () => {
    if (onGameOver) {
      onGameOver(finalScore, finalTime);
    }
  };

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

  // Helper functions
  const getCurrentEnemyTier = (gameTime) => {
    if (gameTime < 1800) return 1; // 0-30 seconds
    if (gameTime < 3600) return 2; // 30-60 seconds
    if (gameTime < 5400) return 3; // 60-90 seconds
    return 4; // 90+ seconds
  };

  const findNearestEnemy = (playerX, playerY, enemies) => {
    if (enemies.length === 0) return null;

    let nearest = enemies[0];
    let minDistance = Math.sqrt((playerX - nearest.x) ** 2 + (playerY - nearest.y) ** 2);

    for (let i = 1; i < enemies.length; i++) {
      const distance = Math.sqrt((playerX - enemies[i].x) ** 2 + (playerY - enemies[i].y) ** 2);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = enemies[i];
      }
    }

    return nearest;
  };

  const getDirectionToTarget = (fromX, fromY, toX, toY) => {
    const dx = toX - fromX;
    const dy = toY - fromY;

    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  };

  // Game loop using requestAnimationFrame for smoother performance
  useEffect(() => {
    if (!isActive || isGameOver) return;

    let animationId;
    let lastTime = 0;

    const gameLoop = (currentTime) => {
      if (currentTime - lastTime >= 16) { // ~60 FPS
        setGameTime(prev => prev + 1);
        lastTime = currentTime;

        // Move player and update camera
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
          newX = Math.max(48, Math.min(mapDimensions.width - 48, newX));
          newY = Math.max(48, Math.min(mapDimensions.height - 48, newY));

          // Update movement state
          setPlayerMoving(moving);
          setPlayerDirection(direction);

          // Update camera to follow the new player position
          const targetX = newX - viewportDimensions.width / 2;
          const targetY = newY - viewportDimensions.height / 2;
          const clampedX = Math.max(0, Math.min(mapDimensions.width - viewportDimensions.width, targetX));
          const clampedY = Math.max(0, Math.min(mapDimensions.height - viewportDimensions.height, targetY));

          setCamera({ x: clampedX, y: clampedY });

          return { ...prev, x: newX, y: newY };
        });

        // Auto-fire projectiles at nearest enemy
        setProjectiles(prev => {
          const now = Date.now();
          if (now - lastFireTime > 500 && enemies.length > 0) { // Fire every 500ms (decreased fire rate)
            const nearestEnemy = findNearestEnemy(player.x, player.y, enemies);
            if (nearestEnemy) {
              const fireDirection = getDirectionToTarget(player.x, player.y, nearestEnemy.x, nearestEnemy.y);
              setLastFireTime(now);

              return [...prev, {
                id: Date.now() + Math.random(),
                x: player.x,
                y: player.y,
                direction: fireDirection,
                speed: 4,
                damage: player.damage
              }];
            }
          }
          return prev;
        });

        // Move projectiles
        setProjectiles(prev => prev.map(projectile => {
          let newX = projectile.x;
          let newY = projectile.y;

          switch (projectile.direction) {
            case 'up': newY -= projectile.speed; break;
            case 'down': newY += projectile.speed; break;
            case 'left': newX -= projectile.speed; break;
            case 'right': newX += projectile.speed; break;
            default: break;
          }

          return { ...projectile, x: newX, y: newY };
        }).filter(projectile =>
          projectile.x > 0 && projectile.x < mapDimensions.width &&
          projectile.y > 0 && projectile.y < mapDimensions.height
        ));

        // Check projectile-enemy collisions
        let hitProjectileIds = new Set();
        let hitEnemyIds = new Set();
        let scoreToAdd = 0;

        // Find all collisions
        projectiles.forEach(projectile => {
          if (hitProjectileIds.has(projectile.id)) return;

          enemies.forEach(enemy => {
            if (hitEnemyIds.has(enemy.id) || hitProjectileIds.has(projectile.id)) return;

            const distance = Math.sqrt(
              (projectile.x - enemy.x) ** 2 + (projectile.y - enemy.y) ** 2
            );

            if (distance < 25) { // Hit detection
              hitProjectileIds.add(projectile.id);
              hitEnemyIds.add(enemy.id);

              const newHealth = enemy.health - projectile.damage;
              if (newHealth <= 0) {
                scoreToAdd += enemy.enemyTier * 10;
              }
            }
          });
        });

        // Update projectiles (remove hit ones)
        setProjectiles(prev => prev.filter(projectile => !hitProjectileIds.has(projectile.id)));

        // Update enemies (damage or remove)
        setEnemies(prev => prev.map(enemy => {
          if (hitEnemyIds.has(enemy.id)) {
            const newHealth = enemy.health - player.damage;
            if (newHealth <= 0) {
              return null; // Mark for removal
            }
            return { ...enemy, health: newHealth };
          }
          return enemy;
        }).filter(Boolean));

        // Update score
        if (scoreToAdd > 0) {
          setScore(prev => prev + scoreToAdd);
        }

        // Spawn enemies around the player's current area
        const currentTier = getCurrentEnemyTier(gameTime);
        const spawnRate = 0.008 + (currentTier - 1) * 0.002; // Increase spawn rate with tier

        if (Math.random() < spawnRate) {
          const side = Math.floor(Math.random() * 4);
          let x, y;

          switch (side) {
            case 0: x = camera.x - 50; y = camera.y + Math.random() * viewportDimensions.height; break;
            case 1: x = camera.x + viewportDimensions.width + 50; y = camera.y + Math.random() * viewportDimensions.height; break;
            case 2: x = camera.x + Math.random() * viewportDimensions.width; y = camera.y - 50; break;
            case 3: x = camera.x + Math.random() * viewportDimensions.width; y = camera.y + viewportDimensions.height + 50; break;
            default: x = camera.x - 50; y = camera.y + Math.random() * viewportDimensions.height; break;
          }

          // Keep enemies within map bounds
          x = Math.max(0, Math.min(mapDimensions.width, x));
          y = Math.max(0, Math.min(mapDimensions.height, y));

          const enemyType = ENEMY_TYPES[currentTier];
          const randomEmoji = enemyType.emojis[Math.floor(Math.random() * enemyType.emojis.length)];

          setEnemies(prev => [...prev, {
            id: Date.now() + Math.random(),
            x,
            y,
            health: enemyType.health,
            maxHealth: enemyType.health,
            type: randomEmoji,
            enemyTier: currentTier,
            speed: enemyType.speed,
            damage: enemyType.damage
          }]);
        }

        // Check enemy-player collisions with damage cooldown
        const now = Date.now();
        let playerTookDamage = false;
        let totalDamage = 0;

        enemies.forEach(enemy => {
          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Check collision with player (with damage cooldown)
          if (distance < 40 && now - lastDamageTime > 1000) { // 1 second damage cooldown
            totalDamage += enemy.damage;
            playerTookDamage = true;
          }
        });

        if (playerTookDamage) {
          setPlayer(prevPlayer => {
            const newHealth = Math.max(0, prevPlayer.health - totalDamage);

            // Check for game over
            if (newHealth <= 0 && !isGameOver) {
              setFinalScore(score);
              setFinalTime(gameTime);
              setIsGameOver(true);
            }

            return {
              ...prevPlayer,
              health: newHealth
            };
          });
          setLastDamageTime(now);

          // Flash effect
          setPlayerFlashing(true);
          setTimeout(() => setPlayerFlashing(false), 500);
        }

        // Move enemies toward player
        setEnemies(prev => prev.map(enemy => {
          const dx = player.x - enemy.x;
          const dy = player.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 0) {
            return {
              ...enemy,
              x: enemy.x + (dx / distance) * enemy.speed,
              y: enemy.y + (dy / distance) * enemy.speed
            };
          }
          return enemy;
        }));

      }
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [keys, player.x, player.y, player.damage, camera.x, camera.y, playerDirection, isActive, viewportDimensions, mapDimensions, enemies, projectiles, lastFireTime, lastDamageTime, gameTime, isGameOver, score]);

  return (
    <div className="game-container">
      <div
        className="viewport"
        style={{
          width: viewportDimensions.width,
          height: viewportDimensions.height,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          className="world"
          style={{
            width: mapDimensions.width,
            height: mapDimensions.height,
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
            isFlashing={playerFlashing}
          />
          {projectiles.map(projectile => (
            <Projectile
              key={projectile.id}
              x={projectile.x}
              y={projectile.y}
              direction={projectile.direction}
            />
          ))}
          {enemies.map(enemy => (
            <Enemy
              key={enemy.id}
              x={enemy.x}
              y={enemy.y}
              type={enemy.type}
              health={enemy.health}
              maxHealth={enemy.maxHealth}
              enemyTier={enemy.enemyTier}
            />
          ))}
        </div>
      </div>
      <div className="ui">
        <div>Health: {player.health}/{player.maxHealth}</div>
        <div>Time: {Math.floor(gameTime / 60)}s</div>
        <div>Score: {score}</div>
        <div>Enemies: {enemies.length}</div>
        <div>Tier: {getCurrentEnemyTier(gameTime)}</div>
      </div>
      {isGameOver && (
        <GameOver
          score={finalScore}
          timeAlive={finalTime}
          onRestart={handleGameOverRestart}
        />
      )}
    </div>
  );
};

export default Game;