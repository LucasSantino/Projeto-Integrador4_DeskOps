// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// --- Login Pages ---
import Login from '@/pages/login/Login.vue'
import Cadastro from '@/pages/login/cadastro.vue'

// --- Admin Pages ---
import AdmPerfil from '@/pages/adm/admPerfil.vue'
import Dashboard from '@/pages/adm/dashboard.vue'
import GestaoAmbiente from '@/pages/adm/gestaoAmbiente.vue'
import GestaoChamado from '@/pages/adm/gestaoChamado.vue'
import GestaoUsuarios from '@/pages/adm/gestaoUsuarios.vue'
import NovoAmbiente from '@/pages/adm/novoAmbiente.vue'
import GestaoAtivos from '@/pages/adm/gestaoAtivos.vue'
import NovoAtivo from '@/pages/adm/novoAtivo.vue'
import DetalhesAtivos from '@/pages/adm/detalhesAtivos.vue'
import DetalhesAmbiente from '@/pages/adm/detalhesAmbiente.vue'

// --- Cliente Pages ---
import ChamadoDetalhado from '@/pages/cliente/chamadoDetalhado.vue'
import EditarChamado from '@/pages/cliente/editarChamado.vue'
import MeusChamados from '@/pages/cliente/meusChamados.vue'
import NovoChamado from '@/pages/cliente/novoChamado.vue'
import PerfilCliente from '@/pages/cliente/perfil.vue'

// --- Técnico Pages ---
import ChamadosTecnico from '@/pages/tecnico/chamadosTecnico.vue'
import TecnicoChamaDetalha from '@/pages/tecnico/TecnicoChamaDetalha.vue'
import TecnicoPerfil from '@/pages/tecnico/tecnicoPerfil.vue'
import ChamadosLista from '@/pages/tecnico/chamadosLista.vue'

// --- Pública (QR Code) ---
import TechDetalhesAtivos from '@/pages/TechDetalhesAtivos.vue'

const routes: Array<RouteRecordRaw> = [
  // Login Routes
  { path: '/', name: 'Login', component: Login, meta: { public: true } },
  { path: '/cadastro', name: 'Cadastro', component: Cadastro, meta: { public: true } },

  // Admin Routes
  { path: '/adm/perfil', name: 'AdmPerfil', component: AdmPerfil, meta: { role: 'ADM' } },
  { path: '/adm/dashboard', name: 'Dashboard', component: Dashboard, meta: { role: 'ADM' } },
  { path: '/adm/gestao-ambiente', name: 'GestaoAmbiente', component: GestaoAmbiente, meta: { role: 'ADM' } },
  { path: '/adm/gestao-chamado', name: 'GestaoChamado', component: GestaoChamado, meta: { role: 'ADM' } },
  { path: '/adm/gestao-usuarios', name: 'GestaoUsuarios', component: GestaoUsuarios, meta: { role: 'ADM' } },
  { path: '/adm/novo-ambiente', name: 'NovoAmbiente', component: NovoAmbiente, meta: { role: 'ADM' } },
  { path: '/adm/gestao-ativos', name: 'GestaoAtivos', component: GestaoAtivos, meta: { role: 'ADM' } },
  { path: '/adm/novo-ativo', name: 'NovoAtivo', component: NovoAtivo, meta: { role: 'ADM' } },
  { path: '/adm/detalhes-ativo/:id', name: 'DetalhesAtivo', component: DetalhesAtivos, meta: { role: 'ADM' } },
  { path: '/adm/detalhes-ambiente/:id', name: 'DetalhesAmbiente', component: DetalhesAmbiente, meta: { role: 'ADM' } },

  // Cliente Routes
  { path: '/cliente/chamado/:id', name: 'ChamadoDetalhado', component: ChamadoDetalhado, meta: { role: 'usuario' }, props: true, },
  {  path: '/cliente/editar-chamado/:id', name: 'EditarChamado',component: EditarChamado,  meta: { role: 'usuario' },props: true},
  { path: '/cliente/meus-chamados', name: 'MeusChamados', component: MeusChamados, meta: { role: 'usuario' } },
  { path: '/cliente/novo-chamado', name: 'NovoChamado', component: NovoChamado, meta: { role: 'usuario' } },
  { path: '/cliente/perfil', name: 'PerfilCliente', component: PerfilCliente, meta: { role: 'usuario' } },

  // Técnico Routes
  { path: '/tecnico/chamados', name: 'ChamadosTecnico', component: ChamadosTecnico, meta: { role: 'tecnico' } },
  { path: '/tecnico/chamados-lista', name: 'ChamadosLista', component: ChamadosLista, meta: { role: 'tecnico' } },
  { path: '/tecnico/chamado-detalhado/:id', name: 'TecnicoChamaDetalha', component: TecnicoChamaDetalha, meta: { role: 'tecnico' } },
  { path: '/tecnico/perfil', name: 'TecnicoPerfil', component: TecnicoPerfil, meta: { role: 'tecnico' } },

  // Pública (QR Code)
  { path: '/tech/ativo/:id', name: 'TechDetalhesAtivos', component: TechDetalhesAtivos, props: true, meta: { public: true } },
]

// 🚀 Criação do router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔒 Proteção global de rotas
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Rota pública → pode acessar sem login
  if (to.meta.public) return next()

  // Se não estiver logado, redireciona pro login
  if (!auth.isAuthenticated) {
    return next({ name: 'Login' })
  }

  // Se tiver logado, verifica o cargo
  if (to.meta.role && auth.userRole !== to.meta.role) {
    // Redireciona para a rota do tipo certo
    if (auth.userRole === 'admin') return next({ name: 'Dashboard' })
    if (auth.userRole === 'tecnico') return next({ name: 'ChamadosTecnico' })
    if (auth.userRole === 'usuario') return next({ name: 'MeusChamados' })
    return next({ name: 'Login' })
  }

  next()
})

// 👇 Exportação obrigatória
export default router
