// src/stores/authStore.ts
import { defineStore } from 'pinia'
import router from '../router'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    access: localStorage.getItem('access') || null,
    refresh: null, // Djoser authtoken não usa refresh
  }),

  getters: {
    isAuthenticated: (state) => !!state.access,
    userRole: (state) => state.user?.cargo || null,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        // LOGIN usando Djoser Authtoken
        const response = await api.post('/auth/token/login/', {
          email,
          password,
        });

        const { auth_token } = response.data;

        // Salva token no estado e localStorage
        this.access = auth_token;
        localStorage.setItem('access', auth_token);

        // Buscar dados do usuário logado (interceptor já envia token)
        const meResponse = await api.get('/auth/users/me/');
        this.user = meResponse.data;
        localStorage.setItem('user', JSON.stringify(this.user));

        // Redirecionamento de acordo com cargo
        if (this.user.cargo === 'ADM') router.push('/adm/dashboard');
        else if (this.user.cargo === 'tecnico') router.push('/tecnico/chamados-lista');
        else router.push('/cliente/meus-chamados');

      } catch (error: any) {
        throw error.response?.data || 'Erro ao realizar login';
      }
    },

    logout() {
      this.user = null;
      this.access = null;
      this.refresh = null;
      localStorage.clear();
      router.push('/');
    },
  },
});
