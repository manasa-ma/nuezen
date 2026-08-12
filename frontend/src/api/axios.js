import axios from "axios";

const api = axios.create({
  // Hardcoded to ensure Vercel uses the correct URL
  baseURL: "https://focused-embrace-production-b69f.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add the token to every request if it exists
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;