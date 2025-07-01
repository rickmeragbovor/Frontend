import { useState, useEffect } from "react";
import axios from "../api/axios";
import { IMaskInput } from "react-imask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Types explicites
interface Societe {
  id: number;
  nom: string;
}
interface Prestation {
  id: number;
  nom: string;
}
interface Role {
  id: number;
  nom: string;
}
interface DescriptionType {
  id: number;
  nom: string;
}

interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  societe: number | "";
  prestation: number | "";
  role: number | "";
  description_type: number | "";
  description: string;
}

const TicketForm = () => {
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [descriptionTypes, setDescriptionTypes] = useState<DescriptionType[]>([]);

  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    societe: "",
    prestation: "",
    role: "",
    description_type: "",
    description: "",
  });

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
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    const numericFields = ["role", "societe", "prestation", "description_type"];
    const parsedValue = numericFields.includes(name)
      ? value !== ""
        ? Number(value)
        : ""
      : value;

    setFormData((prev) => ({ ...prev, [name]: parsedValue }));

    if (name === "societe") {
      try {
        const res = await axios.get(`/prestations/?societe=${value}`);
        setPrestations(res.data);
        setFormData((prev) => ({ ...prev, prestation: "" }));
      } catch (error) {
        console.error("Erreur lors du chargement des prestations :", error);
        setPrestations([]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      societe: formData.societe === "" ? null : formData.societe,
      prestation: formData.prestation === "" ? null : formData.prestation,
      role: formData.role === "" ? null : formData.role,
      description_type: formData.description_type === "" ? null : formData.description_type,
    };

    try {
      await axios.post("/create-ticket/", payload);
      toast.success("🎉 Votre ticket a été bien enregistré !");
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        societe: "",
        prestation: "",
        role: "",
        description_type: "",
        description: "",
      });
      setPrestations([]);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du ticket :", error);
      toast.error("❌ Une erreur est survenue lors de l'envoi.");
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

          {/* Téléphone avec IMaskInput */}
          <IMaskInput
            mask="+228-00-00-00-00"
            definitions={{ "0": /[0-9]/ }}
            unmask={false}
            value={formData.telephone}
            onAccept={(value: any) =>
              setFormData((prev) => ({ ...prev, telephone: value }))
            }
            name="telephone"
            placeholder="+228-XX-XX-XX-XX"
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
            <option value="">-- Sélectionnez une société --</option>
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
            disabled={!prestations.length}
          >
            <option value="">-- Sélectionnez une prestation --</option>
            {prestations.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom}
              </option>
            ))}
          </select>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="p-3 border rounded-md"
          >
            <option value="">-- Sélectionnez un rôle --</option>
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
            required
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

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default TicketForm;
