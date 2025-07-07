import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");

    try {
      const response = await axios.post("/token/", {
        email,
        password,
      });

      const access = response.data.access;
      const refresh = response.data.refresh;

      if (!access || !refresh) {
        throw new Error("Token manquant");
      }

      // Stocker les tokens
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("token", access);

      // 🔐 Récupérer l'utilisateur connecté
      const userResponse = await axios.get("/utilisateurs/me/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      const user = userResponse.data;
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Bienvenue !");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erreur lors de la connexion :", error);
      setErreur("Identifiants invalides. Veuillez réessayer.");
      toast.error("Identifiants invalides. Veuillez réessayer.");
    }
  };

  return (
    <div className="h-dvh w-dvw flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-red-600 mb-6 uppercase tracking-wide text-center">
        TECHEXPERT PORTAIL
      </h1>

      <div className="w-full max-w-sm bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-red-400 text-center mb-6">Connexion</h2>

        <form className="space-y-4 sm:space-y-5" onSubmit={handleLogin}>
          {erreur && <p className="text-red-600">{erreur}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
