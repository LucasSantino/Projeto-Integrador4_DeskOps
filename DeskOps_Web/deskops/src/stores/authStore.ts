import { defineStore } from 'pinia'
import router from '../router'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    access: localStorage.getItem('access') || null,
    refresh: localStorage.getItem('refresh') || null,
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
          email: email,
          password: password,
        });

        const { auth_token } = response.data;

        // Salva token
        this.access = auth_token;
        this.refresh = null; // não usado pelo authtoken
        localStorage.setItem('access', auth_token);

        // Buscar dados do usuário logado
        const meResponse = await api.get('/auth/users/me/', {
          headers: { Authorization: `Token ${auth_token}` },
        });

        this.user = meResponse.data;
        localStorage.setItem('user', JSON.stringify(this.user));

        // Redirecionamento
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
