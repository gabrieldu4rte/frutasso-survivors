import React from 'react';
import './Enemy.css';

const Enemy = ({ x, y, type }) => {
  return (
    <div 
      className="enemy"
      style={{
        left: x - 20,
        top: y - 20
      }}
    >
      {type}
    </div>
  );
};

export default Enemy;