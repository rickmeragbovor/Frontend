import React, { useEffect, useState, type FormEvent } from "react";
import axios from "../../api/axios";
import { toast } from "sonner"; // ✅ Toast

interface Role { id: number; nom: string }
interface Client { id: number; nom: string }
interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  tel?: string;
  roles: Role[];
  poste?: string;
  client?: number;
}

const Users: React.FC = () => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [poste, setPoste] = useState("");
  const [roles, setRoles] = useState<number[]>([]);
  const [clientId, setClientId] = useState<number | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<Utilisateur | null>(null);
  const usersPerPage = 6;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [rolesRes, clientsRes, usersRes] = await Promise.all([
        axios.get("/api/roles/", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/clients/", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/utilisateurs/", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setAllRoles(rolesRes.data);
      setAllClients(clientsRes.data);
      setUtilisateurs(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleIdByName = (name: string): number =>
    allRoles.find(r => r.nom === name)?.id ?? -1;

  const resetForm = () => {
    setNom(""); setPrenom(""); setEmail(""); setTel(""); setPassword("");
    setRoles([]); setPoste(""); setClientId(""); setEditingUser(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (roles.includes(getRoleIdByName("personnel")) && (!poste.trim() || !clientId)) {
      toast.error("Pour un personnel, le poste et le client sont obligatoires.");
      return;
    }

    try {
      if (editingUser) {
        await axios.put(`/api/utilisateurs/${editingUser.id}/`, {
          nom, prenom, email, tel, poste,
          roles,
          ...(roles.includes(getRoleIdByName("personnel")) ? { client: clientId } : {}),
        }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("✅ Utilisateur mis à jour !");
      } else {
        await axios.post("/api/utilisateurs/create/", {
          nom, prenom, email, tel, password, poste,
          roles,
          ...(roles.includes(getRoleIdByName("personnel")) ? { client: clientId } : {}),
        }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("✅ Utilisateur créé !");
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de l'opération");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`/api/utilisateurs/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Utilisateur supprimé");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de la suppression");
    }
  };

  const handleEdit = (u: Utilisateur) => {
    setEditingUser(u);
    setNom(u.nom);
    setPrenom(u.prenom);
    setEmail(u.email);
    setTel(u.tel || "");
    setPoste(u.poste || "");
    setRoles(u.roles.map(r => r.id));
    setClientId(u.client || "");
  };

  const filtered = utilisateurs.filter(u =>
    `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginated = filtered.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const isFormValid = () =>
    nom.trim() && prenom.trim() && email.trim() && (editingUser || password) &&
    roles.length > 0 &&
    (!roles.includes(getRoleIdByName("personnel")) || (poste.trim() && clientId));

  return (
    <main className="flex flex-col p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👥 Gestion des Utilisateurs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulaire création/édition */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-xl space-y-4 border">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editingUser ? "✏️ Modifier l’utilisateur" : "➕ Créer un utilisateur"}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col col-span-1 text-sm font-medium text-gray-700">
              Nom
              <input className="bg-white text-black border p-2 rounded mt-1" value={nom} onChange={e => setNom(e.target.value)} required />
            </label>
            <label className="flex flex-col col-span-1 text-sm font-medium text-gray-700">
              Prénom
              <input className="bg-white text-black border p-2 rounded mt-1" value={prenom} onChange={e => setPrenom(e.target.value)} required />
            </label>
            <label className="flex flex-col col-span-2 text-sm font-medium text-gray-700">
              Email
              <input className="bg-white text-black border p-2 rounded mt-1" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label className="flex flex-col col-span-2 text-sm font-medium text-gray-700">
              Téléphone
              <input className="bg-white text-black border p-2 rounded mt-1" value={tel} onChange={e => setTel(e.target.value)} />
            </label>
            {!editingUser && (
              <label className="flex flex-col col-span-2 text-sm font-medium text-gray-700">
                Mot de passe
                <input className="bg-white text-black border p-2 rounded mt-1" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </label>
            )}
          </div>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Rôles
            <select multiple className="bg-white text-black border p-2 rounded mt-1"
              value={roles.map(String)}
              onChange={e => setRoles(Array.from(e.target.selectedOptions, opt => parseInt(opt.value)))}
              required>
              {allRoles.map(r => <option key={r.id} value={r.id}>{r.nom}</option>)}
            </select>
          </label>

          {roles.includes(getRoleIdByName("personnel")) && (
            <>
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Poste du personnel
                <input className="bg-white text-black border p-2 rounded mt-1" value={poste} onChange={e => setPoste(e.target.value)} required />
              </label>
              <label className="flex flex-col text-sm font-medium text-gray-700">
                Client rattaché
                <select className="bg-white text-black border p-2 rounded mt-1" value={clientId} onChange={e => setClientId(Number(e.target.value))} required>
                  <option value="">-- Sélectionne un client --</option>
                  {allClients.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
              </label>
            </>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={!isFormValid()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              {editingUser ? "Mettre à jour" : "Créer"}
            </button>
            {editingUser && (
              <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition">
                Annuler
              </button>
            )}
          </div>
        </form>

        {/* Liste utilisateurs */}
        <section className="bg-white shadow-lg p-6 rounded-xl border">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">📋 Liste des utilisateurs</h2>
          
          <label className="flex flex-col text-sm font-medium text-gray-700 w-full mb-4">
            Rechercher
            <input className="bg-white text-black border px-3 py-2 rounded mt-1" placeholder="🔍 Nom, prénom ou email" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </label>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border rounded">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {["Nom", "Prénom", "Email", "Téléphone", "Rôles", "Actions"].map(h => (
                    <th key={h} className="p-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(u => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{u.nom}</td>
                    <td className="p-2">{u.prenom}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.tel || "—"}</td>
                    <td className="p-2">{u.roles.map(r => r.nom).join(", ")}</td>
                    <td className="p-2 flex gap-2">
                      <button onClick={() => handleEdit(u)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">✏️</button>
                      <button onClick={() => handleDelete(u.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">🗑️</button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={6} className="p-4 text-center text-gray-500">Aucun utilisateur trouvé.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {Array.from({ length: Math.ceil(filtered.length / usersPerPage) }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Users;
