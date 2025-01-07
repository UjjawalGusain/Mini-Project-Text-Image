import React, { useEffect, useState } from "react";
import Button from "../buttons/Button";
import {jwtDecode} from "jwt-decode"; 
import { useNavigate } from 'react-router-dom';

function DashboardHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token); 

        const isTokenValid = decodedToken.exp * 1000 > Date.now();
        setIsLoggedIn(isTokenValid);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate('/'); 
    alert("Logged out successfully!");
  };

  return (
    <div className="w-full h-16 flex justify-end px-5">
      <div className="flex p-3 gap-5">
        {isLoggedIn ? (
          <Button name="Log Out" onClick={handleLogout} />
        ) : (
          <>
            <Button name="Log In" />
            <Button name="Sign Up" />
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardHeader;
