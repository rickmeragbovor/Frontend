// src/components/Sidebar.tsx
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { User } from "../types";

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

interface NavButtonProps {
  label: string;
  emoji?: string;
  to: string;
  className?: string;
  onClick?: () => void;
}

const NavButton = ({ label, emoji, to, className = "", onClick }: NavButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className={
        "w-full text-left px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded hover:bg-blue-200 transition " +
        className
      }
    >
      {emoji && <span className="mr-2">{emoji}</span>}
      {label}
    </button>
  );
};

const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Au revoir 👋", { autoClose: 2000 });
    navigate("/login");
    if (onLogout) onLogout();
  };

  return (
    <aside className="w-64 h-full bg-white p-6 shadow-md flex flex-col justify-between">
      {/* Section profil utilisateur */}
      <div>
        <div className="font-bold text-xl text-gray-800">{user.prenom} {user.nom}</div>
        <div className="text-sm text-gray-500">{user.email}</div>
        <div className="text-xs text-gray-400 italic mt-1">Rôle : {user.role}</div>

        {/* Navigation principale */}
        <nav className="mt-10 space-y-3">
          <NavButton label="Accueil" emoji="🏠" to="/dashboard" />
          <NavButton label="Gestion des Tickets" emoji="🎫" to="/ticketing" />
          <NavButton label="Statistiques & États" emoji="📊" to="/stats" />
          <NavButton label="Nos techniciens" emoji="👥" to="/nostechniciens" className="mt-2" />
        </nav>
      </div>

      {/* Bouton de déconnexion stylé */}
      <button
        onClick={handleLogout}
        className="w-full mt-6 text-sm px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition font-semibold shadow"
      >
        Déconnexion
      </button>
    </aside>
  );
};

export default Sidebar;
