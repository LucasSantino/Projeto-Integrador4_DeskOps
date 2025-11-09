<template>
  <div class="perfil-page">
    <!-- Sidebar do Admin -->
    <adm-sidebar />

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
          <div class="card-form">
            <!-- Header -->
            <div class="card-header">
              <div class="header-actions">
                <button v-if="!editMode" class="edit-btn" @click="enterEditMode">
                  <span class="material-icons">edit</span>
                  Editar
                </button>
                <div v-else class="action-buttons">
                  <button class="cancel-btn" @click="cancelEdit">Cancelar</button>
                  <button class="save-btn" @click="confirmSaveChanges" :disabled="isLoading">
                    {{ isLoading ? 'Salvando...' : 'Salvar Alterações' }}
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
                    <img :src="(editMode ? usuarioEditado.foto : usuario.foto) || defaultFoto" alt="Foto do administrador" class="perfil-foto"/>
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

    <!-- Popup de Confirmação -->
    <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
      <div class="popup-container">
        <div class="popup-header">
          <span class="material-icons popup-icon" :class="popupType">
            {{ popupIcon }}
          </span>
          <h3 class="popup-title">{{ popupTitle }}</h3>
        </div>
        
        <div class="popup-content">
          <p class="popup-message">{{ popupMessage }}</p>
          <!-- Input para nova senha -->
          <div v-if="popupType === 'password'" class="popup-input-container">
            <input
              type="password"
              v-model="novaSenha"
              placeholder="Digite a nova senha"
              class="popup-input"
            />
            <input
              type="password"
              v-model="confirmarSenha"
              placeholder="Confirme a nova senha"
              class="popup-input"
            />
          </div>
        </div>

        <div class="popup-actions">
          <button 
            v-if="popupType === 'confirm' || popupType === 'password'"
            class="popup-btn popup-btn-cancel" 
            @click="closePopup"
            :disabled="isLoading"
          >
            Cancelar
          </button>
          <button 
            class="popup-btn popup-btn-confirm" 
            :class="popupType"
            @click="handlePopupConfirm"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Processando...' : popupConfirmText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdmSidebar from '@/components/layouts/admSidebar.vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

export default defineComponent({
  name: 'AdmPerfil',
  components: { AdmSidebar },
  setup() {
    const router = useRouter()
    const auth = useAuthStore()
    const editMode = ref(false)
    const isLoading = ref(false)
    const loadingText = ref('Processando...')

    // Estados para o popup
    const showPopup = ref(false)
    const popupType = ref<'success' | 'error' | 'confirm' | 'password'>('confirm')
    const popupTitle = ref('')
    const popupMessage = ref('')
    const popupConfirmText = ref('')
    const popupAction = ref<(() => void) | null>(null)
    const novaSenha = ref('')
    const confirmarSenha = ref('')

    const usuario = ref({
      nome: '',
      email: '',
      cpf: '',
      dataNascimento: '',
      endereco: '',
      tipoUsuario: '',
      foto: '',
    })

    const usuarioEditado = ref({ ...usuario.value })
    const defaultFoto = new URL('../../assets/images/default-avatar.png', import.meta.url).href
    const selectedPhotoFile = ref<File | null>(null)

    // ✅ Carregar dados do administrador logado
    const carregarDadosUsuario = async () => {
      try {
        const token = auth.access
        if (!token) {
          console.warn('⚠️ Nenhum token encontrado. Redirecionando para login...')
          router.push('/')
          return
        }

        const response = await api.get('/me/', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data
        usuario.value = {
          nome: data.name,
          email: data.email,
          cpf: data.cpf || '---',
          dataNascimento: data.dt_nascimento || '---',
          endereco: data.endereco || '---',
          tipoUsuario: data.is_staff ? 'Administrador' : 'Usuário',
          foto: data.foto_user || '',
        }

        usuarioEditado.value = { ...usuario.value }
        console.log('👤 Dados do administrador carregados:', usuario.value)
      } catch (error: any) {
        console.error('❌ Erro ao carregar dados do administrador:', error.response?.data || error)
        if (error.response?.status === 401) {
          showCustomPopup('error', 'Sessão Expirada', 'Sua sessão expirou. Faça login novamente.', 'OK', () => {
            router.push('/')
          })
        }
      }
    }

    // 🚀 Carregar ao montar componente
    onMounted(() => {
      carregarDadosUsuario()
    })

    // Função para mostrar popup personalizado
    const showCustomPopup = (
      type: 'success' | 'error' | 'confirm' | 'password',
      title: string,
      message: string,
      confirmText: string,
      action?: () => void
    ) => {
      popupType.value = type
      popupTitle.value = title
      popupMessage.value = message
      popupConfirmText.value = confirmText
      popupAction.value = action || null
      
      // Resetar campos de senha quando abrir popup de senha
      if (type === 'password') {
        novaSenha.value = ''
        confirmarSenha.value = ''
      }
      
      showPopup.value = true
    }

    const closePopup = () => {
      showPopup.value = false
      popupAction.value = null
    }

    const handlePopupConfirm = () => {
      if (popupAction.value) {
        popupAction.value()
      }
      closePopup()
    }

    const popupIcon = computed(() => {
      switch (popupType.value) {
        case 'success': return 'check_circle'
        case 'error': return 'error'
        case 'confirm': return 'help'
        case 'password': return 'lock'
        default: return 'info'
      }
    })

    // 🟢 Entrar no modo de edição
    const enterEditMode = () => {
      usuarioEditado.value = { ...usuario.value }
      editMode.value = true
    }

    // 🟢 Cancelar edição
    const cancelEdit = () => {
      showCustomPopup(
        'confirm',
        'Cancelar Edição',
        'Tem certeza que deseja cancelar as alterações? Todas as modificações serão perdidas.',
        'Confirmar',
        () => {
          usuarioEditado.value = { ...usuario.value }
          editMode.value = false
        }
      )
    }

    // 🟢 Confirmar salvamento
    const confirmSaveChanges = () => {
      // Validações básicas
      if (!usuarioEditado.value.nome.trim()) {
        showCustomPopup('error', 'Campo obrigatório', 'Informe o nome completo.', 'OK')
        return
      }
      if (!usuarioEditado.value.email.trim()) {
        showCustomPopup('error', 'Campo obrigatório', 'Informe o email.', 'OK')
        return
      }

      showCustomPopup(
        'confirm',
        'Confirmar Alterações',
        'Tem certeza que deseja salvar as alterações do perfil?',
        'Salvar',
        saveChanges
      )
    }

    const saveChanges = async () => {
      try {
        const token = auth.access
        if (!token) {
          showCustomPopup('error', 'Erro de Sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
            router.push('/')
          })
          return
        }

        isLoading.value = true
        loadingText.value = 'Salvando alterações...'

        // 🔹 Criar o FormData para enviar texto + arquivo
        const formData = new FormData()
        formData.append('name', usuarioEditado.value.nome)
        formData.append('email', usuarioEditado.value.email)
        formData.append('cpf', usuarioEditado.value.cpf)
        formData.append('dt_nascimento', usuarioEditado.value.dataNascimento)
        formData.append('endereco', usuarioEditado.value.endereco)

        if (selectedPhotoFile.value) {
          formData.append('foto_user', selectedPhotoFile.value)
        }

        const response = await api.patch('/me/', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })

        // Atualiza dados na tela
        usuario.value = {
          ...usuario.value,
          nome: response.data.name,
          email: response.data.email,
          cpf: response.data.cpf,
          dataNascimento: response.data.dt_nascimento,
          endereco: response.data.endereco,
          foto: response.data.foto_user || usuarioEditado.value.foto,
        }

        editMode.value = false
        selectedPhotoFile.value = null
        
        showCustomPopup(
          'success',
          'Sucesso!',
          'Alterações salvas com sucesso!',
          'OK'
        )
      } catch (error: any) {
        console.error('❌ Erro ao salvar alterações:', error.response?.data || error)
        
        let errorMessage = 'Erro ao salvar alterações. Verifique os campos e tente novamente.'
        if (error.response?.data) {
          if (typeof error.response.data === 'object') {
            errorMessage = Object.values(error.response.data).flat().join('\n')
          } else {
            errorMessage = error.response.data
          }
        }

        showCustomPopup('error', 'Erro', errorMessage, 'OK')
      } finally {
        isLoading.value = false
      }
    }

    const changePhoto = () => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement
        if (target.files && target.files[0]) {
          const file = target.files[0]
          selectedPhotoFile.value = file

          // Exibe prévia da imagem
          const reader = new FileReader()
          reader.onload = (e) => {
            usuarioEditado.value.foto = e.target?.result as string
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    }

    // 🟢 Alterar senha
    const changePassword = () => {
      showCustomPopup(
        'password',
        'Alterar Senha',
        'Digite sua nova senha:',
        'Alterar Senha',
        performPasswordChange
      )
    }

    const performPasswordChange = async () => {
      if (!novaSenha.value.trim()) {
        showCustomPopup('error', 'Campo obrigatório', 'Informe a nova senha.', 'OK')
        return
      }
      if (!confirmarSenha.value.trim()) {
        showCustomPopup('error', 'Campo obrigatório', 'Confirme a nova senha.', 'OK')
        return
      }
      if (novaSenha.value !== confirmarSenha.value) {
        showCustomPopup('error', 'Senhas não conferem', 'As senhas digitadas não são iguais.', 'OK')
        return
      }
      if (novaSenha.value.length < 6) {
        showCustomPopup('error', 'Senha muito curta', 'A senha deve ter pelo menos 6 caracteres.', 'OK')
        return
      }

      isLoading.value = true
      loadingText.value = 'Alterando senha...'

      try {
        const token = auth.access
        if (!token) {
          showCustomPopup('error', 'Erro de Sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
            router.push('/')
          })
          return
        }

        // Simulação de alteração de senha - substitua pela sua API real
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        showCustomPopup(
          'success',
          'Sucesso!',
          'Senha alterada com sucesso!',
          'OK'
        )
      } catch (error: any) {
        console.error('❌ Erro ao alterar senha:', error)
        showCustomPopup('error', 'Erro', 'Erro ao alterar senha. Tente novamente.', 'OK')
      } finally {
        isLoading.value = false
      }
    }

    return {
      usuario,
      usuarioEditado,
      editMode,
      defaultFoto,
      isLoading,
      showPopup,
      popupType,
      popupTitle,
      popupMessage,
      popupConfirmText,
      popupIcon,
      loadingText,
      novaSenha,
      confirmarSenha,
      enterEditMode,
      cancelEdit,
      confirmSaveChanges,
      saveChanges,
      changePhoto,
      changePassword,
      closePopup,
      handlePopupConfirm,
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

.save-btn:hover:not(:disabled) {
  background-color: #333;
}

.save-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.7;
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
  z-index: 1000;
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

.popup-icon.password {
  color: #7b1fa2;
  background-color: #f3e5f5;
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
  margin: 0 0 15px 0;
  text-align: left;
}

.popup-input-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popup-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.popup-input:focus {
  border-color: #000;
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

.popup-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.popup-btn-cancel {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #d0d0d0;
}

.popup-btn-cancel:hover:not(:disabled) {
  background-color: #e9ecef;
}

.popup-btn-confirm {
  background-color: #000;
  color: #fff;
}

.popup-btn-confirm:hover:not(:disabled) {
  background-color: #333;
}

.popup-btn-confirm.success {
  background-color: #065f46;
}

.popup-btn-confirm.success:hover:not(:disabled) {
  background-color: #054c38;
}

.popup-btn-confirm.error {
  background-color: #842029;
}

.popup-btn-confirm.error:hover:not(:disabled) {
  background-color: #6a1a21;
}

.popup-btn-confirm.password {
  background-color: #7b1fa2;
}

.popup-btn-confirm.password:hover:not(:disabled) {
  background-color: #6a1b7a;
}

/* LOADING OVERLAY */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  animation: fadeIn 0.2s ease-out;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  color: #333;
  font-size: 14px;
  font-weight: 500;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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