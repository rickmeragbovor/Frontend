import { useEffect, useState } from "react";
import axios from "../api/axios";
import EscaladeModal from "./EscaladeModal";
import type { Ticket, User } from "../types";

// Fonction utilitaire pour centraliser le header d'authentification
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface GestionTicketProps {
  ticket: Ticket;
  onClose: () => void;
  onCloture: (ticketId: number) => void;
  tempsEcoule: number;
}

const GestionTicket = ({ ticket, onClose, onCloture, tempsEcoule }: GestionTicketProps) => {
  const [showEscaladeModal, setShowEscaladeModal] = useState(false);
  const [superieurs, setSuperieurs] = useState<User[]>([]);

  useEffect(() => {
    if (showEscaladeModal) {
      fetchSuperieurs();
    }
  }, [showEscaladeModal]);

  const fetchSuperieurs = async () => {
    try {
      const headers = getAuthHeader();
      if (!headers.Authorization) {
        alert("Utilisateur non authentifié.");
        return;
      }

      const response = await axios.get("/superieurs/?role=supérieur", {
        headers,
      });

      console.log("Superieurs reçus (brut) :", response.data);

      const transformed = response.data.map((user: any) => ({
        ...user,
        nom:
          user.nom ||
          (user.first_name && user.last_name
            ? `${user.first_name} ${user.last_name}`
            : "Nom inconnu"),
      }));

      console.log("Superieurs transformés :", transformed);

      setSuperieurs(transformed);
    } catch (error) {
      console.error("Erreur lors du chargement des supérieurs :", error);
      alert("Impossible de récupérer la liste des supérieurs.");
    }
  };

  const formatTelephone = (numero?: string): string => {
    if (!numero) return "—";
    const digits = numero.replace(/\D/g, "");
    if (digits.length === 8) {
      return `+228-${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    }
    return `+228-${digits}`;
  };

  const formatTemps = (sec: number) => `${Math.floor(sec / 60)}m ${sec % 60}s`;

  const demanderCloture = async () => {
    try {
      const headers = getAuthHeader();
      if (!headers.Authorization) {
        alert("Utilisateur non authentifié.");
        return;
      }

      await axios.patch(`/tickets/${ticket.id}/demander-cloture/`, {}, { headers });

      alert("Un lien de confirmation a été envoyé au client.");
      onCloture(ticket.id);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la demande de clôture :", error);
      alert("Erreur lors de la demande de clôture.");
    }
  };

  const handleEscaladeConfirm = async ({
    superieur_id,
    commentaire,
  }: {
    superieur_id: number;
    commentaire: string;
  }) => {
    try {
      const headers = getAuthHeader();
      if (!headers.Authorization) {
        alert("Utilisateur non authentifié.");
        return;
      }

      await axios.post(
        `/tickets/${ticket.id}/escalader/`,  // <-- CORRECTION ICI, ajout de /api
        { superieur_id, commentaire },
        { headers }
      );

      alert("Le ticket a été escaladé avec succès !");
      setShowEscaladeModal(false);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'escalade :", error);
      alert("Erreur lors de l'escalade.");
    }
  };

  if (!ticket) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-black"
            aria-label="Fermer"
          >
            ✖
          </button>

          <h2 className="text-xl font-bold mb-4 text-red-500">Gestion du Ticket</h2>

          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Nom :</strong> {ticket.nom}</p>
            <p><strong>Prénom :</strong> {ticket.prenom}</p>
            <p><strong>Prestation :</strong> {ticket.prestation_detail?.nom || "—"}</p>
            <p><strong>Société :</strong> {ticket.societe_detail?.nom || "—"}</p>
            <p><strong>Rôle :</strong> {ticket.role_detail?.nom || "—"}</p>
            <p><strong>Téléphone :</strong> {formatTelephone(ticket.telephone)}</p>
            <p><strong>Description :</strong> {ticket.description_type_detail?.nom || "—"}</p>
            <p><strong>Temps écoulé :</strong> {formatTemps(tempsEcoule)}</p>
          </div>

          <div className="mt-6 flex justify-between gap-3">
            <button
              onClick={() => setShowEscaladeModal(true)}
              className="flex-1 bg-purple-400 hover:bg-purple-600 text-white py-2 rounded transition"
            >
              Escalader
            </button>

            <button
              onClick={demanderCloture}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
            >
              Demander la clôture
            </button>
          </div>
        </div>
      </div>

      <EscaladeModal
        isOpen={showEscaladeModal}
        onClose={() => setShowEscaladeModal(false)}
        ticketId={ticket.id}
        superieurs={superieurs}
        onConfirm={handleEscaladeConfirm}
      />
    </>
  );
};

export default GestionTicket;
