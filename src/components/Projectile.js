import React from 'react';
import './Projectile.css';

const Projectile = ({ x, y, direction }) => {
  return (
    <div
      className="projectile"
      style={{
        left: x - 4,
        top: y - 4,
        transform: `rotate(${getRotation(direction)}deg)`
      }}
    />
  );
};

const getRotation = (direction) => {
  switch (direction) {
    case 'up': return -90;
    case 'down': return 90;
    case 'left': return 180;
    case 'right': return 0;
    default: return 0;
  }
};

export default Projectile;