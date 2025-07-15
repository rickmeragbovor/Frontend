import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import GestionTicket from "../components/GestionTicket";
import EscaladeModal from "../components/EscaladeModal";
import type { Ticket, User, Supérieur } from "../types";
import { toast } from "react-toastify";

const STATUTS = ["Escaladé", "En attente", "En attente de confirmation", "Clôturé"];

const Ticketing = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [ticketActif, setTicketActif] = useState<Ticket | null>(null);
  const [timers, setTimers] = useState<Record<number, number>>({});
  const [statutFilter, setStatutFilter] = useState<string[]>([]);
  const [superieurs, setSuperieurs] = useState<Supérieur[]>([]);
  const [showEscaladeModal, setShowEscaladeModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setStatutFilter(user.role === "supérieur" ? [...STATUTS] : STATUTS.filter((s) => s !== "Escaladé"));
  }, [user]);

  const normalizeStatut = (statutRaw: string | undefined): string => {
    if (!statutRaw) return "Inconnu";
    const clean = statutRaw
      .replace(/_/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    switch (clean) {
      case "en attente":
      case "en attente simple":
        return "En attente";
      case "en attente de confirmation":
      case "en attente confirmation":
        return "En attente de confirmation";
      case "en cours":
        return "En cours";
      case "cloture":
      case "cloturee":
      case "cloturé":
      case "clôture":
        return "Clôturé";
      case "escalade":
      case "escaladee":
      case "escaladé":
      case "escaladée":
        return "Escaladé";
      default:
        return statutRaw.charAt(0).toUpperCase() + statutRaw.slice(1).toLowerCase();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const fetchData = async () => {
      try {
        const [ticketRes, userRes, superieursRes] = await Promise.all([
          axios.get<Ticket[]>("/tickets/"),
          axios.get<User>("/me/"),
          axios.get<Supérieur[]>("/superieurs/"),
        ]);
        setTickets(ticketRes.data.map((t) => ({ ...t, statut: normalizeStatut(t.statut) })));
        setUser(userRes.data);
        setSuperieurs(superieursRes.data);
      } catch (error) {
        console.error("Erreur:", error);
        localStorage.clear();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (ticketActif) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimers((prev) => ({
          ...prev,
          [ticketActif.id]: (prev[ticketActif.id] ?? 0) + 1,
        }));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [ticketActif]);

  const handleCloture = (ticketId: number) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, statut: "Clôturé" } : t))
    );
    setTimers((prev) => {
      const updated = { ...prev };
      delete updated[ticketId];
      return updated;
    });
    setShowModal(false);
    setTicketActif(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleAjoutRapport = (ticket: Ticket) => {
    alert(`Ajouter rapport pour le ticket ${ticket.id}`);
  };

  const formatTemps = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const secondes = sec % 60;
    return `${minutes}m ${secondes}s`;
  };

  const formatStatut = (statutRaw: string | undefined): { label: string; className: string } => {
    if (!statutRaw) return { label: "Inconnu", className: "bg-gray-200 text-gray-700" };
    const clean = statutRaw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    switch (clean) {
      case "en attente":
        return { label: "En attente", className: "bg-yellow-100 text-yellow-800" };
      case "en cours":
        return { label: "En cours", className: "bg-blue-100 text-blue-800" };
      case "en attente de confirmation":
        return { label: "En attente de confirmation", className: "bg-orange-100 text-orange-800" };
      case "cloturé":
      case "clôturé":
        return { label: "Clôturé", className: "bg-green-100 text-green-800" };
      case "escaladé":
        return { label: "Escaladé", className: "bg-red-100 text-red-800" };
      default:
        return { label: statutRaw, className: "bg-gray-200 text-gray-700" };
    }
  };

  const ticketsFiltres = tickets
    .filter((ticket) => {
      const { label: statutLabel } = formatStatut(ticket.statut);
      if (statutLabel === "Escaladé" && user?.role !== "supérieur") return false;
      return statutFilter.includes(statutLabel);
    })
    .sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime());

  const toggleStatutFilter = (statut: string) => {
    setStatutFilter((prev) =>
      prev.includes(statut) ? prev.filter((s) => s !== statut) : [...prev, statut]
    );
  };

  const handleEscalade = async (
    ticketId: number,
    data: { superieur_id: number; commentaire: string }
  ) => {
    try {
      await axios.patch(`/tickets/${ticketId}/`, {
        superieur_id: data.superieur_id,
        commentaire_escalade: data.commentaire,
        statut: "Escaladé",
      });
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                statut: "Escaladé",
                superieur_id: data.superieur_id,
                commentaire_escalade: data.commentaire,
              }
            : t
        )
      );
      setShowEscaladeModal(false);
      setTicketActif(null);
      toast.success("Ticket escaladé avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l’escalade du ticket.");
      throw error;
    }
  };

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!user) return <div className="p-8 text-center text-red-600">Utilisateur non authentifié.</div>;

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-800">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="flex-1 p-8 overflow-auto bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Bonjour, {user.prenom} !</h1>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-red-500">Nos Tickets</h2>

          {/* Filtres */}
          <div className="mb-4 flex flex-wrap gap-4">
            {STATUTS.filter((s) => user.role === "supérieur" || s !== "Escaladé").map((statut) => (
              <label key={statut} className="inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-red-500"
                  checked={statutFilter.includes(statut)}
                  onChange={() => toggleStatutFilter(statut)}
                />
                <span className="ml-2">{statut}</span>
              </label>
            ))}
          </div>

          {/* Tableau */}
          {ticketsFiltres.length === 0 ? (
            <p className="text-center text-gray-500">Aucun ticket trouvé.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 border-b">N°</th>
                    <th className="p-3 border-b">Noms</th>
                    <th className="p-3 border-b">Société</th>
                    <th className="p-3 border-b">Rôles</th>
                    <th className="p-3 border-b">Prestations</th>
                    { user.role !== "technicien"&&<th className="p-3 border-b">Technicien</th>}
                    <th className="p-3 border-b">Dates d'ajout</th>
                    <th className="p-3 border-b">Statuts</th>
                    <th className="p-3 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsFiltres.map((ticket) => {
                    const isDisabled = ticketActif !== null && ticketActif.id !== ticket.id;
                    const { label: statutLabel, className: statutClass } = formatStatut(ticket.statut);
                    const isCloture = statutLabel.toLowerCase() === "clôturé";
                    const date = new Date(ticket.date_creation);
                    const dateFormattee = `${date.getDate().toString().padStart(2, "0")}/${(
                      date.getMonth() + 1
                    ).toString().padStart(2, "0")}/${date.getFullYear()} à ${date
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

                    return (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="p-3 border-b">{`TETK000${ticket.id}`}</td>
                        <td className="p-3 border-b">{ticket.nom}</td>
                        <td className="p-3 border-b">{ticket.societe_detail?.nom || "-"}</td>
                        <td className="p-3 border-b">{ticket.role_detail?.nom || "-"}</td>
                        <td className="p-3 border-b">{ticket.prestation_detail?.nom || "-"}</td>

                        {/* 👇 Supérieur avec infobulle */}
                        {user.role !== "technicien" && <td className="p-3 border-b">
                          {ticket.technicien ? (
                            <span
                              className="cursor-help"
                              title={`Email : ${ticket.technicien.email}\nCommentaire : ${
                                ticket.commentaire_escalade || "Aucun"
                              }`}
                            >
                              {ticket.technicien.prenom} {ticket.technicien.nom}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>}

                        <td className="p-3 border-b">{dateFormattee}</td>
                        <td className="p-3 border-b">
                          <span className={`text-sm px-2 py-1 rounded-full ${statutClass}`}>
                            {statutLabel}
                          </span>
                        </td>
                        <td className="p-3 border-b">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            {isCloture ? (
                              <>
                                <button
                                  className="text-sm px-3 py-1 bg-gray-400 text-white rounded cursor-not-allowed"
                                  disabled
                                >
                                  Clôturé
                                </button>
                                <button
                                  onClick={() => handleAjoutRapport(ticket)}
                                  className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  Ajouter Rapport
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  if (!isDisabled) {
                                    setTicketActif(ticket);
                                    setShowModal(true);
                                    setTimers((prev) => ({
                                      ...prev,
                                      [ticket.id]: prev[ticket.id] ?? 0,
                                    }));
                                  }
                                }}
                                disabled={isDisabled}
                                className={`text-sm px-3 py-1 rounded text-white transition ${
                                  isDisabled
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                              >
                                Gérer
                              </button>
                            )}

                            {timers[ticket.id] > 0 && (
                              <span className="text-xs text-gray-600">
                                {formatTemps(timers[ticket.id])}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showModal && ticketActif && (
        <GestionTicket
          ticket={ticketActif}
          onClose={() => setShowModal(false)}
          onCloture={handleCloture}
          tempsEcoule={timers[ticketActif.id] ?? 0}
        />
      )}

      {showEscaladeModal && ticketActif && (
        <EscaladeModal
          isOpen={showEscaladeModal}
          onClose={() => setShowEscaladeModal(false)}
          ticketId={ticketActif.id}
          superieurs={superieurs}
          onConfirm={handleEscalade}
        />
      )}
    </div>
  );
};

export default Ticketing;
