import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import type { User } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Statistiques {
  total_tickets: number;
  tickets_en_cours: number;
  tickets_clotures: number;
  tickets_en_attente: number;
}

const activityData = [
  { month: "Jan", tickets: 30 },
  { month: "Feb", tickets: 45 },
  { month: "Mar", tickets: 20 },
  { month: "Apr", tickets: 60 },
  { month: "May", tickets: 40 },
  { month: "Jun", tickets: 75 },
  { month: "Jul", tickets: 50 },
];

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
    <div className="flex h-screen w-screen bg-[#f5f5f5] text-gray-800">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="flex-1 p-6 overflow-auto bg-[#f9f9f9]">
        <h1 className="text-3xl font-bold mb-8 text-[#B12A34]">
          Bonjour {user.prenom} 👋
        </h1>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Tickets Totaux" value={stats?.total_tickets} color="text-gray-800" />
          <StatCard title="En Cours" value={stats?.tickets_en_cours} color="text-[#1E88E5]" />
          <StatCard title="En Attente" value={stats?.tickets_en_attente} color="text-[#FFA726]" />
          <StatCard title="Clôturés" value={stats?.tickets_clotures} color="text-[#43A047]" />
        </div>

        {/* Activité par mois */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#B12A34] mb-4">Activité par Mois</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tickets" stroke="#B12A34" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Carte géographique */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#B12A34] mb-4">Carte de localisation</h2>
          <div className="h-64 w-full rounded-lg overflow-hidden">
            <iframe
              title="Carte"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31708.694333588453!2d1.193046795357203!3d6.128500314429634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10216a0c9a9bb5f5%3A0x3e325ca43b09d2b7!2sLom%C3%A9%2C%20Togo!5e0!3m2!1sfr!2stg!4v1628781902480!5m2!1sfr!2stg"
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value?: number;
  color: string;
}

const StatCard = ({ title, value = 0, color }: StatCardProps) => (
  <div className="bg-white shadow rounded-xl p-5">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

export default Dashboard;
