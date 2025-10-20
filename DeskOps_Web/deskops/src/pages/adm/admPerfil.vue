<template>
  <div class="perfil-page">
    <!-- Sidebar do Admin -->
    <adm-sidebar :usuario="usuario" />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <!-- Botão Voltar -->
        <div class="back-container" @click="$router.push('/adm/dashboard')">
          <span class="material-icons back-icon">arrow_back</span>
          <span class="back-text">Voltar</span>
        </div>

        <!-- Título -->
        <h1 class="page-title">Perfil do Administrador</h1>

        <div class="cards-container">
          <!-- Card do Perfil -->
          <div class="card-form">
            <!-- Header com botão de editar -->
            <div class="card-header">
              <div class="header-actions">
                <button v-if="!editMode" class="edit-btn" @click="enterEditMode">
                  <span class="material-icons">edit</span>
                  Editar
                </button>
                <div v-else class="action-buttons">
                  <button class="cancel-btn" @click="cancelEdit">
                    Cancelar
                  </button>
                  <button class="save-btn" @click="saveChanges">
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>

            <!-- Conteúdo do formulário -->
            <div class="form-content">
              <!-- Foto e Nome -->
              <div class="form-section profile-section">
                <div class="profile-header">
                  <div class="foto-container">
                    <img :src="usuario.foto || defaultFoto" alt="Foto do administrador" class="perfil-foto" />
                    <button v-if="editMode" class="change-photo-btn" @click="changePhoto">
                      <span class="material-icons">photo_camera</span>
                    </button>
                  </div>
                  <div class="name-container">
                    <h3 class="section-title">Nome Completo</h3>
                    <p v-if="!editMode" class="info-text">{{ usuario.nome }}</p>
                    <input 
                      v-else
                      v-model="usuarioEditado.nome"
                      type="text"
                      class="form-input"
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                </div>
              </div>

              <!-- Linha divisória apenas acima do email -->
              <div class="divider-line"></div>

              <!-- Email -->
              <div class="form-section">
                <h3 class="section-title">Email</h3>
                <p v-if="!editMode" class="info-text">{{ usuario.email }}</p>
                <input 
                  v-else
                  v-model="usuarioEditado.email"
                  type="email"
                  class="form-input"
                  placeholder="Digite seu email"
                />
              </div>

              <!-- Demais campos sem linhas divisorias -->
              <div class="form-section">
                <h3 class="section-title">Data de Nascimento</h3>
                <p v-if="!editMode" class="info-text">{{ usuario.dataNascimento }}</p>
                <input 
                  v-else
                  v-model="usuarioEditado.dataNascimento"
                  type="text"
                  class="form-input"
                  placeholder="DD/MM/AAAA"
                />
              </div>

              <div class="form-section">
                <h3 class="section-title">CPF</h3>
                <p v-if="!editMode" class="info-text">{{ usuario.cpf }}</p>
                <input 
                  v-else
                  v-model="usuarioEditado.cpf"
                  type="text"
                  class="form-input"
                  placeholder="000.000.000-00"
                />
              </div>

              <div class="form-section">
                <h3 class="section-title">Endereço</h3>
                <p v-if="!editMode" class="info-text">{{ usuario.endereco }}</p>
                <textarea 
                  v-else
                  v-model="usuarioEditado.endereco"
                  class="form-textarea"
                  placeholder="Digite seu endereço completo"
                  rows="2"
                ></textarea>
              </div>

              <div class="form-section">
                <h3 class="section-title">Tipo de Usuário</h3>
                <p class="info-text">{{ usuario.tipoUsuario }}</p>
              </div>

              <div class="form-section">
                <h3 class="section-title">Senha</h3>
                <div class="password-section">
                  <p class="info-text">********</p>
                  <button v-if="editMode" class="change-password-btn" @click="changePassword">
                    <span class="material-icons">lock_reset</span>
                    Redefinir Senha
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AdmSidebar from '@/components/layouts/admSidebar.vue'

export default defineComponent({
  name: 'AdmPerfil',
  components: {
    AdmSidebar
  },
  setup() {
    const router = useRouter()
    const editMode = ref(false)

    const usuario = ref({
      nome: 'Administrador',
      email: 'admin@deskops.com',
      dataNascimento: '10/05/1980',
      cpf: '111.222.333-44',
      endereco: 'Av. Principal, 1000, São Paulo, SP',
      tipoUsuario: 'Administrador',
      foto: '', 
    })

    const usuarioEditado = reactive({ ...usuario.value })

    // Para desenvolvimento, usando um placeholder
    const defaultFoto = new URL('../../assets/images/default-avatar.png', import.meta.url).href

    const enterEditMode = () => {
      Object.assign(usuarioEditado, usuario.value)
      editMode.value = true
    }

    const cancelEdit = () => {
      editMode.value = false
      Object.assign(usuarioEditado, usuario.value)
    }

    const saveChanges = () => {
      Object.assign(usuario.value, usuarioEditado)
      editMode.value = false
      console.log('Dados salvos:', usuario.value)
      alert('Alterações salvas com sucesso!')
    }

    const changePhoto = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement
        if (target.files && target.files[0]) {
          const file = target.files[0]
          const reader = new FileReader()
          reader.onload = (e) => {
            usuarioEditado.foto = e.target?.result as string
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    }

    const changePassword = () => {
      const newPassword = prompt('Digite sua nova senha:')
      if (newPassword) {
        console.log('Nova senha definida')
        alert('Senha alterada com sucesso!')
      }
    }

    return {
      usuario,
      usuarioEditado,
      defaultFoto,
      editMode,
      enterEditMode,
      cancelEdit,
      saveChanges,
      changePhoto,
      changePassword,
    }
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
.perfil-page {
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

/* CONTEÚDO PRINCIPAL - LAYOUT FULLSCREEN */
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

/* CORREÇÃO: Material-icons no conteúdo principal devem herdar a cor do contexto */
.main-content .material-icons {
  color: inherit;
  font-size: inherit;
}

/* Cabeçalho - MAIS ESPAÇAMENTO SUPERIOR */
.back-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #000;
  padding: 50px 0 0 0;
  margin-bottom: 10px;
  width: 100%;
}

.back-icon {
  font-size: 22px;
  margin-right: 8px;
  color: #000;
}

.back-text {
  font-size: 16px;
  font-weight: 500;
}

.back-container:hover {
  color: #555;
}

.back-container:hover .back-icon {
  color: #555;
}

/* Título da página */
.page-title {
  color: indigo;
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 30px 0;
  width: 100%;
  text-align: left;
}

/* Container dos Cards - CENTRALIZADO */
.cards-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 40px;
}

/* Card do Perfil - ESTILO CONSISTENTE */
.card-form {
  width: 500px;
  background-color: #fff;
  padding: 0;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* Card Header - APENAS BOTÕES NO CANTO SUPERIOR DIREITO */
.card-header {
  padding: 20px 24px 0 24px;
  display: flex;
  justify-content: flex-end;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* Botões de ação - ESTILO CONSISTENTE */
.edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.edit-btn:hover {
  background-color: #333;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.cancel-btn, .save-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.cancel-btn {
  background-color: transparent;
  color: #666;
  border: 1px solid #d0d0d0;
}

.cancel-btn:hover {
  background-color: #f5f5f5;
}

.save-btn {
  background-color: #000;
  color: #fff;
}

.save-btn:hover {
  background-color: #333;
}

/* Conteúdo do formulário - SEM SCROLLBAR */
.form-content {
  flex: 1;
  padding: 0;
}

/* Seções do Formulário - SEM BORDAS */
.form-section {
  padding: 16px 24px;
}

.profile-section {
  padding: 0 24px 16px 24px;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.foto-container {
  position: relative;
  flex-shrink: 0;
}

.perfil-foto {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid indigo;
}

.change-photo-btn {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #000;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
}

.change-photo-btn:hover {
  background-color: #333;
}

.name-container {
  flex: 1;
}

.section-title {
  color: #000;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: left;
}

.info-text {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
  min-height: 20px;
}

/* Linha divisória apenas acima do email */
.divider-line {
  height: 1px;
  background-color: #e0e0e0;
  margin: 0 24px;
}

/* Campos de edição - ESTILO IDÊNTICO AO NOVO CHAMADO */
.form-input,
.form-textarea {
  width: 100%;
  padding: 8px 0;
  border: none;
  border-bottom: 1px solid #ccc;
  background-color: transparent;
  color: #333;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  text-align: left;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  border-bottom-color: #000;
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
  max-height: 120px;
}

/* Seção de senha */
.password-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.change-password-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: transparent;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.change-password-btn:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

/* RESPONSIVIDADE */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 220px;
    width: calc(100vw - 220px);
  }
  
  .content-area {
    padding: 0 30px;
  }
  
  .card-form {
    width: 100%;
    max-width: 500px;
  }
}

@media (max-width: 768px) {
  .perfil-page {
    flex-direction: column;
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
  
  .page-title {
    font-size: 24px;
    margin: 0 0 20px 0;
  }
  
  .card-form {
    width: 100%;
  }
  
  .card-header {
    padding: 15px 20px 0 20px;
  }
  
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 15px;
  }
  
  .name-container {
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .cancel-btn, .save-btn {
    width: 100%;
  }
  
  .password-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .back-container {
    padding: 30px 0 0 0;
  }
  
  .form-section {
    padding: 12px 20px;
  }
  
  .profile-section {
    padding: 0 20px 12px 20px;
  }
  
  .divider-line {
    margin: 0 20px;
  }
}

@media (max-width: 480px) {
  .content-area {
    padding: 0 15px;
  }
  
  .card-header {
    padding: 12px 15px 0 15px;
  }
  
  .form-section {
    padding: 10px 15px;
  }
  
  .profile-section {
    padding: 0 15px 10px 15px;
  }
  
  .divider-line {
    margin: 0 15px;
  }
  
  .action-buttons {
    gap: 8px;
  }
  
  .cancel-btn, .save-btn {
    padding: 10px 12px;
    font-size: 13px;
  }
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
}
</style>