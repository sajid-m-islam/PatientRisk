import axios from "axios";

const api = axios.create({
    // empty = same origin (FastAPI serves the built frontend in production)
    baseURL: import.meta.env.VITE_API_URL ?? "",
});

export default api;
