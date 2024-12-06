import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Allow unauthenticated users to access public routes
  if (!user) {
    return children;
  }

  // Allow authenticated users with unverified email to access /login, /verification-check, and /signup
  if (user && !user.emailVerified) {
    if (
      location.pathname === "/verification-check" || 
      location.pathname === "/login" || 
      location.pathname === "/signup"
    ) {
      return children;
    }
    return <Navigate to="/login" replace />;
  }

  // Redirect authenticated users with verified email away from public routes
  return <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
