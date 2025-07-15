import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import type { User } from "../types";
import { Plus } from "lucide-react";

interface PrestationFormData {
  nom: string;
  societe: number | "";
}

interface Societe {
  id: number;
  nom: string;
}

const GestClient = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<PrestationFormData>({
    nom: "",
    societe: "",
  });
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddSociete, setShowAddSociete] = useState(false);
  const [newSocieteName, setNewSocieteName] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  useEffect(() => {
    const fetchSocietes = async () => {
      try {
        const res = await axios.get("/societes/");
        setSocietes(res.data);
      } catch (error) {
        toast.error("Erreur lors du chargement des sociétés");
      }
    };
    fetchSocietes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "societe" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.societe) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/prestations/", formData);
      toast.success("Prestation créée avec succès !");
      setFormData({ nom: "", societe: "" });
    } catch (err) {
      toast.error("Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSociete = async () => {
    if (!newSocieteName.trim()) return;
    try {
      const res = await axios.post("/societes/", { nom: newSocieteName });
      setSocietes([...societes, res.data]);
      setFormData({ ...formData, societe: res.data.id });
      setNewSocieteName("");
      setShowAddSociete(false);
      toast.success("Société ajoutée !");
    } catch {
      toast.error("Erreur lors de l'ajout de la société.");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-800">
      {currentUser && (
        <Sidebar
          user={currentUser}
          onLogout={() => {
            localStorage.clear();
            navigate("/login");
          }}
        />
      )}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6 text-red-600 text-center">
          Gestion des clients
        </h1>

        <div className="w-full lg:max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Société */}
            <div>
              <label className="block text-sm font-medium">Société</label>
              <div className="flex items-center gap-2">
                <select
                  name="societe"
                  value={formData.societe}
                  onChange={handleChange}
                  required
                  className="flex-1 mt-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Choisir une société --</option>
                  {societes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nom}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddSociete(!showAddSociete)}
                  className="text-green-600 hover:text-green-800"
                  title="Ajouter une société"
                >
                  <Plus size={20} />
                </button>
              </div>
              {showAddSociete && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Nom de la nouvelle société"
                    value={newSocieteName}
                    onChange={(e) => setNewSocieteName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white text-black"
                  />
                  <button
                    type="button"
                    onClick={handleAddSociete}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Ajouter
                  </button>
                </div>
              )}
            </div>

            {/* Nom prestation */}
            <div>
              <label className="block text-sm font-medium">Nom de la prestation</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              {loading ? "Création en cours..." : "Créer la prestation"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default GestClient;
