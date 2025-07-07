// src/pages/GestTech.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Sidebar from "../components/Sidebar";
import type { User } from "../types";

const ITEMS_PER_PAGE = 5;

const GestTech = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    role: "technicien",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Récupération de l'utilisateur connecté depuis localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userParsed: User = JSON.parse(userStr);
        setCurrentUser(userParsed);
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      const res = await axios.get("/utilisateurs/");
      setUtilisateurs(res.data);
    } catch (error) {
      console.error("Erreur chargement utilisateurs :", error);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`/utilisateurs/${editingId}/`, formData);
        toast.success("Utilisateur mis à jour !");
      } else {
        await axios.post("/utilisateurs/", formData);
        toast.success("Utilisateur créé !");
      }
      fetchUtilisateurs();
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        password: "",
        role: "technicien",
      });
      setEditingId(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.detail || "Erreur lors de l’opération."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`/utilisateurs/${id}/`);
      toast.success("Utilisateur supprimé.");
      fetchUtilisateurs();
    } catch (error) {
      toast.error("Erreur suppression.");
    }
  };

  const handleEdit = (u: User) => {
    const { prenom = "", nom = "", email = "", role = "technicien", id } = u;
    setFormData({
      prenom,
      nom,
      email,
      password: "",
      role,
    });
    setEditingId(id);
  };

  const cancelEdit = () => {
    setFormData({
      prenom: "",
      nom: "",
      email: "",
      password: "",
      role: "technicien",
    });
    setEditingId(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const utilisateursFiltres = utilisateurs.filter((u) =>
    `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(utilisateursFiltres.length / ITEMS_PER_PAGE);
  const utilisateursPage = utilisateursFiltres.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-800">
      {/* Passe currentUser à la Sidebar */}
      {currentUser && <Sidebar user={currentUser} onLogout={handleLogout} />}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6 text-red-600 text-center">
          Gestion des utilisateurs
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulaire */}
          <div className="bg-white rounded-xl shadow p-6 w-full lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-red-500">
              {editingId ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={editingId ? "Laisser vide si inchangé" : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Rôle</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="technicien">Technicien</option>
                  <option value="superieur">Supérieur</option>
                  <option value="administrateur">Administrateur</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white font-medium py-2 rounded-lg hover:bg-red-700 transition"
                >
                  {editingId ? "Mettre à jour" : "Créer"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-300 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Liste utilisateurs avec recherche et pagination */}
          <div className="bg-white rounded-xl shadow p-6 w-full lg:w-1/2 overflow-auto">
            <h2 className="text-xl font-semibold mb-4 text-red-500">
              Liste des utilisateurs
            </h2>

            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            {utilisateursPage.length === 0 ? (
              <p className="text-gray-500">Aucun utilisateur trouvé.</p>
            ) : (
              <>
                <table className="w-full text-sm border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border-b">Nom</th>
                      <th className="p-2 border-b">Email</th>
                      <th className="p-2 border-b">Rôle</th>
                      <th className="p-2 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utilisateursPage.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="p-2 border-b">{`${u.prenom} ${u.nom}`}</td>
                        <td className="p-2 border-b">{u.email}</td>
                        <td className="p-2 border-b capitalize">{u.role}</td>
                        <td className="p-2 border-b text-center space-x-2">
                          <button
                            onClick={() => handleEdit(u)}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Précédent
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GestTech;
