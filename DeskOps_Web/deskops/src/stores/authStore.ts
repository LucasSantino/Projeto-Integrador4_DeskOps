// src/stores/authStore.ts
import { defineStore } from 'pinia';
import router from '../router';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    access: localStorage.getItem('access') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.access,
    userRole: (state) => state.user?.cargo || null,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        // 🔹 Djoser Token Login espera "username" (mesmo que seja email)
        const response = await api.post('/auth/token/login/', {
          username: email, // use o campo de login correto (username ou email)
          password: password,
        });

        const { auth_token } = response.data;

        // 🔹 Salva token localmente
        this.access = auth_token;
        localStorage.setItem('access', auth_token);

        // 🔹 Buscar dados do usuário logado
        const meResponse = await api.get('/auth/users/me/', {
          headers: { Authorization: `Token ${auth_token}` },
        });

        this.user = meResponse.data;
        localStorage.setItem('user', JSON.stringify(this.user));

        // 🔹 Redirecionamento automático
        if (this.user.cargo === 'ADM') router.push('/adm/dashboard');
        else if (this.user.cargo === 'tecnico') router.push('/tecnico/chamados-lista');
        else router.push('/cliente/meus-chamados');

      } catch (error: any) {
        // 🔹 Tratar erro do backend para exibir na interface
        let message = "E-mail ou senha incorretos.";
        if (error?.non_field_errors) {
          message = error.non_field_errors.join(" ");
        } else if (error?.username) {
          message = error.username.join(" ");
        } else if (error?.password) {
          message = error.password.join(" ");
        }
        throw message;
      }
    },

    logout() {
      this.user = null;
      this.access = null;
      localStorage.removeItem('user');
      localStorage.removeItem('access');
      router.push('/');
    },
  },
});
