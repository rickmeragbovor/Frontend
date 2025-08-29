import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "../../api/axios";


interface Statistique {
  period: string;
  nb_tickets: number;
  temps_moyen: number; // en secondes
}

const Performances: React.FC = () => {
  const [data, setData] = useState<Statistique[]>([]);
  const [periode, setPeriode] = useState<"jour" | "mois">("jour");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/statistiques/?periode=${periode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
      }
    };

    fetchData();
  }, [periode]);

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">📈 Performances</h1>

      <div className="mb-4">
  <label className="mr-2 font-medium text-gray-700">Vue:</label>
  <select
    value={periode}
    onChange={(e) => setPeriode(e.target.value as "jour" | "mois")}
    className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    <option value="jour">Journalier</option>
    <option value="mois">Mensuel</option>
  </select>
</div>
      <div className="bg-white rounded shadow p-4">
       <ResponsiveContainer width="100%" height={350}>
  <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="periode" tick={{ fontSize: 12 }} />
    <YAxis
      yAxisId="left"
      
      label={{
        value: "Tickets",
        angle: -90,
        position: "insideLeft",
        style: { textAnchor: "middle" },
      }}
    />
   
    <Tooltip
      formatter={(value: number, name: string) =>
        name === "Temps moyen" ? [`${value} s`, name] : [value, name]
      }
    />
    <Legend />
    <Line
      yAxisId="left"
      type="monotone"
      dataKey="nb_tickets"
      stroke="#8884d8"
      name="Tickets clos"
      dot={false}
    />
    <Line
      yAxisId="right"
      type="monotone"
      dataKey="temps_moyen_minutes"
      stroke="#82ca9d"
      name="Temps moyen"
      dot={false}
    />
  </LineChart>
</ResponsiveContainer>

      </div>
    </main>
  );
};

export default Performances;
