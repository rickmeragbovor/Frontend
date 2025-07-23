// src/api/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000", // Modifie si ton backend est ailleurs
  headers: {
    "Content-Type": "application/json",
  },
});
// Axios config global
instance.defaults.withCredentials = true;


// Intercepteur pour ajouter automatiquement le token JWT
instance.interceptors.request.use(
  (config) => {
   if (!["/auth/login"].includes(config.url!)) {
      const token =
        localStorage.getItem("access") || localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
