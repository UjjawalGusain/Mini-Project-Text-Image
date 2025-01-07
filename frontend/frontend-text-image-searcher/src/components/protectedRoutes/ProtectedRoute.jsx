import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  } 

  return element;
}

export default ProtectedRoute;
