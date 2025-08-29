import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

interface Stats {
  tickets: number;
  logiciels: number;
}

const PersonnelDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ tickets: 0, logiciels: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [{ data: tickets }, { data: logiciels }] = await Promise.all([
          axios.get("/api/tickets/"), // adapter si endpoint spécifique pour personnel
          axios.get("/api/logiciels/"),
        ]);

        setStats({
          tickets: tickets.length,
          logiciels: logiciels.length,
        });
      } catch (error) {
        console.error("Erreur chargement des stats du personnel :", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <p>Chargement des statistiques...</p>;

  return (
    <main className="flex-1 p-6 bg-gray-100 overflow-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Dashboard Personnel
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Tickets " value={stats.tickets} />
        <StatCard label="Logiciels disponibles" value={stats.logiciels} />
      </div>
    </main>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <p className="text-sm text-gray-600">{label}</p>
    <h3 className="text-2xl font-bold text-rose-600">{value}</h3>
  </div>
);

export default PersonnelDashboard;
