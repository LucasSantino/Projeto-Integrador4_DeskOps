import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'  
import CadastroPage from '@/views/CadastroPage.vue'
import ClientesChamados from'@/views/ClientesChamados'
import ClientesNewChamado from '@/views/ClientesNewchamado'


const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Cadastro',
    component: CadastroPage
  },
  {
    path: '/clienteschamados',
    name: 'ClientesChamados',
    component: ClientesChamados
  },
  {
    path: '/clientenewchamado',
    name: 'ClientesnewChamado',
    component: ClientesNewChamado
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
