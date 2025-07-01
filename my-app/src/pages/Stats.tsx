// src/pages/Ticketing.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import type { User } from "../types";

const Ticketing = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchUser = async () => {
      try {
        const response = await axios.get<User>("/me/");
        setUser(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        localStorage.clear();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  if (!user)
    return (
      <div className="p-8 text-center text-red-600">
        Utilisateur non authentifié.
      </div>
    );

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-800">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-8 overflow-auto bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Espace Statistiques</h1>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-700">
            Bienvenue sur la page dédiée aux états et statistiques 
          </p>
          {/* Ajoute ici le contenu spécifique du ticketing (tableau, formulaire, etc.) */}
        </div>
      </main>
    </div>
  );
};

export default Ticketing;
