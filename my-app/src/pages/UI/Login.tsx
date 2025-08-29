import React, { useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'sonner'
import axios from '../../api/axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await axios.post('/auth/login/', {
        email,
        password,
      });
      const data = response.data;
      console.log('Connexion réussie :', data);
      localStorage.setItem('token', data.access);
      const response_user = await axios.get('/api/me/')
      console.log(response_user),
      localStorage.setItem('user', JSON.stringify(response_user.data))
      toast.success('Connexion réussie 🎉');
      navigate("/dashboard");
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      toast.error('Échec de la connexion. Vérifiez vos identifiants.');
    }
  };
  return (
    <>
      {/* <ToastContainer /> */}
      <div className="h-dvh w-dvw flex items-center justify-center bg-gray-100 px-4">
        <div className="flex w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden border-t-4 border-red-500">
          {/* Logo / Infos */}
          <div className="w-1/2 p-8 flex flex-col justify-center items-center border-r border-gray-300">
            <h1 className="text-4xl font-bold text-red-600 mb-4">TECHEXPERT</h1>
            <p className="text-sm text-gray-700 text-center leading-relaxed">
              Techniques et Expertises Informatiques<br />
              Intégration de Solutions Informatiques<br />
              Vente de Logiciels et de Matériels
            </p>
          </div>
          {/* Formulaire */}
          <div className="w-1/2 p-8">
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
              Bienvenue sur le PORTAIL de <span className="text-red-500 font-bold">TICKETING</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Adresse e-mail"
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
              >
                SE CONNECTER
              </button>
            </form>
            <p className="text-center text-xs text-gray-500 mt-6">TECHEXPERT@2025</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
