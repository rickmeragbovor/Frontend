import React, { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import { toast } from "sonner";  // ✅ Utilisation de sonner

import EscaladeModal from "./EscaladeModal";

interface Fichier {
  id: number;
  fichier: string; // URL du fichier
  date_ajout: string;
}

interface Ticket {
  id: number;
  description: string;
  statut: "en_attente" | "en_cours" | "escalade" | "clos";
  date_creation: string;
  logiciel: { nom: string };
  type_probleme?: { nom: string } | null;
  fichiers?: Fichier[];
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

interface Props {
  ticket: Ticket;
  onClose: () => void;
}

const TraitementTicket: React.FC<Props> = ({ ticket, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(() => {
    const stored = localStorage.getItem(`timer_${ticket.id}`);
    return stored ? parseInt(stored, 10) : 0;
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const updated = prev + 1;
        localStorage.setItem(`timer_${ticket.id}`, updated.toString());
        return updated;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [ticket.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleCloturer = async () => {
    if (!token) {
      toast.error("🔒 Token d'authentification manquant");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `/api/tickets/${ticket.id}/cloturer/`,
        { temps_traitement: elapsedTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`✅ Ticket #${ticket.id} clôturé avec succès !`);
      localStorage.removeItem(`timer_${ticket.id}`);
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error("❌ Erreur lors de la clôture du ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Gestion du ticket #{ticket.id.toString().padStart(5, "0")}
        </h2>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ✕ Fermer
        </button>
      </div>

      <div className="space-y-2 mb-4 text-gray-700">
        <p><strong>Client :</strong> {ticket.lien.client.nom}</p>
        <p><strong>Logiciel :</strong> {ticket.logiciel.nom}</p>
        {ticket.type_probleme?.nom && (
          <p><strong>Type de problème :</strong> {ticket.type_probleme.nom}</p>
        )}
        <p><strong>Description :</strong> {ticket.description}</p>
        <p><strong>Date :</strong> {new Date(ticket.date_creation).toLocaleDateString()}</p>
        <p><strong>Créé par :</strong> {ticket.lien.personnel.prenom} {ticket.lien.personnel.nom}</p>
        {ticket.lien.personnel.poste && (
          <p><strong>Poste :</strong> {ticket.lien.personnel.poste}</p>
        )}
        {ticket.lien.personnel.tel && (
          <p><strong>Téléphone :</strong> {ticket.lien.personnel.tel}</p>
        )}
        <p><strong>Email :</strong> {ticket.lien.personnel.email}</p>
        <p><strong>⏱ Temps écoulé :</strong> {formatTime(elapsedTime)}</p>

        {ticket.fichiers && ticket.fichiers?.length > 0 && (
          <div className="mt-4">
            <strong>📎 Fichiers joints :</strong>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              {ticket.fichiers?.map((fichier) => (
                <li key={fichier.id}>
                  <a
                    href={fichier.fichier}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 text-sm"
                  >
                    {fichier.fichier.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          Escalader
        </button>
        <button
          onClick={handleCloturer}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          Clôturer
        </button>
      </div>

      {showModal && (
        <EscaladeModal
          ticketId={ticket.id}
          onClose={() => setShowModal(false)}
          onEscaladeSuccess={() => {
            toast.success(`⚠️ Ticket #${ticket.id} escaladé avec succès !`);
            localStorage.removeItem(`timer_${ticket.id}`);
            setShowModal(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default TraitementTicket;
