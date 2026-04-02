import axios from "axios";

// Use the same backend base URL as the main app,
// so admin works both locally and on Vercel/Render.
const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminAxios;
