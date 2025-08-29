// src/pages/Logiciels.tsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TypeLogiciel {
  id: number;
  nom: string;
}

interface Logiciel {
  id: number;
  nom: string;
  type_logiciel: TypeLogiciel;
  tickets_count: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF7", "#FF6B6B"];

const Logiciels: React.FC = () => {
  const [logiciels, setLogiciels] = useState<Logiciel[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLogiciel, setNewLogiciel] = useState("");
  const token = localStorage.getItem("token") || "";

  // Fetch logiciels
  useEffect(() => {
    axios.get("/api/logiciels/", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setLogiciels(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [token]);

  // Création nouveau logiciel
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogiciel.trim()) return;

    axios.post("/api/logiciels/", { nom: newLogiciel }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setLogiciels(prev => [...prev, res.data]);
        setNewLogiciel("");
      })
      .catch(err => console.error(err));
  };

  // Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(logiciels.map(l => ({
      ID: l.id,
      Nom: l.nom,
      "Type logiciel": l.type_logiciel?.nom || "—",
      "Nombre tickets": l.tickets_count
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Logiciels");
    XLSX.writeFile(wb, "Logiciels.xlsx");
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Nom", "Type logiciel", "Nombre tickets"];
    const tableRows = logiciels.map(l => [
      l.id, l.nom, l.type_logiciel?.nom || "—", l.tickets_count
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("Logiciels.pdf");
  };

  if (loading) return <p className="text-gray-500">⏳ Chargement des logiciels...</p>;

  // Préparation données camembert
  const chartData = logiciels.map(l => ({
    name: l.nom,
    value: l.tickets_count
  }));

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">📊 Gestion des logiciels</h1>

      {/* Camembert */}
      <div className="w-full h-64 mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Logiciels les plus utilisés</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Formulaire création */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Nom du logiciel"
          value={newLogiciel}
          onChange={e => setNewLogiciel(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Ajouter
        </button>
      </form>

      {/* Boutons export */}
      <div className="flex justify-end mb-4 gap-2">
        <button onClick={exportExcel} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Export Excel
        </button>
        <button onClick={exportPDF} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Générer PDF
        </button>
      </div>

      {/* Tableau des logiciels */}
      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-left">
            <tr>
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Nom</th>
              <th className="p-2 border-b">Type logiciel</th>
              <th className="p-2 border-b">Nombre tickets</th>
            </tr>
          </thead>
          <tbody>
            {logiciels.map(l => (
              <tr key={l.id} className="hover:bg-gray-50 border-b">
                <td className="p-2">{l.id}</td>
                <td className="p-2">{l.nom}</td>
                <td className="p-2">{l.type_logiciel?.nom || "—"}</td>
                <td className="p-2">{l.tickets_count}</td>
              </tr>
            ))}
            {logiciels.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">Aucun logiciel trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Logiciels;
