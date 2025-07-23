import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";


// ⚠️ Liste de techniciens simulée
const initialTechnicians = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Alice",
    email: "alice.dupont@example.com",
    tempsMoyen: "12min",
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Bob",
    email: "bob.martin@example.com",
    tempsMoyen: "8min",
  },
];

const Technicians: React.FC = () => {
  const [technicians, setTechnicians] = useState(initialTechnicians);
  const [newTech, setNewTech] = useState({ nom: "", prenom: "", email: "" });

  

  const handleAddTechnician = () => {
    if (!newTech.nom || !newTech.prenom || !newTech.email) return;
    const newId = technicians.length + 1;
    const newEntry = { ...newTech, id: newId, tempsMoyen: "0min" };
    setTechnicians([...technicians, newEntry]);
    setNewTech({ nom: "", prenom: "", email: "" });
  };

  const handleDelete = (id: number) => {
    setTechnicians(technicians.filter((t) => t.id !== id));
  };

  const handleEdit = (id: number) => {
    const tech = technicians.find((t) => t.id === id);
    if (tech) setNewTech({ nom: tech.nom, prenom: tech.prenom, email: tech.email });
    setTechnicians(technicians.filter((t) => t.id !== id)); // supprime temporairement pour édition
  };

  return (
    
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Gestion des Techniciens</h1>

        {/* Formulaire d'ajout */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Ajouter / Modifier un technicien</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nom"
              className="border p-2 rounded"
              value={newTech.nom}
              onChange={(e) => setNewTech({ ...newTech, nom: e.target.value })}
            />
            <input
              type="text"
              placeholder="Prénom"
              className="border p-2 rounded"
              value={newTech.prenom}
              onChange={(e) => setNewTech({ ...newTech, prenom: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded"
              value={newTech.email}
              onChange={(e) => setNewTech({ ...newTech, email: e.target.value })}
            />
          </div>
          <button
            onClick={handleAddTechnician}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Enregistrer
          </button>
        </div>

        {/* Liste des techniciens */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Liste des techniciens</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Nom</th>
                <th className="p-2">Prénom</th>
                <th className="p-2">Email</th>
                <th className="p-2">Temps moyen</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {technicians.map((tech) => (
                <tr key={tech.id} className="border-t">
                  <td className="p-2">{tech.nom}</td>
                  <td className="p-2">{tech.prenom}</td>
                  <td className="p-2">{tech.email}</td>
                  <td className="p-2">{tech.tempsMoyen}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(tech.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(tech.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {technicians.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-4">
                    Aucun technicien trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    
  );
};

export default Technicians;
