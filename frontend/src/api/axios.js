import axios from "axios";

// This line gets the URL from Vercel
const apiURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;