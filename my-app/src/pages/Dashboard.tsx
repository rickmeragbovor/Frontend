import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import type { User } from "../types";

// Typage des statistiques
interface Statistiques {
  total_tickets: number;
  tickets_en_cours: number;
  tickets_clotures: number;
  tickets_en_attente: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Statistiques | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          axios.get<User>("/me/"),
          axios.get<Statistiques>("/stats/"),
        ]);
        setUser(userRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        localStorage.clear();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <h1 className="text-3xl font-bold mb-6 text-blue-700">
          Bienvenue {user.prenom} 👋
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500 text-sm">Tickets Totaux</h3>
            <p className="text-2xl font-bold text-gray-800">
              {stats?.total_tickets ?? "–"}
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500 text-sm">En Cours</h3>
            <p className="text-2xl font-bold text-blue-600">
              {stats?.tickets_en_cours ?? "–"}
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500 text-sm">En Attente</h3>
            <p className="text-2xl font-bold text-yellow-500">
              {stats?.tickets_en_attente ?? "–"}
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500 text-sm">Clôturés</h3>
            <p className="text-2xl font-bold text-green-600">
              {stats?.tickets_clotures ?? "–"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600">
            Utilisez le menu à gauche pour accéder à la gestion des tickets,
            consulter les rapports ou visualiser les statistiques détaillées.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
