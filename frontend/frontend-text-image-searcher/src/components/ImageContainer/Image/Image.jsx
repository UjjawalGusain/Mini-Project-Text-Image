import React from "react";

function Image({ src, alt }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default Image