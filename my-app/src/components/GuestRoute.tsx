// src/components/GuestRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const token = localStorage.getItem("access");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
