import axios from "axios";

const api = axios.create({
  // Replace this with your actual, live BACKEND Vercel URL
  baseURL: "https://nuezen.vercel.app/", 
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
