import { defineStore } from 'pinia'
import router from '../router'
import api from '../services/api' 

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
        const response = await api.post('/login/', { email, password });
        const { access, refresh, user } = response.data;

        this.access = access;
        this.refresh = refresh;
        this.user = user;

        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        localStorage.setItem('user', JSON.stringify(user));

        // redirecionamento dinâmico
        console.log(JSON.parse(JSON.stringify(user.cargo)))
        if (user.cargo === 'ADM') router.push('/adm/dashboard');
        else if (user.cargo === 'tecnico') router.push('/tecnico/chamados-lista');
        else router.push('/cliente/meus-chamados');
      } catch (error: any) {
        throw error.response?.data?.detail || 'Erro ao realizar login';
      }
        const meResponse = await api.get('/me/', {
        headers: { Authorization: `Bearer ${this.access}` }
      })
      this.user = meResponse.data

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
