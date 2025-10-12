<template>
  <div class="chamado-detalhado-page">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="../../assets/images/logodeskops.png" alt="Logo DeskOps" class="logo-image" />
      </div>

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

      <!-- Perfil -->
      <div class="profile-container" ref="profileContainer">
        <div class="sidebar-profile" @click="toggleProfileMenu">
          <div class="profile-image">👤</div>
          <div class="profile-info">
            <p class="profile-name">Lucas Santino</p>
            <p class="profile-email">lucas@email.com</p>
          </div>
        </div>

        <div v-if="profileMenuOpen" class="profile-dropdown-right">
          <div class="dropdown-item" @click="$router.push('/cliente/perfil')">
            <span class="material-icons">person</span> Perfil
          </div>
          <div class="dropdown-item" @click="$router.push('/')">
            <span class="material-icons">logout</span> Sair
          </div>
        </div>
      </div>
    </aside>

    <!-- Conteúdo principal -->
    <main class="main-content">
      <!-- Botão Voltar -->
      <div class="back-container" @click="$router.push('/cliente/meus-chamados')">
        <span class="material-icons back-icon">arrow_back</span>
        <span class="back-text">Voltar</span>
      </div>

      <!-- Título com botão Editar -->
      <div class="title-edit-container">
        <h1 class="page-title">Chamado Detalhado</h1>
        <button class="btn-editar" @click="$router.push('/cliente/editar-chamado')">
          <span class="material-icons">edit</span>
          Editar
        </button>
      </div>

      <div class="cards-container">
        <!-- Card do chamado -->
        <div class="card-form">
          <div class="header-info">
            <p class="chamado-id">#{{ chamado.id }}</p>
            <span :class="['status-badge', statusClass(chamado.status)]">
              <span class="material-icons status-icon">{{ statusIcon(chamado.status) }}</span>
              {{ chamado.status }}
            </span>
          </div>

          <h2 class="chamado-titulo">{{ chamado.titulo }}</h2>

          <div class="info-section">
            <h3>Descrição</h3>
            <p class="info-text">{{ chamado.descricao }}</p>
          </div>

          <div class="info-section">
            <h3>Categoria</h3>
            <p class="info-text">{{ chamado.categoria }}</p>
          </div>

          <div class="info-section">
            <h3>Imagem</h3>
            <div v-if="chamado.imagem">
              <img :src="chamado.imagem" alt="Imagem do chamado" class="chamado-imagem" />
            </div>
            <p v-else class="info-text">Nenhuma imagem adicionada</p>
          </div>

          <div class="date-info">
            <div class="date-container left">
              <h3 class="date-title">Criado em</h3>
              <p class="info-text date-text">{{ chamado.criadoEm }}</p>
            </div>
            <div class="date-container right">
              <h3 class="date-title">Atualizado em</h3>
              <p class="info-text date-text">{{ chamado.atualizadoEm }}</p>
            </div>
          </div>

          <div class="info-section">
            <h3>Criado por</h3>
            <p class="info-text">{{ chamado.criadoPor.nome }}</p>
            <p class="info-text">{{ chamado.criadoPor.email }}</p>
          </div>
        </div>

        <!-- Card do técnico -->
        <div class="card-summary">
          <h2 class="card-title">Técnico Responsável</h2>
          <p class="summary-item">Nome<br /><span class="summary-text tecnico-text">{{ tecnico.nome }}</span></p>
          <p class="summary-item">E-mail<br /><span class="summary-text tecnico-text">{{ tecnico.email }}</span></p>

          <!-- Botão Encerrar Chamado -->
          <button class="btn-encerrar" @click="encerrarChamado">Encerrar Chamado</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'ChamadoDetalhado',
  setup() {
    const profileMenuOpen = ref(false)
    const toggleProfileMenu = () => (profileMenuOpen.value = !profileMenuOpen.value)
    const profileContainer = ref<HTMLElement | null>(null)

    const chamado = ref({
      id: 1024,
      titulo: 'Erro ao acessar o painel administrativo',
      descricao:
        'Usuário relata que ao tentar acessar o painel, uma tela de erro 500 é exibida. Foi realizado teste em diferentes navegadores e o problema persiste.',
      categoria: 'Suporte Técnico',
      imagem: '', 
      status: 'Em Andamento',
      criadoEm: '10/10/2025 - 14:22',
      atualizadoEm: '11/10/2025 - 09:10',
      criadoPor: { nome: 'Lucas Santino', email: 'lucas@email.com' },
    })

    const tecnico = ref({
      nome: 'Carlos Almeida',
      email: 'carlos.almeida@deskops.com',
    })

    const statusClass = (status: string) => {
      const s = status.toLowerCase()
      if (s.includes('concl')) return 'status-concluido'
      if (s.includes('aberto')) return 'status-aberto'
      if (s.includes('aguard')) return 'status-aguardando'
      if (s.includes('andamento')) return 'status-andamento'
      if (s.includes('cancel')) return 'status-cancelado'
      return ''
    }

    const statusIcon = (status: string) => {
      const s = status.toLowerCase()
      if (s.includes('concl')) return 'check_circle'
      if (s.includes('aberto')) return 'radio_button_unchecked'
      if (s.includes('aguard')) return 'hourglass_top'
      if (s.includes('andamento')) return 'autorenew'
      if (s.includes('cancel')) return 'cancel'
      return 'info'
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileContainer.value && !profileContainer.value.contains(event.target as Node)) {
        profileMenuOpen.value = false
      }
    }

    onMounted(() => document.addEventListener('click', handleClickOutside))

    const encerrarChamado = () => {
      alert('Chamado encerrado com sucesso!')
    }

    return { chamado, tecnico, profileMenuOpen, toggleProfileMenu, profileContainer, statusClass, statusIcon, encerrarChamado }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
}

.chamado-detalhado-page {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px 10px;
}

.sidebar-logo {
  text-align: left;
  margin-bottom: 24px;
}

.logo-image {
  width: 250px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 16px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 4px;
}

.nav-link:hover,
.nav-link.active {
  background-color: #1a1a1a;
}

.material-icons {
  font-size: 20px;
  color: #fff;
}

.profile-container {
  position: relative;
  margin-top: 520px;
}

.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
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
}

.profile-info {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.profile-name {
  font-weight: bold;
}

.profile-email {
  color: #ccc;
}

.profile-dropdown-right {
  position: absolute;
  top: 0;
  left: 260px;
  background-color: #1a1a1a;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.3);
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #333;
}

/* Conteúdo principal */
.main-content {
  flex: 1;
  background-color: #fff;
  padding: 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.back-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #000;
  padding-left: 90px;
  margin-top: 12px;
}

.back-icon {
  font-size: 22px;
  margin-right: 4px;
  color: #000;
}

/* Título + botão Editar */
.title-edit-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-left: 90px;
}

.page-title {
  color: indigo;
  font-size: 28px;
  font-weight: bold;
}

.btn-editar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  background-color: transparent;
  color: indigo;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
}

.btn-editar .material-icons {
  font-size: 20px;
  vertical-align: middle;
  color: indigo;
}

.btn-editar:hover {
  color: indigo;
}

.cards-container {
  display: flex;
  gap: 24px;
  width: calc(100% - 250px - 180px);
  padding-left: 90px;
  align-items: flex-start;
}

.card-form {
  flex: 2;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chamado-id {
  font-weight: bold;
  color: #000;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
}

.status-badge.status-concluido { background-color: #d1fae5; color: #065f46; }
.status-badge.status-aberto { background-color: #d1e7dd; color: #0f5132; }
.status-badge.status-aguardando { background-color: #fff3cd; color: #856404; }
.status-badge.status-andamento { background-color: #cfe2ff; color: #084298; }
.status-badge.status-cancelado { background-color: #f8d7da; color: #842029; }

.status-icon { font-size: 18px; }

.chamado-titulo {
  font-size: 18px;
  font-weight: bold;
  color: #000;
  text-align: left;
}

.info-section {
  text-align: left;
}

.info-section h3,
.date-title {
  color: #000;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
}

.info-text,
.date-text {
  color: #555;
  font-size: 14px;
}

.date-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.date-container.left {
  text-align: left;
}

.date-container.right {
  text-align: right;
}

.chamado-imagem {
  margin-top: 8px;
  width: 100%;
  max-height: 320px;
  object-fit: contain;
  border-radius: 6px;
}

.card-summary {
  flex: 1;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 12px;
}

.card-title {
  color: #000;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 8px;
}

.summary-item {
  color: #888;
  font-size: 14px;
}

.summary-text {
  display: block;
  color: #000;
  margin-top: 4px;
  font-size: 14px;
}

.tecnico-text {
  color: #000;
}

.btn-encerrar {
  margin-top: 16px;
  padding: 12px 0;
  width: 100%;
  border: none;
  background-color: #000;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.btn-encerrar:hover {
  background-color: #333;
}
</style>
