import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

// --- Types ---
interface Client {
  nom: string;
  type: "PROJET" | "SOCIETE";
}

interface Logiciel {
  id: number;
  nom: string;
}

interface Fichier {
  id: number;
  fichier: string;
  date_ajout: string;
}

interface Historique {
  message: string;
  date: string;
}

interface Ticket {
  id: number;
  logiciel: Logiciel;
  description: string;
  statut: "en_attente" | "en_cours" | "escalade" | "clos";
  date_creation: string;
  lien: {
    client: Client;
  };
  fichiers: Fichier[];
  historique?: Historique[];
}

// --- Couleurs + icônes par statut ---
const statutConfig: Record<
  Ticket["statut"],
  { color: string; bg: string; icon: string; label: string }
> = {
  en_attente: {
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    icon: "⏳",
    label: "En attente",
  },
  en_cours: {
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: "🔧",
    label: "En cours",
  },
  escalade: {
    color: "text-red-700",
    bg: "bg-red-100",
    icon: "🚨",
    label: "Escaladé",
  },
  clos: {
    color: "text-green-700",
    bg: "bg-green-100",
    icon: "✅",
    label: "Clôturé",
  },
};

// --- Barre de progression ---
const ProgressBar: React.FC<{ statut: Ticket["statut"] }> = ({ statut }) => {
  const steps: Ticket["statut"][] = ["en_attente", "en_cours", "escalade", "clos"];
  const currentStep = steps.indexOf(statut);

  return (
    <div className="flex items-center mt-3 gap-1">
      {steps.map((step, idx) => (
        <div
          key={step}
          className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
            idx <= currentStep
              ? step === "clos"
                ? "bg-green-600"
                : "bg-blue-500"
              : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

// --- Timeline Historique global ---
const GlobalHistorique: React.FC<{ tickets: Ticket[] }> = ({ tickets }) => {
  const [filtreDate, setFiltreDate] = useState<"all" | "today" | "week" | "month">("all");

  const allEvents: { message: string; date: string; statut: Ticket["statut"] }[] = [];

  tickets.forEach((t) => {
    if (t.historique) {
      t.historique.forEach((h) =>
        allEvents.push({
          message: `#${t.id} (${t.logiciel.nom}) - ${h.message}`,
          date: h.date,
          statut: t.statut,
        })
      );
    }
  });

  // Appliquer filtre par date
  const now = new Date();
  const filtered = allEvents.filter((e) => {
    const d = new Date(e.date);
    if (filtreDate === "today") {
      return d.toDateString() === now.toDateString();
    }
    if (filtreDate === "week") {
      const startOfWeek = new Date(now);
      const day = now.getDay() === 0 ? 7 : now.getDay(); // lundi comme début
      startOfWeek.setDate(now.getDate() - (day - 1));
      startOfWeek.setHours(0, 0, 0, 0);
      return d >= startOfWeek;
    }
    if (filtreDate === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true; // "all"
  });

  const sorted = filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sorted.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-6 border mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">📜 Timeline des tickets</h2>
        <select
          value={filtreDate}
          onChange={(e) =>
            setFiltreDate(e.target.value as "all" | "today" | "week" | "month")
          }
          className="border rounded-lg px-2 py-1 text-sm text-gray-700"
        >
          <option value="all">Tous</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois-ci</option>
        </select>
      </div>

      {/* Timeline */}
      <div className="relative border-l border-gray-300 ml-4">
        {sorted.slice(0, 15).map((event, i) => {
          const cfg = statutConfig[event.statut];
          return (
            <div key={`${i}-${event.date}`} className="mb-6 ml-4 relative">
              {/* Pastille */}
              <span
                className={`absolute -left-6 flex items-center justify-center w-4 h-4 rounded-full border-2 ${cfg.bg} border-white`}
              >
                <span className="text-[10px]">{cfg.icon}</span>
              </span>

              {/* Contenu */}
              <div className="p-3 bg-gray-50 rounded-lg shadow-sm border">
                <p className="text-sm text-gray-800">{event.message}</p>
                <span className="text-xs text-gray-500 block mt-1">
                  {new Date(event.date).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Composant principal ---
const ListeTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filtre, setFiltre] = useState<"tous" | Ticket["statut"]>("tous");
  const [periode, setPeriode] = useState<"all" | "today" | "week" | "month">("all");

  // Chargement initial + refresh auto
  useEffect(() => {
    const fetchTickets = () => {
      axios
        .get("/api/mes-tickets/")
        .then((res) => setTickets(res.data))
        .catch((err) => console.error("Erreur chargement tickets:", err));
    };
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  // Compter par statut
  const count = tickets.reduce(
    (acc, t) => {
      acc[t.statut]++;
      return acc;
    },
    { en_attente: 0, en_cours: 0, escalade: 0, clos: 0 }
  );

  // Appliquer filtres
  let filteredTickets =
    filtre === "tous" ? tickets : tickets.filter((t) => t.statut === filtre);

  const now = new Date();
  filteredTickets = filteredTickets.filter((t) => {
    const d = new Date(t.date_creation);
    if (periode === "today") return d.toDateString() === now.toDateString();
    if (periode === "week") {
      const startOfWeek = new Date(now);
      const day = now.getDay() === 0 ? 7 : now.getDay();
      startOfWeek.setDate(now.getDate() - (day - 1));
      startOfWeek.setHours(0, 0, 0, 0);
      return d >= startOfWeek;
    }
    if (periode === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true;
  });

  return (
    <main className="flex-1 p-6 overflow-auto bg-gray-100">
      {/* --- Dashboard résumé --- */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {(Object.keys(statutConfig) as Ticket["statut"][]).map((statut) => (
          <div
            key={statut}
            onClick={() => setFiltre(statut)}
            className={`cursor-pointer p-4 rounded-xl text-center shadow-sm border hover:shadow-md transition ${statutConfig[statut].bg} ${statutConfig[statut].color}`}
          >
            <p className="text-2xl">{statutConfig[statut].icon}</p>
            <p className="text-lg font-bold">{count[statut]}</p>
            <p className="text-sm">{statutConfig[statut].label}</p>
          </div>
        ))}
        {/* Tous */}
        <div
          onClick={() => setFiltre("tous")}
          className="cursor-pointer p-4 rounded-xl text-center shadow-sm border hover:shadow-md transition bg-gray-100 text-gray-800"
        >
          <p className="text-2xl">📋</p>
          <p className="text-lg font-bold">{tickets.length}</p>
          <p className="text-sm">Tous</p>
        </div>
        {/* --- Nouvelle Card Période --- */}
       <div className="p-4 rounded-xl text-center shadow-sm border bg-white">
  <p className="text-sm font-medium text-black mb-2">⏱️ Période</p>
  <select
    value={periode}
    onChange={(e) =>
      setPeriode(e.target.value as "all" | "today" | "week" | "month")
    }
    className="border rounded-lg px-2 py-1 text-sm text-black bg-white w-full"
  >
    <option value="all">Toutes</option>
    <option value="today">Aujourd'hui</option>
    <option value="week">Cette semaine</option>
    <option value="month">Ce mois-ci</option>
  </select>
</div>

      </div>

      {/* --- Timeline globale --- */}
      <GlobalHistorique tickets={tickets} />

      {/* --- Liste des tickets --- */}
      {filteredTickets.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun ticket à afficher.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTickets.map((ticket) => {
            const cfg = statutConfig[ticket.statut];
            return (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl shadow border flex flex-col"
              >
                {/* Header */}
                <div
                  className={`p-3 rounded-t-2xl flex items-center justify-between ${cfg.bg} ${cfg.color}`}
                >
                  <span className="font-medium flex items-center gap-2">
                    {cfg.icon} {ticket.logiciel.nom}
                  </span>
                  <span className="text-xs font-medium">{cfg.label}</span>
                </div>

                {/* Contenu */}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="font-medium text-gray-800">
                    {ticket.lien.client.nom} ({ticket.lien.client.type})
                  </p>
                  <p className="text-gray-600 text-sm mt-1">{ticket.description}</p>
                  <span className="text-xs text-gray-400 mt-1">
                    Créé le : {new Date(ticket.date_creation).toLocaleDateString()}
                  </span>

                  {/* Progression */}
                  <ProgressBar statut={ticket.statut} />

                  {/* Historique spécifique */}
                  {ticket.historique && (
                    <ul className="text-xs text-gray-500 mt-2 list-disc list-inside">
                      {ticket.historique.map((h, i) => (
                        <li key={`${ticket.id}-${i}`}>
                          {h.message} - {new Date(h.date).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default ListeTickets;
