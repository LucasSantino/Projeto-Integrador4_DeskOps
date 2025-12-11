// src/stores/authStore.ts
import { defineStore } from 'pinia';
import router from '../router';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    access: localStorage.getItem("access") || null,
    refresh: localStorage.getItem("refresh") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.access,
    userRole: (state) => state.user?.role || null, // <-- no backend o campo é "role"
  },

  actions: {
    async login(email: string, password: string) {
      try {
        // LOGIN usando SIMPLEJWT
        const response = await api.post("login/", { email, password });

        const { access, refresh, user } = response.data;

        // Salva tokens
        this.access = access;
        this.refresh = refresh;
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);

        // Configurar token no axios
        api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

        // Salvar usuário
        this.user = user;
        localStorage.setItem("user", JSON.stringify(user));

        // REDIRECIONAR com base no role do usuário
        if (user.role === "admin") router.push("/adm/dashboard");
        else if (user.role === "tecnico") router.push("/tecnico/chamados-lista");
        else router.push("/cliente/meus-chamados");

      } catch (error: any) {
        console.error("Erro no login →", error);

        throw "E-mail ou senha inválidos ou usuário não aprovado.";
      }
    },

    logout() {
      this.user = null;
      this.access = null;
      this.refresh = null;

      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      delete api.defaults.headers.common["Authorization"];

      router.push("/");
    }
  }
});
