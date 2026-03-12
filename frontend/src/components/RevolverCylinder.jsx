import { useState } from 'react';

const RevolverCylinder = ({ className = '', hoverSpeed = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative w-64 h-64 md:w-80 md:h-80 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        viewBox="0 0 200 200"
        className={`w-full h-full transition-transform duration-300 ${
          isHovered ? 'animate-spin-fast' : 'animate-spin-slow'
        }`}
      >
        {/* Center hub */}
        <circle
          cx="100"
          cy="100"
          r="25"
          fill="none"
          stroke="white"
          strokeWidth="3"
          className="opacity-80"
        />
        
        {/* Inner circle */}
        <circle
          cx="100"
          cy="100"
          r="45"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="5,5"
          className="opacity-40"
        />
        
        {/* Outer ring */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="white"
          strokeWidth="3"
          className="opacity-60"
        />
        
        {/* Six chambers */}
        {[0, 60, 120, 180, 240, 300].map((angle, index) => {
          const radian = (angle * Math.PI) / 180;
          const x = 100 + 65 * Math.cos(radian);
          const y = 100 + 65 * Math.sin(radian);
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="18"
                fill="none"
                stroke="white"
                strokeWidth="2"
                className="opacity-90"
              />
              <circle
                cx={x}
                cy={y}
                r="12"
                fill="none"
                stroke="red"
                strokeWidth="1.5"
                strokeDasharray="3,3"
                className="opacity-50"
              />
            </g>
          );
        })}
        
        {/* Decorative lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const radian = (angle * Math.PI) / 180;
          const x1 = 100 + 45 * Math.cos(radian);
          const y1 = 100 + 45 * Math.sin(radian);
          const x2 = 100 + 85 * Math.cos(radian);
          const y2 = 100 + 85 * Math.sin(radian);
          
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth="1"
              className="opacity-20"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default RevolverCylinder;