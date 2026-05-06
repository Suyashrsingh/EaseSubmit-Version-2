import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./stores";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useAuthStore((state) => state.user);

  // If there's no authenticated user, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required and the user's role isn't included, redirect to an unauthorized/home page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; 
  }

  // Otherwise, render the requested component
  return children;
};

export default ProtectedRoute;
