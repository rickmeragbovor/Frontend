import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "sonner";

interface Ticket {
  id: number;
  description: string;
  statut: "en_attente" | "en_cours" | "clos";
  date_creation: string;
  logiciel: { nom: string };
  type_probleme?: { nom: string } | null;
  lien: {
    client: { nom: string };
    personnel: {
      nom: string;
      prenom: string;
      email: string;
      tel?: string;
      poste?: string;
    };
  };
}

const AddRapport: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    
    const fetchTickets = async () => {
      try {
        const res = await axios.get("/api/tickets/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const clotures = res.data.filter((tk: Ticket) => tk.statut === "clos");
        console.log(res.data)
        setTickets(clotures);
      } catch (error) {
        console.error("Erreur chargement tickets :", error);
      }
    };
    fetchTickets();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !file) {
      toast.error("Veuillez sélectionner un ticket et un fichier.");
      return;
    }
    console.log(file)
    const formData = new FormData();
    formData.append("ticket", selectedTicketId.toString());
    formData.append("fichier", file);

    try {
      await axios.post("/api/rapports/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setTimeout(()=>{  toast.success("📄 Rapport ajouté avec succès !");},0)
      setSelectedTicketId(null);
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("❌ Échec de l’envoi du rapport.");
    }
  };
  return (
    <main className="flex-1 p-6 bg-white text-black">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📑 Ajouter un rapport à un ticket clôturé
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md bg-gray-50 p-6 rounded shadow">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">🎫 Ticket clôturé</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black"
            value={selectedTicketId ?? ""}
            onChange={(e) => setSelectedTicketId(Number(e.target.value))}
            required
          >
            <option value="" disabled>-- Sélectionner un ticket --</option>
            {tickets.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                #{ticket.id.toString().padStart(5, "0")} - {ticket.lien.client.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">📎 Fichier rapport (PDF, doc...)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Ajouter le rapport
        </button>
      </form>
    </main>
  );
};

export default AddRapport;
