import axios from "../api/axios";
import type { Ticket } from "../types";

interface GestionTicketProps {
  ticket: Ticket;
  onClose: () => void;
  onCloture: (ticketId: number) => void;
  tempsEcoule: number; // reçu depuis Dashboard
}

const GestionTicket = ({ ticket, onClose, onCloture, tempsEcoule }: GestionTicketProps) => {
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
      await axios.patch(`/tickets/${ticket.id}/demander-cloture/`);
      alert("Un lien de confirmation a été envoyé au client.");

      onCloture(ticket.id); // ✅ Notifie le parent que la demande est faite (pour arrêter le timer)
      onClose();            // ✅ Ferme la modale
    } catch (error) {
      console.error("Erreur lors de la demande de clôture :", error);
      alert("Erreur lors de la demande de clôture. Veuillez réessayer.");
    }
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
          aria-label="Fermer la modale"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-red-500">Gestion du Ticket</h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Nom :</strong> {ticket.nom || "—"}</p>
          <p><strong>Prestation :</strong> {ticket.prestation || "—"}</p>
          <p><strong>Société :</strong> {ticket.societe?.nom || "—"}</p>
          <p><strong>Rôle :</strong> {ticket.role?.nom || "—"}</p>
          <p><strong>Téléphone :</strong> {formatTelephone(ticket.telephone)}</p>
          <p><strong>Description :</strong> {ticket.description_type?.nom || "—"}</p>
          <p><strong>Temps écoulé :</strong> {formatTemps(tempsEcoule)}</p>
        </div>

        <button
          onClick={demanderCloture}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Demander la clôture
        </button>
      </div>
    </div>
  );
};

export default GestionTicket;
