import React, { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import TraitementTicket from "./TraitementTicket";
import { toast } from "sonner";

interface Ticket {
  id: number;
  description: string;
  statut: "en_attente" | "en_cours";
  date_creation: string;
  temps_traitement?: string;
  logiciel: {
    nom: string;
    type_problemes: { id: number; nom: string }[];
  };
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
  technicien?: { id: number };
}

const Techtk: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timers, setTimers] = useState<Record<number, number>>({});
  const intervalRefs = useRef<Record<number, NodeJS.Timeout>>({});

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user")!);

  const fetchTickets = async () => {
    try {
      const res = await axios.get("/api/tickets/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allTickets: Ticket[] = res.data;
      const relevantTickets = allTickets.filter(
        (tk) => tk.statut === "en_attente" || tk.statut === "en_cours"
      );

      const myTicket = relevantTickets.find(
        (tk) => tk.statut === "en_cours" && tk.technicien?.id === currentUser.id
      );

      const ordered = myTicket
        ? [myTicket, ...relevantTickets.filter((t) => t.id !== myTicket.id)]
        : relevantTickets;

      setTickets(ordered);
      setFilteredTickets(ordered);
    } catch (err) {
      console.error("Erreur chargement tickets :", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = tickets.filter((ticket) =>
      ticket.lien.client.nom.toLowerCase().includes(term)
    );
    setFilteredTickets(filtered);
  }, [searchTerm, tickets]);

  // Timer par ticket (localStorage + useEffect)
  useEffect(() => {
    filteredTickets.forEach((ticket) => {
      if (
        ticket.statut === "en_cours" &&
        ticket.technicien?.id === currentUser.id
      ) {
        const stored = localStorage.getItem(`timer_${ticket.id}`);
        const initial = stored ? parseInt(stored, 10) : 0;

        setTimers((prev) => ({ ...prev, [ticket.id]: initial }));

        if (!intervalRefs.current[ticket.id]) {
          intervalRefs.current[ticket.id] = setInterval(() => {
            setTimers((prev) => {
              const updated = {
                ...prev,
                [ticket.id]: (prev[ticket.id] || 0) + 1,
              };
              localStorage.setItem(
                `timer_${ticket.id}`,
                updated[ticket.id].toString()
              );
              return updated;
            });
          }, 1000);
        }
      }
    });

    return () => {
      Object.values(intervalRefs.current).forEach(clearInterval);
      intervalRefs.current = {};
    };
  }, [filteredTickets]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleAssign = async (ticket: Ticket) => {
    try {
      await axios.patch(`/api/tickets/${ticket.id}/affecter/`, {
        technicien: currentUser.id,
      });
      toast.success("Ticket affecté !");
      setSelectedTicket(ticket);
      fetchTickets();
    } catch (err) {
      toast.error("Erreur lors de l'affectation");
      setSelectedTicket(null);
    }
  };

  const ticketEnCours = tickets.find(
    (tk) => tk.statut === "en_cours" && tk.technicien?.id === currentUser.id
  );

  return (
    <main className="flex-1 p-6 overflow-auto bg-white text-black">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        🎯 Tickets à traiter
      </h1>

      <div className="mb-4 max-w-xs">
        <input
          type="text"
          placeholder="🔍 Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:ring-2 focus:ring-red-500"
        />
      </div>

      {filteredTickets.length === 0 ? (
        <p className="text-gray-500">Aucun ticket à afficher.</p>
      ) : (
        <div className="overflow-x-auto border rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-left text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Logiciel</th>
                <th className="px-4 py-3">Problème</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTickets.map((ticket) => {
                const isMine = ticket.technicien?.id === currentUser.id;
                const timer = timers[ticket.id];

                return (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-red-600 font-semibold">
                      #{ticket.id.toString().padStart(5, "0")}
                    </td>
                    <td className="px-4 py-3">{ticket.lien.client.nom}</td>
                    <td className="px-4 py-3">{ticket.logiciel.nom}</td>
                    <td className="px-4 py-3">
                      {ticket.type_probleme?.nom || (
                        <span className="italic text-gray-400">
                          Non précisé
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {ticket.statut.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(ticket.date_creation).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      {ticket.statut === "en_attente" && (
                        <button
                          onClick={() => handleAssign(ticket)}
                          disabled={!!ticketEnCours}
                          className={`px-3 py-1 rounded text-xs text-white ${
                            !!ticketEnCours
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          Prendre en charge
                        </button>
                      )}

                      {ticket.statut === "en_cours" && isMine && (
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Gestion {timer ? `(${formatTime(timer)})` : ""}
                        </button>
                      )}

                      {ticket.statut === "en_cours" && !isMine && (
                        <span className="text-gray-400 italic text-xs">
                          En cours
                        </span>
                      )}
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
                fetchTickets();
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default Techtk;
