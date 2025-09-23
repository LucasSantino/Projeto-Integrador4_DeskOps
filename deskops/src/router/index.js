import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'  
import CadastroPage from '@/views/CadastroPage.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
