// src/components/Sidebar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types";

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 h-full bg-white p-6 shadow-md flex flex-col justify-between">
      {/* Profil utilisateur */}
      <div>
        <div className="font-bold text-xl text-gray-800">
          {user.prenom} {user.nom}
        </div>
        <div className="text-sm text-gray-500">{user.email}</div>
        <div className="text-xs text-gray-400 italic mt-1">Rôle : {user.role}</div>

        {/* Navigation */}
        <nav className="mt-10 space-y-3">
          {/* Bouton Home */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 transition"
          >
            🏠 Accueil
          </button>

          <button
            onClick={() => navigate("/ticketing")}
            className="w-full text-left px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 transition"
          >
            🎫 Gestion des Tickets
          </button>

          <button
            onClick={() => navigate("/stats")}
            className="w-full text-left px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 transition"
          >
            📊 Statistiques & États
          </button>
        </nav>
      </div>

      {/* Déconnexion */}
      <button
        onClick={onLogout}
        className="w-full text-left mt-6 px-4 py-2 text-red-600 font-medium rounded hover:bg-red-50 transition"
      >
        🚪 Déconnexion
      </button>
    </aside>
  );
};

export default Sidebar;
