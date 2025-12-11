import axios from "axios";

const api = axios.create({
  baseURL: "https://deskops-v1-cyfhfecpc0decmd8.westus3-01.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Token ${token}`;  // <-- CORRETO PARA DJOSER AUTHTOKEN
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
