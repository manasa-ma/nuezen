import axios from "axios";

const api = axios.create({
  // Hardcode your working Railway URL here for 100% certainty
  baseURL: "https://focused-embrace-production-b69f.up.railway.app",
});

export default api;