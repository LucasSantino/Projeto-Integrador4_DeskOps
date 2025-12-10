import axios from "axios";

const api = axios.create({
  baseURL: "https://deskops-v1-cyfhfecpc0decmd8.westus3-01.azurewebsites.net",  // URL do backend Azure
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");  // Obtém o access token do localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Adiciona o token no cabeçalho Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;