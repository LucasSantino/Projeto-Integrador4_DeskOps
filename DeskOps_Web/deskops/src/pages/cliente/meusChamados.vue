<template>
  <div class="meus-chamados-page" @click="closeProfileMenu">
    <!-- Sidebar do Cliente -->
    <aside class="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo">
        <img src="../../assets/images/logodeskops.png" alt="Logo DeskOps" class="logo-image" />
      </div>

      <!-- Links de navegação -->
      <nav class="sidebar-nav">
        <router-link to="/cliente/meus-chamados" class="nav-link" active-class="active">
          <span class="material-icons">list</span>
          Meus Chamados
        </router-link>
        <router-link to="/cliente/novo-chamado" class="nav-link" active-class="active">
          <span class="material-icons">add</span>
          Novo Chamado
        </router-link>
      </nav>

      <!-- Perfil com dropdown lateral -->
      <div class="profile-container" ref="profileContainer" @click.stop>
        <div class="sidebar-profile" @click="toggleProfileMenu">
          <div class="profile-image">👤</div>
          <div class="profile-info">
            <p class="profile-name">Lucas Santino</p>
            <p class="profile-email">lucas@email.com</p>
          </div>
        </div>

        <!-- Dropdown à direita com transição -->
        <transition name="slide-right">
          <div v-if="profileMenuOpen" class="profile-dropdown-right">
            <div class="dropdown-item" @click="goToPerfil">
              <span class="material-icons">person</span>
              Perfil
            </div>
            <div class="dropdown-item" @click="goToLogin">
              <span class="material-icons">logout</span>
              Sair
            </div>
          </div>
        </transition>
      </div>
    </aside>

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <h1 class="page-title">Meus Chamados</h1>

        <!-- Filtros -->
        <div class="filters">
          <select v-model="filtroStatus" class="filter-select">
            <option value="todos">Todos</option>
            <option value="concluido">Concluído</option>
            <option value="aberto">Aberto</option>
            <option value="aguardando">Aguardando</option>
            <option value="andamento">Em Andamento</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <input
            type="text"
            v-model="pesquisa"
            placeholder="Pesquisar por título ou técnico"
            class="filter-search"
          />
        </div>

        <!-- Tabela de chamados -->
        <div class="table-container">
          <table class="chamados-table">
            <thead>
              <tr>
                <th class="col-atualizado">Atualizado</th>
                <th class="col-id">ID</th>
                <th class="col-titulo">Título e Serviço</th>
                <th class="col-tecnico">Técnico</th>
                <th class="col-status">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="chamado in filtrados"
                :key="chamado.id"
                @click="goToChamadoDetalhado(chamado.id)"
                class="clickable-row"
              >
                <td>{{ chamado.atualizado }}</td>
                <td>{{ chamado.id }}</td>
                <td>{{ chamado.titulo }}</td>
                <td>
                  <div class="tecnico-info">
                    <p>{{ chamado.tecnico }}</p>
                    <p class="tecnico-email">{{ chamado.email || chamado.tecnico.toLowerCase() + '@email.com' }}</p>
                  </div>
                </td>
                <td>
                  <span :class="['status', statusClass(chamado.status)]">
                    <span class="material-icons status-icon" :style="{ color: statusIconColor(chamado.status) }">
                      {{ statusIcon(chamado.status) }}
                    </span>
                    {{ chamado.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Chamado {
  id: number
  atualizado: string
  titulo: string
  tecnico: string
  email?: string
  status: string
}

export default defineComponent({
  name: 'MeusChamados',
  setup() {
    const router = useRouter()
    const filtroStatus = ref('todos')
    const pesquisa = ref('')
    const profileMenuOpen = ref(false)

    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value
    }

    const closeProfileMenu = () => {
      profileMenuOpen.value = false
    }

    const goToPerfil = () => {
      router.push('/cliente/perfil')
      closeProfileMenu()
    }

    const goToLogin = () => {
      router.push('/')
      closeProfileMenu()
    }

    const goToChamadoDetalhado = (id: number) => {
      router.push({ path: '/cliente/chamado-detalhado', query: { id: id.toString() } })
    }

    const chamados = ref<Chamado[]>([
      { id: 101, atualizado: '11/10/2025 10:30', titulo: 'Troca de cabo', tecnico: 'João', email:'joao@email.com', status: 'Aberto' },
      { id: 102, atualizado: '10/10/2025 14:20', titulo: 'Atualização sistema', tecnico: 'Maria', email:'maria@email.com', status: 'Concluído' },
      { id: 103, atualizado: '09/10/2025 09:50', titulo: 'Manutenção impressora', tecnico: 'Pedro', email:'pedro@email.com', status: 'Em Andamento' },
      { id: 104, atualizado: '08/10/2025 11:10', titulo: 'Configuração rede', tecnico: 'Ana', email:'ana@email.com', status: 'Aguardando' },
      { id: 105, atualizado: '07/10/2025 16:00', titulo: 'Backup servidor', tecnico: 'Lucas', email:'lucas@email.com', status: 'Cancelado' },
    ])

    const filtrados = computed(() => {
      return chamados.value.filter((c) => {
        const matchStatus = filtroStatus.value === 'todos' || c.status.toLowerCase() === filtroStatus.value.toLowerCase()
        const matchPesquisa =
          c.titulo.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
          c.tecnico.toLowerCase().includes(pesquisa.value.toLowerCase())
        return matchStatus && matchPesquisa
      })
    })

    const statusClass = (status: string) => {
      switch (status.toLowerCase()) {
        case 'concluído': return 'status-concluido'
        case 'aberto': return 'status-aberto'
        case 'aguardando': return 'status-aguardando'
        case 'em andamento': return 'status-andamento'
        case 'cancelado': return 'status-cancelado'
        default: return ''
      }
    }

    const statusIcon = (status: string) => {
      switch (status.toLowerCase()) {
        case 'concluído': return 'check_circle'
        case 'aberto': return 'circle'
        case 'aguardando': return 'hourglass_top'
        case 'em andamento': return 'autorenew'
        case 'cancelado': return 'cancel'
        default: return ''
      }
    }

    const statusIconColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'concluído': return '#065f46'
        case 'aberto': return '#0f5132'
        case 'aguardando': return '#856404'
        case 'em andamento': return '#084298'
        case 'cancelado': return '#842029'
        default: return '#000'
      }
    }

    return { filtroStatus, pesquisa, filtrados, statusClass, statusIcon, statusIconColor, profileMenuOpen, toggleProfileMenu, closeProfileMenu, goToPerfil, goToLogin, goToChamadoDetalhado }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

/* RESET COMPLETO E FULLSCREEN */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
}

html, body, #app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* CONTAINER PRINCIPAL - FULLSCREEN */
.meus-chamados-page {
  display: flex;
  height: 100vh;
  width: 100vw;
  min-height: 100vh;
  min-width: 100vw;
  overflow: hidden;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* SIDEBAR - FIXA E FULL HEIGHT */
.sidebar {
  width: 250px;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  flex-shrink: 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  overflow-y: auto;
}

/* Logo - DIMENSÕES AUMENTADAS */
.sidebar-logo {
  text-align: left;
  margin-bottom: 30px;
  padding: 0 10px;
}

.logo-image {
  width: 100%;
  max-width: 280px;
  height: 150px;
  object-fit: contain;
}

/* Navegação */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 15px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  background-color: #1a1a1a;
}

.material-icons {
  font-size: 20px;
  color: #fff;
}

/* Perfil */
.profile-container {
  position: relative;
  margin-top: auto;
  padding: 20px 10px 0 10px;
  overflow: visible;
}

.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px 15px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.sidebar-profile:hover {
  background-color: #1a1a1a;
}

.profile-image {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  flex-shrink: 0;
}

.profile-info {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  min-width: 0;
}

.profile-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-email {
  color: #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* DROPDOWN CORRIGIDO - COMPORTAMENTO CORRETO COMO NA IMAGEM */
.profile-dropdown-right {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: #1a1a1a;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  z-index: 1001;
  margin-bottom: 10px;
  border: 1px solid #333;
  min-width: 200px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  border-bottom: 1px solid #333;
  font-size: 14px;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #333;
}

.dropdown-item .material-icons {
  font-size: 18px;
  color: #fff;
}

/* Transição do dropdown - CORRIGIDA */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* CONTEÚDO PRINCIPAL - ALTURA OTIMIZADA */
.main-content {
  flex: 1;
  background-color: #fff;
  margin-left: 250px;
  width: calc(100vw - 250px);
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  height: auto;
  min-height: 100vh;
  overflow: hidden;
  padding: 0 40px;
}

/* Cabeçalho - MAIS ESPAÇAMENTO SUPERIOR */
.page-title {
  color: indigo;
  font-size: 28px;
  font-weight: bold;
  padding: 50px 0 25px 0;
  background-color: #fff;
  margin: 0;
  width: 100%;
  text-align: left;
}

/* Filtros - Container com borda cinza e box-shadow */
.filters {
  display: flex;
  gap: 15px;
  padding: 15px 20px;
  background-color: #fff;
  width: 100%;
  align-items: center;
  max-width: 100%;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-select,
.filter-search {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fff;
  color: #000;
  transition: border-color 0.2s;
  height: 40px;
}

.filter-select {
  min-width: 140px;
  max-width: 180px;
}

.filter-search {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
}

.filter-select:focus,
.filter-search:focus {
  outline: none;
  border-color: indigo;
}

/* Container da Tabela - ALTURA OTIMIZADA */
.table-container {
  height: auto;
  min-height: 400px;
  max-height: calc(100vh - 300px);
  padding: 0;
  overflow: auto;
  background-color: #fff;
  max-width: 100%;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

/* Tabela - Dimensões otimizadas */
.chamados-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  table-layout: fixed;
  min-width: 800px;
}

.chamados-table th,
.chamados-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  word-wrap: break-word;
  vertical-align: middle;
}

.chamados-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid #d0d0d0;
  font-size: 14px;
}

.chamados-table td {
  color: #333;
  font-size: 14px;
}

.chamados-table tr:last-child td {
  border-bottom: none;
}

/* Larguras específicas para cada coluna - Otimizadas */
.col-atualizado {
  width: 16%;
  min-width: 140px;
}

.col-id {
  width: 8%;
  min-width: 80px;
}

.col-titulo {
  width: 28%;
  min-width: 200px;
}

.col-tecnico {
  width: 24%;
  min-width: 180px;
}

.col-status {
  width: 14%;
  min-width: 140px;
}

.tecnico-info {
  display: flex;
  flex-direction: column;
}

.tecnico-email {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

/* Status com cores CORRETAS e ícones com SOMBREAMENTO */
.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 13px;
  white-space: nowrap;
}

.status-icon {
  font-size: 16px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* CORES DOS STATUS CORRIGIDAS - IGUAL À IMAGEM */
.status-concluido {
  background-color: #d1fae5;
  color: #065f46;
}

.status-aberto {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-aguardando {
  background-color: #fff3cd;
  color: #856404;
}

.status-andamento {
  background-color: #cfe2ff;
  color: #084298;
}

.status-cancelado {
  background-color: #f8d7da;
  color: #842029;
}

/* Linha clicável */
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.clickable-row:hover {
  background-color: #f8f9fa;
}

/* SCROLLBAR PERSONALIZADA */
.table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* RESPONSIVIDADE */
@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }
  
  .main-content {
    margin-left: 220px;
    width: calc(100vw - 220px);
  }
  
  .content-area {
    padding: 0 30px;
  }
  
  .logo-image {
    max-width: 240px;
    height: 130px;
  }
  
  .page-title {
    padding: 40px 0 20px 0;
  }
}

@media (max-width: 768px) {
  .meus-chamados-page {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  
  .main-content {
    width: 100%;
    margin-left: 0;
    height: auto;
    min-height: calc(100vh - 200px);
  }
  
  .content-area {
    height: auto;
    padding: 0 20px;
    min-height: auto;
  }
  
  .filters {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .filter-select,
  .filter-search {
    width: 100%;
    max-width: 100%;
  }
  
  .page-title {
    font-size: 24px;
    padding: 30px 0 15px 0;
  }
  
  .logo-image {
    max-width: 220px;
    height: 110px;
  }
  
  .table-container {
    max-height: none;
    min-height: 300px;
  }
  
  /* Ajuste do dropdown para mobile */
  .profile-dropdown-right {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0;
    min-width: 200px;
  }
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
  
  .logo-image {
    max-width: 300px;
    height: 160px;
  }
}
</style>