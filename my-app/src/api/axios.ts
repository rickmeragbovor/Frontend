import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // ✅ Lien vers ton backend Django
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// ✅ Pour s'assurer que le Content-Type est toujours bien défini même pour POST dynamiques
api.defaults.headers.post["Content-Type"] = "application/json";

export default api;

