<template>
  <div class="perfil-page">
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
            <p class="profile-name">{{ usuario.nome }}</p>
            <p class="profile-email">{{ usuario.email }}</p>
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

      <!-- Título -->
      <h1 class="page-title">Perfil do Usuário</h1>

      <div class="cards-container">
        <!-- Card do Perfil -->
        <div class="card-form">
          <div class="perfil-header">
            <img :src="usuario.foto || defaultFoto" alt="Foto do usuário" class="perfil-foto" />
            <h2 class="perfil-nome">{{ usuario.nome }}</h2>
          </div>

          <div class="info-section">
            <h3>Email</h3>
            <p class="info-text">{{ usuario.email }}</p>
          </div>

          <div class="info-section">
            <h3>Data de Nascimento</h3>
            <p class="info-text">{{ usuario.dataNascimento }}</p>
          </div>

          <div class="info-section">
            <h3>CPF</h3>
            <p class="info-text">{{ usuario.cpf }}</p>
          </div>

          <div class="info-section">
            <h3>Endereço</h3>
            <p class="info-text">{{ usuario.endereco }}</p>
          </div>

          <div class="info-section">
            <h3>Tipo de Usuário</h3>
            <p class="info-text">{{ usuario.tipoUsuario }}</p>
          </div>

          <div class="info-section">
            <h3>Senha</h3>
            <p class="info-text">********</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  name: 'Perfil',
  setup() {
    const profileMenuOpen = ref(false)
    const toggleProfileMenu = () => (profileMenuOpen.value = !profileMenuOpen.value)
    const profileContainer = ref<HTMLElement | null>(null)

    const usuario = ref({
      nome: 'Lucas Santino da Silva',
      email: 'lucas@email.com',
      dataNascimento: '01/01/1990',
      cpf: '123.456.789-00',
      endereco: 'Rua Exemplo, 123, São Paulo, SP',
      tipoUsuario: 'Cliente', // novo campo
      foto: '', 
    })

    const defaultFoto = new URL('../../assets/images/default-avatar.png', import.meta.url).href

    const handleClickOutside = (event: MouseEvent) => {
      if (profileContainer.value && !profileContainer.value.contains(event.target as Node)) {
        profileMenuOpen.value = false
      }
    }

    onMounted(() => document.addEventListener('click', handleClickOutside))

    return {
      usuario,
      defaultFoto,
      profileMenuOpen,
      toggleProfileMenu,
      profileContainer,
    }
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

.perfil-page {
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

.page-title {
  color: indigo;
  font-size: 28px;
  font-weight: bold;
  padding-left: 90px;
  margin-bottom: 24px;
}

.cards-container {
  display: flex;
  justify-content: center; /* centraliza apenas o card */
  width: 100%;
  padding-left: 0;
}

/* Card do Perfil */
.card-form {
  width: 480px; /* largura igual ao chamadoDetalhado */
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

/* Perfil Header */
.perfil-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
  text-align: left;
}

.perfil-foto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid indigo;
}

.perfil-nome {
  font-size: 22px;
  font-weight: bold;
  color: #000;
  text-align: left;
}

/* Informações */
.info-section {
  text-align: left;
}

.info-section h3 {
  color: #000;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
  text-align: left;
}

.info-text {
  color: #555;
  font-size: 14px;
  margin-bottom: 12px;
  text-align: left;
}
</style>
