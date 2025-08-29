import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import TraitementTicket from "./TraitementTicket";
import { toast } from "sonner";

interface UtilisateurMini {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

interface Escalade {
  id: number;
  ticket: number;
  emetteur: UtilisateurMini;
  destinataire: number;
  commentaire: string;
  fichier?: string;
  date_escalade: string;
}

interface EscaladeTicket {
  id: number;
  description: string;
  statut: "en_attente" | "en_cours" | "escalade" | "clos";
  date_creation: string;
  logiciel: {
    nom: string;
    type_problemes: { id: number; nom: string }[];
  };
  type_probleme?: { nom: string } | null;
  fichiers?: { id: number; fichier: string; date_ajout: string }[];
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
  technicien?: { id: number };
}

const Escalades: React.FC = () => {
  const [escalades, setEscalades] = useState<Escalade[]>([]);
  const [tickets, setTickets] = useState<EscaladeTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<EscaladeTicket | null>(null);
  const token = localStorage.getItem("token");

  const fetchEscalades = async () => {
    try {
      const res = await axios.get<Escalade[]>("/api/mes-escalades/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEscalades(res.data);

      const ticketResponses = await Promise.all(
        res.data.map((e) =>
          axios.get<EscaladeTicket>(`/api/tickets/${e.ticket}/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      // 🔥 Filtrer uniquement les tickets escaladés
      const fullTickets = ticketResponses.map((r) => r.data).filter(t => t.statut === "escalade");

      setTickets(fullTickets);
    } catch (err) {
      toast.error("Erreur chargement escalades");
    }
  };

  useEffect(() => {
    fetchEscalades();
  }, []);

  const handleTakeCharge = async (ticket: EscaladeTicket) => {
    try {
      await axios.patch(
        `/api/tickets/${ticket.id}/`,
        { statut: "en_cours" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Ticket #${ticket.id} pris en charge`);
      setSelectedTicket(ticket);
      fetchEscalades();
    } catch (err) {
      toast.error("Erreur lors de la prise en charge");
    }
  };

  return (
    <main className="flex-1 p-6 overflow-auto bg-white text-black">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">🚨 Tickets Escaladés</h1>

      {tickets.length === 0 ? (
        <p className="text-gray-600">Aucun ticket escaladé pour vous.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Logiciel</th>
                <th className="px-4 py-3">Problème</th>
                <th className="px-4 py-3">Commentaire</th>
                <th className="px-4 py-3">Fichier</th>
                <th className="px-4 py-3">Émetteur</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {escalades.map((escalade) => {
                const ticket = tickets.find(t => t.id === escalade.ticket);
                if (!ticket) return null; // ⚡ n'affiche que les escaladés

                return (
                  <tr key={escalade.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-red-600 font-semibold">
                      #{ticket.id.toString().padStart(5, "0")}
                    </td>
                    <td className="px-4 py-3">{ticket.lien.client.nom}</td>
                    <td className="px-4 py-3">{ticket.logiciel.nom}</td>
                    <td className="px-4 py-3">
                      {ticket.type_probleme?.nom || (
                        <span className="italic text-gray-400">Non précisé</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{escalade.commentaire}</td>
                    <td className="px-4 py-3">
                      {escalade.fichier ? (
                        <a
                          href={escalade.fichier}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📎 Voir le fichier
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Aucun</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {escalade.emetteur.prenom} {escalade.emetteur.nom}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(ticket.date_creation).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleTakeCharge(ticket)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                        disabled={ticket.statut !== "escalade"}
                      >
                        Prendre en charge
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <TraitementTicket
              ticket={selectedTicket}
              onClose={() => {
                setSelectedTicket(null);
                fetchEscalades();
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Escalades;
