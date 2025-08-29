// src/pages/Ticketing.tsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // import corrigé

interface Client { id: number; nom: string; type: "PROJET" | "SOCIETE"; }
interface Utilisateur { id: number; nom: string; prenom: string; email: string; }
interface PersonnelClient { id: number; personnel: Utilisateur; client: Client; }
interface Logiciel { id: number; nom: string; }
interface TypeProbleme { id: number; nom: string; }

interface Ticket {
  id: number;
  statut: "en_attente" | "en_cours" | "escalade" | "clos";
  date_creation: string;
  date_cloture?: string | null;
  temps_traitement?: string | null;
  lien: PersonnelClient;
  technicien?: Utilisateur | null;
  logiciel: Logiciel;
  type_probleme?: TypeProbleme | null;
  escalade?: boolean;
  rapport?: boolean;
}

const Ticketing: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    axios.get("/api/tickets/", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setTickets(res.data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [token]);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tickets.map(t => ({
      ID: `TKK${t.id.toString().padStart(4, "0")}`,
      Client: t.lien.client.nom,
      Type: t.lien.client.type === "SOCIETE" ? "Société" : "Projet",
      Logiciel: t.logiciel.nom,
      Problème: t.type_probleme?.nom || "—",
      Technicien: t.technicien ? `${t.technicien.prenom} ${t.technicien.nom}` : "—",
      Statut: t.statut,
      Création: new Date(t.date_creation).toLocaleDateString(),
      Clôture: t.date_cloture ? new Date(t.date_cloture).toLocaleDateString() : "—",
      Escalade: t.escalade ? "Oui" : "Non",
      Rapport: t.rapport ? "Oui" : "Non"
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");
    XLSX.writeFile(wb, "Tickets.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Client", "Type", "Logiciel", "Problème", "Technicien", "Statut", "Création", "Clôture", "Escalade", "Rapport"];
    const tableRows: any[] = [];

    tickets.forEach(t => {
      tableRows.push([
        `TKK${t.id.toString().padStart(4, "0")}`,
        t.lien.client.nom,
        t.lien.client.type === "SOCIETE" ? "Société" : "Projet",
        t.logiciel.nom,
        t.type_probleme?.nom || "—",
        t.technicien ? `${t.technicien.prenom} ${t.technicien.nom}` : "—",
        t.statut,
        new Date(t.date_creation).toLocaleDateString(),
        t.date_cloture ? new Date(t.date_cloture).toLocaleDateString() : "—",
        t.escalade ? "Oui" : "Non",
        t.rapport ? "Oui" : "Non"
      ]);
    });

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("Tickets.pdf");
  };

  if (loading) return <p className="text-gray-500">⏳ Chargement de l’historique...</p>;

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">📜 Historique des Tickets</h1>

      <div className="flex justify-end mb-4 gap-2">
        <button onClick={exportExcel} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          Export Excel
        </button>
        <button onClick={exportPDF} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Générer PDF
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-left">
            <tr>
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Client</th>
              <th className="p-2 border-b">Type</th>
              <th className="p-2 border-b">Logiciel</th>
              <th className="p-2 border-b">Problème</th>
              <th className="p-2 border-b">Technicien</th>
              <th className="p-2 border-b">Statut</th>
              <th className="p-2 border-b">Création</th>
              <th className="p-2 border-b">Clôture</th>
              <th className="p-2 border-b">Escalade</th>
              <th className="p-2 border-b">Rapport</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {tickets.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 border-b">
                <td className="p-2 font-medium">TKK{t.id.toString().padStart(4, "0")}</td>
                <td className="p-2">{t.lien.client.nom}</td>
                <td className="p-2">{t.lien.client.type === "SOCIETE" ? "🏢" : "📁"}</td>
                <td className="p-2">{t.logiciel.nom}</td>
                <td className="p-2">{t.type_probleme?.nom || "—"}</td>
                <td className="p-2">{t.technicien ? `${t.technicien.prenom} ${t.technicien.nom}` : "—"}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    t.statut === "clos" ? "bg-green-100 text-green-700" :
                    t.statut === "escalade" ? "bg-yellow-100 text-yellow-700" :
                    t.statut === "en_cours" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{t.statut}</span>
                </td>
                <td className="p-2">{new Date(t.date_creation).toLocaleDateString()}</td>
                <td className="p-2">{t.date_cloture ? new Date(t.date_cloture).toLocaleDateString() : "—"}</td>
                <td className="p-2 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    t.escalade ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                  }`}>{t.escalade ? "Oui" : "Non"}</span>
                </td>
                <td className="p-2 text-center">{t.rapport ? "Oui" : "Non"}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={11} className="p-4 text-center text-gray-500">Aucun ticket trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Ticketing;
