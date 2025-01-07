import React from 'react';
import { useNavigate } from 'react-router-dom';

function Button({ name, onClick }) {
  const navigate = useNavigate();

  // Handle button click
  const handleClick = () => {
    if (name.toLowerCase() === 'sign up') {
      navigate('/signup');
    }
    if (name.toLowerCase() === 'log in') {
      navigate('/login');
    }
    if (name.toLowerCase() === 'log out' && onClick) {
      onClick(); 
    }
  };

  return (
    <div
      className="z-30 bg-blue-200 bg-opacity-80 w-fit h-fit px-10 py-2 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out relative cursor-pointer"
      onClick={handleClick}
    >
      <div className="absolute inset-0 rounded-lg blur-[200px] bg-gradient-to-r from-blue-200 to-blue-500 opacity-50 -z-10"></div>
      <span className="text-black font-medium text-lg">{name}</span>
    </div>
  );
}

export default Button;
