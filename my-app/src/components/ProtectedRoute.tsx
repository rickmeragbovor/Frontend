import React, { type PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps extends PropsWithChildren {
  allowedRoles?: string[]; // 👈 Ajouter cette prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérifie si l'utilisateur a un rôle autorisé
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <p className="text-center mt-10 text-red-600 text-lg">
        ⛔️ Accès refusé : cette page est réservée aux administrateurs ou supérieurs.
      </p>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
