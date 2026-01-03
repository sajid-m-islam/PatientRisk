import axios from "axios";

const api = axios.create({
    baseURL: "https://patientrisk.onrender.com/",
});

export default api;
