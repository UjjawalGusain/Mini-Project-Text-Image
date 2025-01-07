import React, { useEffect, useRef, useState } from "react";

function FloatingImage({ src, alt, initialPositionIndex }) {
  const imageRef = useRef();

  const predefinedPositions = [
    { x: 50, y: 50 },     // Top Left
    { x: 50, y: 400 },    // Bottom Left
    { x: 1200, y: 400 },  // Bottom Right
    { x: 1200, y: 50 },   // Top Right
  ];

  const [currentPosition, setCurrentPosition] = useState(predefinedPositions[initialPositionIndex]);
  const [positionIndex, setPositionIndex] = useState(initialPositionIndex);

  const moveToNextPosition = () => {
    const nextIndex = (positionIndex + 1) % predefinedPositions.length; 
    setPositionIndex(nextIndex); 
    setCurrentPosition(predefinedPositions[nextIndex]); 
  };

  useEffect(() => {
    const interval = setInterval(moveToNextPosition, 5000); 

    return () => clearInterval(interval);
  }, [positionIndex]);

  return (
    <div className="absolute z-20">
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-64 h-72 rounded-md shadow-lg"
        style={{
          transition: "transform 5s ease-in-out", 
          transform: `translate(${currentPosition.x}px, ${currentPosition.y}px)`,
        }}
      />
    </div>
  );
}

export default FloatingImage;
