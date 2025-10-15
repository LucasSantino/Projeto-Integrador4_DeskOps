<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <img src="../../assets/images/logodeskops.png" alt="Logo DeskOps" class="logo-image" />
    </div>

    <nav class="sidebar-nav">
      <router-link to="/adm/dashboard" class="nav-link" active-class="active">
        <span class="material-icons">dashboard</span>
        Dashboard
      </router-link>
      <router-link to="/adm/gestao-ambiente" class="nav-link" active-class="active">
        <span class="material-icons">business</span>
        Gestão de Ambientes
      </router-link>
      <router-link to="/adm/gestao-usuarios" class="nav-link" active-class="active">
        <span class="material-icons">people</span>
        Gestão de Usuários
      </router-link>
      <router-link to="/adm/gestao-chamado" class="nav-link" active-class="active">
        <span class="material-icons">list_alt</span>
        Gestão de Chamados
      </router-link>
      <router-link to="/adm/perfil" class="nav-link" active-class="active">
        <span class="material-icons">person</span>
        Perfil
      </router-link>
    </nav>

    <!-- Perfil -->
    <div class="profile-container" ref="profileContainer" @click.stop>
      <div class="sidebar-profile" @click="toggleProfileMenu">
        <div class="profile-image">👤</div>
        <div class="profile-info">
          <p class="profile-name">{{ usuario.nome }}</p>
          <p class="profile-email">{{ usuario.email }}</p>
        </div>
      </div>

      <!-- Dropdown corrigido -->
      <transition name="slide-right">
        <div v-if="profileMenuOpen" class="profile-dropdown-right">
          <div class="dropdown-item" @click="goToPerfil">
            <span class="material-icons">person</span> Perfil
          </div>
          <div class="dropdown-item" @click="goToLogin">
            <span class="material-icons">logout</span> Sair
          </div>
        </div>
      </transition>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AdmSidebar',
  props: {
    usuario: {
      type: Object,
      required: true
    }
  },
  setup() {
    const router = useRouter()
    const profileMenuOpen = ref(false)

    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value
    }

    const closeProfileMenu = () => {
      profileMenuOpen.value = false
    }

    const goToPerfil = () => {
      router.push('/adm/perfil')
      closeProfileMenu()
    }

    const goToLogin = () => {
      router.push('/')
      closeProfileMenu()
    }

    return {
      profileMenuOpen,
      toggleProfileMenu,
      closeProfileMenu,
      goToPerfil,
      goToLogin,
    }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

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

/* Perfil - ESPAÇAMENTO REDUZIDO */
.profile-container {
  position: relative;
  margin-top: auto;
  padding: 15px 10px 0 10px;
  overflow: visible;
}

.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.sidebar-profile:hover {
  background-color: #1a1a1a;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  flex-shrink: 0;
}

.profile-info {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  min-width: 0;
  gap: 2px;
}

.profile-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  margin: 0;
}

.profile-email {
  color: #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  margin: 0;
  font-size: 12px;
}

/* DROPDOWN CORRIGIDO - COMPORTAMENTO CORRETO */
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
  margin-bottom: 8px;
  border: 1px solid #333;
  min-width: 200px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  border-bottom: 1px solid #333;
  font-size: 13px;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #333;
}

.dropdown-item .material-icons {
  font-size: 16px;
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

/* RESPONSIVIDADE */
@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }
  
  .logo-image {
    max-width: 240px;
    height: 130px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
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
  .logo-image {
    max-width: 300px;
    height: 160px;
  }
}
</style>