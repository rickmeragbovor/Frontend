import React, { useState, useEffect } from "react";
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

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setSuperieurId("");
      setCommentaire("");
      setLoading(false);
    }
  }, [isOpen]);

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
    } catch (error) {
      toast.error("Erreur lors de l’escalade du ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Fermer la modale"
          className="absolute right-4 top-3 text-xl font-semibold text-red-400 transition hover:text-red-600"
        >
          ✖
        </button>

        <h2 className="mb-5 text-xl font-semibold tracking-wide text-red-500">
          Escalader le Ticket #{ticketId}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sélection du supérieur */}
          <div>
            <label
              htmlFor="superieur"
              className="mb-2 block font-medium text-gray-700"
            >
              Supérieur à contacter
            </label>
            <select
              id="superieur"
              value={superieur_id}
              onChange={(e) =>
                setSuperieurId(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={loading}
              required
              className="w-full cursor-pointer appearance-none rounded-md border border-red-300 bg-white px-4 py-3 font-medium text-gray-800 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="" disabled>
                -- Choisissez un supérieur --
              </option>
              {superieurs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Champ commentaire */}
          <div>
            <label
              htmlFor="commentaire"
              className="mb-2 block font-medium text-gray-700"
            >
              Commentaire (optionnel)
            </label>
            <textarea
              id="commentaire"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              disabled={loading}
              rows={4}
              placeholder="Ajoutez un commentaire pour le supérieur..."
              className="w-full resize-none rounded-md border border-red-300 bg-white px-4 py-3 text-gray-700 placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-red-300 px-5 py-2.5 font-semibold text-red-500 transition hover:bg-red-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-red-400 px-6 py-2.5 font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
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
