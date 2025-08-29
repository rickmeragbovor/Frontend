import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import axios from "../../api/axios";
import { toast } from "sonner";

interface Props {
  ticketId: number;
  onClose: () => void;
  onEscaladeSuccess: () => void;
}

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

const EscaladeModal: React.FC<Props> = ({
  ticketId,
  onClose,
  onEscaladeSuccess,
}) => {
  const [superviseurs, setSuperviseurs] = useState<Utilisateur[]>([]);
  const [selectedSuperviseur, setSelectedSuperviseur] = useState<number | "">(
    ""
  );
  const [commentaire, setCommentaire] = useState("");
  const [fichier, setFichier] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Token manquant. Veuillez vous reconnecter.");
      return;
    }

    axios
      .get("/api/superviseurs/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSuperviseurs(res.data))
      .catch((err) => {
        console.error("Erreur chargement superviseurs :", err);
        toast.error("Erreur lors du chargement des superviseurs");
      });
  }, []); // <== Ne pas mettre [token] ici, car il ne change jamais dynamiquement

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFichier(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token d'authentification manquant");
      return;
    }

    if (!selectedSuperviseur) {
      toast.error("Veuillez choisir un superviseur");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("commentaire", commentaire);
      formData.append("destinataire", selectedSuperviseur.toString());
      formData.append("emetteur",  JSON.parse(localStorage.getItem("user")!).id)
      if (fichier) formData.append("fichier", fichier);

      // DEBUG : afficher le contenu
      console.log("Token:", token);
      console.log("FormData:", [...formData.entries()]);

      await axios.post(`/api/tickets/${ticketId}/escalade/`, formData, {
        headers: {
         "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          // Ne surtout pas définir 'Content-Type' manuellement pour FormData
        },
      });

      toast.success("Ticket escaladé avec succès !");
      onEscaladeSuccess();
    } catch (err: any) {
      console.error("Erreur POST escalade :", err);
      if (err.response?.status === 403) {
        toast.error("Accès interdit : vous n'avez pas les permissions.");
      } else {
        toast.error("Erreur lors de l'escalade");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">
          Escalader le ticket #{ticketId}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-900">
              Superviseur
            </label>
            <select
              value={selectedSuperviseur}
              onChange={(e) =>
                setSelectedSuperviseur(Number(e.target.value))
              }
              className="w-full border border-gray-300 rounded-md p-3 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            >
              <option value="">-- Sélectionner un superviseur --</option>
              {superviseurs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.prenom} {s.nom} ({s.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-900">
              Commentaire
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 bg-white text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows={4}
              required
              placeholder="Votre commentaire ici..."
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-900">
              Fichier (optionnel)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-gray-900"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EscaladeModal;
