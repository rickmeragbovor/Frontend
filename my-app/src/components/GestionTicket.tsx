import { useEffect, useState } from "react";
import axios from "../api/axios";

interface Ticket {
  id: number;
  nom: string;
  prestation: string;
  statut: string;
  societe?: string;
  role?: string;
  telephone?: string;
  description?: string;
}

interface GestionTicketProps {
  ticket: Ticket;
  onClose: () => void;
  onCloture: (ticketId: number) => void;
}

const GestionTicket = ({ ticket, onClose, onCloture }: GestionTicketProps) => {
  const [tempsEcoule, setTempsEcoule] = useState<number>(0);

  useEffect(() => {
    setTempsEcoule(0);
    const interval = setInterval(() => {
      setTempsEcoule((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [ticket]);

  const cloturerTicket = async () => {
    try {
      await axios.patch(`/tickets/${ticket.id}/`, {
        statut: "cloturé",
      });
      onCloture(ticket.id);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la clôture du ticket :", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-red-500">Gestion du Ticket</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Nom :</strong> {ticket.nom}</p>
          <p><strong>Prestation :</strong> {ticket.prestation}</p>
          <p><strong>Société :</strong> {ticket.societe || "—"}</p>
          <p><strong>Rôle :</strong> {ticket.role || "—"}</p>
          <p><strong>Téléphone :</strong> {ticket.telephone || "—"}</p>
          <p><strong>Description :</strong> {ticket.description || "—"}</p>
          <p><strong>Temps écoulé :</strong> {Math.floor(tempsEcoule / 60)} min {tempsEcoule % 60} sec</p>
        </div>

        <button
          onClick={cloturerTicket}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Clôturer
        </button>
      </div>
    </div>
  );
};

export default GestionTicket;
