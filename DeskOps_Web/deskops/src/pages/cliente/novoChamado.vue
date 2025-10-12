<template>
  <div class="novo-chamado-page">
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
      <div class="profile-container" ref="profileContainer">
        <div class="sidebar-profile" @click="toggleProfileMenu">
          <div class="profile-image">👤</div>
          <div class="profile-info">
            <p class="profile-name">Lucas Santino</p>
            <p class="profile-email">lucas@email.com</p>
          </div>
        </div>

        <!-- Dropdown à direita -->
        <div v-if="profileMenuOpen" class="profile-dropdown-right">
          <div class="dropdown-item" @click="$router.push('/cliente/perfil')">
            <span class="material-icons">person</span>
            Perfil
          </div>
          <div class="dropdown-item" @click="$router.push('/')">
            <span class="material-icons">logout</span>
            Sair
          </div>
        </div>
      </div>
    </aside>

    <!-- Conteúdo principal -->
    <main class="main-content">
      <h1 class="page-title">Novo Chamado</h1>

      <!-- Cards -->
      <div class="cards-container">
        <!-- Formulário -->
        <div class="card-form">
          <h2 class="card-title">Informações</h2>
          <p class="card-subtitle">Insira as informações abaixo para realizar o cadastro</p>

          <div class="form-group">
            <label for="titulo">Título</label>
            <input
              id="titulo"
              type="text"
              v-model="titulo"
              placeholder="Digite o título do chamado"
            />
          </div>

          <div class="form-group">
            <label for="descricao">Descrição</label>
            <textarea
              id="descricao"
              v-model="descricao"
              placeholder="Descreva o que está acontecendo"
              :maxlength="maxDescricaoChars"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="categoria">Categoria de Serviço</label>
            <select id="categoria" v-model="categoria">
              <option value="" disabled>Selecione a categoria de Serviço</option>
              <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="imagem">Anexar imagem</label>
            <input id="imagem" type="file" @change="onFileChange" />
          </div>
        </div>

        <!-- Card Resumo -->
        <div class="card-summary">
          <h2 class="card-title">Resumo</h2>
          <p class="summary-item">
            Título do chamado<br />
            <span class="summary-text">{{ titulo || 'Nenhum título' }}</span>
          </p>
          <p class="summary-item">
            Descrição<br />
            <span class="summary-text">{{ descricaoLimitada }}</span>
          </p>
          <p class="summary-item">
            Categoria do Serviço<br />
            <span class="summary-text">{{ categoria || 'Nenhuma selecionada' }}</span>
          </p>
          <p class="summary-item">
            Imagem<br />
            <span class="summary-text" v-if="!imagemURL">Nenhuma imagem selecionada</span>
            <img v-if="imagemURL" :src="imagemURL" alt="Imagem do chamado" class="summary-image" />
          </p>

          <button class="create-btn" @click="submitChamado">Criar Chamado</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'

export default defineComponent({
  name: 'NovoChamado',
  setup() {
    const titulo = ref('')
    const descricao = ref('')
    const categoria = ref('')
    const imagemURL = ref<string | null>(null)
    const profileMenuOpen = ref(false)
    const categorias = ref(['Manutenção', 'Suporte', 'Instalação'])
    const maxDescricaoChars = 2830

    const descricaoLimitada = computed(() => {
      if (!descricao.value) return 'Nenhuma descrição'
      return descricao.value.length > maxDescricaoChars
        ? descricao.value.substring(0, maxDescricaoChars) + '...'
        : descricao.value
    })

    const toggleProfileMenu = () => {
      profileMenuOpen.value = !profileMenuOpen.value
    }

    const submitChamado = () => {
      console.log({
        titulo: titulo.value,
        descricao: descricao.value,
        categoria: categoria.value,
        imagemURL: imagemURL.value,
      })
      alert('Chamado enviado com sucesso!')
      titulo.value = ''
      descricao.value = ''
      categoria.value = ''
      imagemURL.value = null
    }

    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files && target.files[0]) {
        imagemURL.value = URL.createObjectURL(target.files[0])
      } else {
        imagemURL.value = null
      }
    }

    const profileContainer = ref<HTMLElement | null>(null)
    const handleClickOutside = (event: MouseEvent) => {
      if (profileContainer.value && !profileContainer.value.contains(event.target as Node)) {
        profileMenuOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    return {
      titulo,
      descricao,
      categoria,
      imagemURL,
      categorias,
      profileMenuOpen,
      toggleProfileMenu,
      profileContainer,
      submitChamado,
      onFileChange,
      descricaoLimitada,
      maxDescricaoChars,
    }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
}

/* Layout principal */
.novo-chamado-page {
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
  padding: 20px 10px;
}

/* Logo */
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

/* Navegação */
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

/* Perfil */
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

/* Página título */
.page-title {
  color: indigo;
  font-size: 28px;
  font-weight: bold;
  margin: 32px 0 24px 0;
  padding-left: 90px;
}

/* Cards container */
.cards-container {
  display: flex;
  gap: 24px;
  width: calc(100% - 250px - 180px);
  padding-left: 90px;
  align-items: flex-start;
}

/* Card formulário */
.card-form {
  flex: 2;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Card resumo */
.card-summary {
  flex: 1;
  min-width: 250px;
  height: auto;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  text-align: left;
  flex-shrink: 0;
}

/* Imagem resumo */
.summary-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 6px;
  margin-top: 4px;
  object-fit: contain;
}

/* Titulos e textos */
.card-title {
  font-weight: bold;
  color: #000;
  margin-bottom: 4px;
  text-align: left;
}

.card-subtitle {
  color: #888;
  font-size: 14px;
  margin-bottom: 12px;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 100%;
}

.form-group label {
  font-weight: bold;
  color: #000;
  margin-bottom: 4px;
  text-align: left;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
  border: none;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  color: #000;
  outline: none;
}

.form-group select:hover {
  background-color: #f0f0f0;
}

textarea {
  resize: vertical;
  min-height: 160px;
}

/* Resumo */
.summary-item {
  color: #888;
  font-size: 14px;
  margin-bottom: 4px;
}

.summary-text {
  display: block;
  color: #888;
  margin-top: 2px;
  font-size: 14px;
}

/* Botão criar chamado */
.create-btn {
  margin-top: 16px;
  padding: 12px;
  width: 100%;
  background-color: #000;
  color: #fff;
  font-weight: bold;
  text-align: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background-color: #333;
}
</style>
