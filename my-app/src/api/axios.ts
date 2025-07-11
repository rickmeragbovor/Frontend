// src/api/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000/api", // Modifie si ton backend est ailleurs
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter automatiquement le token JWT
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
