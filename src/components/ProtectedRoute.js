import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // Redirect unauthenticated users to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect unverified users to the verification-check page
  if (!user.emailVerified) {
    return <Navigate to="/login" replace />;
  }

  // Allow access to the protected route
  return children;
};

export default ProtectedRoute;
