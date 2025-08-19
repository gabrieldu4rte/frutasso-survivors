import React from 'react';
import './Enemy.css';

const Enemy = ({ x, y, type, health, maxHealth, enemyTier }) => {
  const getEnemyClass = () => {
    let className = 'enemy';
    if (enemyTier > 1) className += ` enemy-tier-${enemyTier}`;
    if (health < maxHealth) className += ' enemy-damaged';
    return className;
  };

  return (
    <div 
      className={getEnemyClass()}
      style={{
        left: x - 20,
        top: y - 20
      }}
    >
      <div className="enemy-sprite">{type}</div>
      {health < maxHealth && (
        <div className="enemy-health-bar">
          <div 
            className="enemy-health-fill"
            style={{
              width: `${(health / maxHealth) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Enemy;