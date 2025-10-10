// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Login Pages
import Login from '../pages/login/Login.vue'
import Cadastro from '../pages/login/cadastro.vue'

// Admin Pages
import AdmPerfil from '../pages/adm/admPerfil.vue'
import Dashboard from '../pages/adm/dashboard.vue'
import GestaoAmbiente from '../pages/adm/gestaoAmbiente.vue'
import GestaoChamado from '../pages/adm/gestaoChamado.vue'
import GestaoUsuarios from '../pages/adm/gestaoUsuarios.vue'

// Cliente Pages
import ChamadoDetalhado from '../pages/cliente/chamadoDetalhado.vue'
import EditarChamado from '../pages/cliente/editarChamado.vue'
import MeusChamados from '../pages/cliente/meusChamados.vue'
import NovoChamado from '../pages/cliente/novoChamado.vue'
import PerfilCliente from '../pages/cliente/perfil.vue'

// Tecnico Pages
import ChamadosTecnico from '../pages/tecnico/chamadosTecnico.vue'
import TecnicoChamaDetalha from '../pages/tecnico/tecnico_chamaDetalha.vue'
import TecnicoPerfil from '../pages/tecnico/tecnicoPerfil.vue'

const routes: Array<RouteRecordRaw> = [
  // Login Routes
  { path: '/', name: 'Login', component: Login },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro },

  // Admin Routes
  { path: '/adm/perfil', name: 'AdmPerfil', component: AdmPerfil },
  { path: '/adm/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/adm/gestao-ambiente', name: 'GestaoAmbiente', component: GestaoAmbiente },
  { path: '/adm/gestao-chamado', name: 'GestaoChamado', component: GestaoChamado },
  { path: '/adm/gestao-usuarios', name: 'GestaoUsuarios', component: GestaoUsuarios },

  // Cliente Routes
  { path: '/cliente/chamado-detalhado', name: 'ChamadoDetalhado', component: ChamadoDetalhado },
  { path: '/cliente/editar-chamado', name: 'EditarChamado', component: EditarChamado },
  { path: '/cliente/meus-chamados', name: 'MeusChamados', component: MeusChamados },
  { path: '/cliente/novo-chamado', name: 'NovoChamado', component: NovoChamado },
  { path: '/cliente/perfil', name: 'PerfilCliente', component: PerfilCliente },

  // Tecnico Routes
  { path: '/tecnico/chamados', name: 'ChamadosTecnico', component: ChamadosTecnico },
  { path: '/tecnico/chamado-detalhado', name: 'TecnicoChamaDetalha', component: TecnicoChamaDetalha },
  { path: '/tecnico/perfil', name: 'TecnicoPerfil', component: TecnicoPerfil },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
