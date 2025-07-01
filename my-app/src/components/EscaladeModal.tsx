import React, { useState } from "react";
import { toast } from "react-toastify";

interface Superieur {
  id: number;
  nom: string;
}

interface EscaladeModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
  superieurs: Superieur[];
  onConfirm: (data: { superieur_id: number; commentaire: string }) => Promise<void>;
}

const EscaladeModal = ({
  isOpen,
  onClose,
  ticketId,
  superieurs,
  onConfirm,
}: EscaladeModalProps) => {
  const [superieur_id, setSuperieurId] = useState<number | "">("");
  const [commentaire, setCommentaire] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (superieur_id === "") {
      toast.warn("Veuillez sélectionner un supérieur.");
      return;
    }

    setLoading(true);

    try {
      await onConfirm({ superieur_id: superieur_id as number, commentaire });
      toast.success("Ticket escaladé avec succès !");
      onClose();
    } catch (e) {
      toast.error("Erreur lors de l’escalade du ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-gray-900"
          aria-label="Fermer la modale"
          disabled={loading}
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4 text-purple-600">
          Escalader le Ticket #{ticketId}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="superieur" className="block font-medium mb-1">
              Supérieur à contacter
            </label>
            <select
              id="superieur"
              value={superieur_id}
              onChange={(e) =>
                setSuperieurId(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={loading}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            >
              <option value="">-- Choisissez un supérieur --</option>
              {superieurs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="commentaire" className="block font-medium mb-1">
              Commentaire (optionnel)
            </label>
            <textarea
              id="commentaire"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              disabled={loading}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Ajoutez un commentaire pour le supérieur..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-purple-400 hover:bg-purple-600 text-white font-semibold transition"
            >
              {loading ? "En cours..." : "Escalader"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EscaladeModal;
