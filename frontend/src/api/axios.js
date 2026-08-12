import axios from "axios";

// HARDCODING the working Railway URL to bypass Vercel variable issues
const api = axios.create({
  baseURL: "https://focused-embrace-production-b69f.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;