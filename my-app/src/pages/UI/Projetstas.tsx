import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TicketStat {
  nom: string;
  nombre_tickets: number;
}

const Projetstats: React.FC = () => {
  const [data, setData] = useState<TicketStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/stats/tickets-par-client/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des statistiques.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">📊Projets Statistiques</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nom" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="nombre_tickets" fill="#8884d8" name="Tickets" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </main>
  );
};

export default Projetstats;
