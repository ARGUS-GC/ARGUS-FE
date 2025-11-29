// components/Card.js
import React from 'react';

const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700 ${className}`}>
      {title && <h2 className="text-lg font-semibold mb-3 flex items-center">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;