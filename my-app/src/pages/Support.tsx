import { useState, useEffect } from "react";
import axios from "../api/axios";

// Types explicites (à adapter selon ton backend)
interface Societe { id: number; nom: string }
interface Prestation { id: number; nom: string }
interface Role { id: number; nom: string }
interface DescriptionType { id: number; nom: string }

const Support = () => {
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [descriptionTypes, setDescriptionTypes] = useState<DescriptionType[]>([]);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    societe: "",
    prestation: "",
    role_client: "",    // renommé ici
    description: "",
    description_type: "",
  });

  // Chargement initial des données
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [socRes, roleRes, descRes] = await Promise.all([
          axios.get("/societes/"),
          axios.get("/roles/"),
          axios.get("/description-types/"),
        ]);
        setSocietes(socRes.data);
        setRoles(roleRes.data);
        setDescriptionTypes(descRes.data);
      } catch (error) {
        console.error("Erreur chargement des données:", error);
      }
    };
    fetchInitialData();
  }, []);

  // Gère le changement d’un champ
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Pour gérer le renommage côté formulaire
    if (name === "role") {
      setFormData(prev => ({ ...prev, role_client: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === "societe") {
      try {
        const res = await axios.get(`/prestations/?societe=${value}`);
        setPrestations(res.data);
        setFormData(prev => ({ ...prev, prestation: "" })); // reset prestation
      } catch (error) {
        console.error("Erreur chargement des prestations :", error);
        setPrestations([]);
      }
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Correction ici : URL conforme à ton backend Django
      await axios.post("/tickets/", formData);  // <-- ici c’est correct
      alert("Ticket enregistré avec succès !");
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        societe: "",
        prestation: "",
        role_client: "",
        description: "",
        description_type: "",
      });
      setPrestations([]);
    } catch (error) {
      console.error("Erreur enregistrement ticket :", error);
      alert("Erreur lors de l'envoi du ticket.");
    }
  };

  return (
    <div className="h-dvh w-dvw flex flex-col items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-gray-50 shadow-md p-6 rounded-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-red-400 text-center mb-6">
          Formulaire de création de ticket
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom"
            required
            className="p-3 border rounded-md"
          />
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="Prénom"
            required
            className="p-3 border rounded-md"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="p-3 border rounded-md"
          />
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="Téléphone"
            required
            className="p-3 border rounded-md"
          />

          <select
            name="societe"
            value={formData.societe}
            onChange={handleChange}
            required
            className="p-3 border rounded-md"
          >
            <option value="">-- Société --</option>
            {societes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nom}
              </option>
            ))}
          </select>

          <select
            name="prestation"
            value={formData.prestation}
            onChange={handleChange}
            required
            className="p-3 border rounded-md"
          >
            <option value="">-- Prestation --</option>
            {prestations.length > 0 ? (
              prestations.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom}
                </option>
              ))
            ) : (
              <option disabled>Aucune prestation disponible</option>
            )}
          </select>

          <select
            name="role"
            value={formData.role_client}
            onChange={handleChange}
            className="p-3 border rounded-md"
          >
            <option value="">-- Rôle dans l’entreprise --</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nom}
              </option>
            ))}
          </select>

          <select
            name="description_type"
            value={formData.description_type}
            onChange={handleChange}
            className="p-3 border rounded-md"
          >
            <option value="">-- Type de problème --</option>
            {descriptionTypes.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nom}
              </option>
            ))}
          </select>
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Décrivez votre problème ici..."
          required
          className="w-full p-3 border rounded-md h-36"
        />

        <div className="text-center">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md"
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};

export default Support;
