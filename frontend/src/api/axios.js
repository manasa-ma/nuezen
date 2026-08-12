import axios from "axios";

// Clean the URL to ensure no trailing slash
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const cleanUrl = rawUrl.replace(/\/$/, "");

const api = axios.create({
  baseURL: cleanUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;