<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <img src="../../assets/images/logodeskops.png" alt="Logo DeskOps" class="logo-image" />
    </div>

    <nav class="sidebar-nav">
      <router-link to="/tecnico/chamados-lista" class="nav-link" active-class="active">
        <span class="material-icons">list </span>
        Lista de Chamados
      </router-link>
      <router-link to="/tecnico/chamados" class="nav-link" active-class="active">
        <span class="material-icons">view_list</span>
        Meus Chamados
      </router-link>
    </nav>

     <!-- Perfil -->
    <div class="profile-container" ref="profileContainer" @click.stop>
      <div class="sidebar-profile" @click="toggleProfileMenu">
        <div class="profile-image">
          <img
            v-if="usuario.foto"
            :src="usuario.foto"
            alt="Foto de perfil"
            class="user-photo"
          />
        </div>

        <div class="profile-info">
          <p class="profile-name">{{ usuario.name }}</p>
          <p class="profile-email">{{ usuario.email }}</p>
        </div>
      </div>

      <!-- Dropdown -->
      <transition name="slide-right">
        <div v-if="profileMenuOpen" class="profile-dropdown-right">
          <div class="dropdown-item" @click="goToPerfil">
            <span class="material-icons">person</span> Perfil
          </div>
          <div class="dropdown-item" @click="confirmLogout">
            <span class="material-icons">logout</span> Sair
          </div>
        </div>
      </transition>
    </div>

    <!-- Popup de Confirmação de Logout -->
    <div v-if="showLogoutPopup" class="popup-overlay" @click.self="closeLogoutPopup">
      <div class="popup-container">
        <div class="popup-header">
          <span class="material-icons popup-icon confirm">help</span>
          <h3 class="popup-title">Confirmar Saída</h3>
        </div>
        
        <div class="popup-content">
          <p class="popup-message">Tem certeza que deseja sair do sistema?</p>
        </div>

        <div class="popup-actions">
          <button 
            class="popup-btn popup-btn-cancel" 
            @click="closeLogoutPopup"
          >
            Cancelar
          </button>
          <button 
            class="popup-btn popup-btn-confirm confirm"
            @click="performLogout"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

export default defineComponent({
  name: 'TecnicoSidebar',
  setup() {
    const router = useRouter()
    const auth = useAuthStore()
    const profileMenuOpen = ref(false)
    const showLogoutPopup = ref(false)
    const defaultFoto = new URL('@/assets/images/default-avatar.png', import.meta.url).href

    // ✅ Computed protegido (evita erro se auth.user for undefined)
    const usuario = computed(() => {
      const user = auth.user
      if (!user) {
        return { name: 'Técnico', email: 'sem@email.com', foto: '' }
      }
      return {
        name: user.name || 'Técnico',
        email: user.email || 'sem@email.com',
        foto: user.foto_user || ''
      }
    })

    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value
    }

    const closeProfileMenu = () => {
      profileMenuOpen.value = false
    }

    const goToPerfil = () => {
      router.push('/tecnico/perfil')
      closeProfileMenu()
    }

    const confirmLogout = () => {
      closeProfileMenu()
      showLogoutPopup.value = true
    }

    const closeLogoutPopup = () => {
      showLogoutPopup.value = false
    }

    const performLogout = () => {
      auth.logout?.()
      router.push('/')
      closeLogoutPopup()
    }

    // Fechar menu ao clicar fora
    const handleClickOutside = (event: Event) => {
      const profileContainer = document.querySelector('.profile-container')
      if (profileContainer && !profileContainer.contains(event.target as Node)) {
        closeProfileMenu()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      profileMenuOpen,
      showLogoutPopup,
      toggleProfileMenu,
      closeProfileMenu,
      goToPerfil,
      confirmLogout,
      closeLogoutPopup,
      performLogout,
      usuario,
      defaultFoto
    }
  }
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
.user-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #93bfa7;
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

/* POPUP STYLES - MESMO ESTILO DAS OUTRAS PÁGINAS */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* Maior que o sidebar */
  animation: fadeIn 0.2s ease-out;
}

.popup-container {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.popup-icon {
  font-size: 28px;
  border-radius: 50%;
  padding: 4px;
}

.popup-icon.success {
  color: #065f46;
  background-color: #d1fae5;
}

.popup-icon.error {
  color: #842029;
  background-color: #f8d7da;
}

.popup-icon.confirm {
  color: #084298;
  background-color: #cfe2ff;
}

.popup-title {
  color: #000;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.popup-content {
  padding: 20px 24px;
}

.popup-message {
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  text-align: left;
}

.popup-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 24px 24px 24px;
  border-top: 1px solid #e0e0e0;
}

.popup-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
}

.popup-btn-cancel {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #d0d0d0;
}

.popup-btn-cancel:hover {
  background-color: #e9ecef;
}

.popup-btn-confirm {
  background-color: #000;
  color: #fff;
}

.popup-btn-confirm:hover {
  background-color: #333;
}

.popup-btn-confirm.success {
  background-color: #065f46;
}

.popup-btn-confirm.success:hover {
  background-color: #054c38;
}

.popup-btn-confirm.error {
  background-color: #842029;
}

.popup-btn-confirm.error:hover {
  background-color: #6a1a21;
}

.popup-btn-confirm.confirm {
  background-color: #084298;
}

.popup-btn-confirm.confirm:hover {
  background-color: #06357a;
}

/* ANIMATIONS */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
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

  .popup-container {
    width: 95%;
    margin: 20px;
  }

  .popup-actions {
    flex-direction: column;
  }

  .popup-btn {
    width: 100%;
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