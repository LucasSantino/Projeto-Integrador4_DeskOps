<template>
  <div class="novo-chamado-page" @click="closeProfileMenu">
    <!-- Sidebar do Cliente -->
   <cliente-sidebar />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <h1 class="page-title">Novo Chamado</h1>

        <div class="cards-container">
          <!-- Formulário -->
          <div class="card-form">
            <div class="card-header">
              <h2 class="card-title">Informações</h2>
              <p class="card-subtitle">Preencha as informações para criar um novo chamado</p>
            </div>

            <div class="form-section">
              <h3 class="section-title">Título</h3>
              <input
                type="text"
                v-model="titulo"
                placeholder="Digite o título do chamado"
                class="form-input"
              />
            </div>

            <div class="form-section">
              <h3 class="section-title">Descrição</h3>
              <textarea
                v-model="descricao"
                placeholder="Descreva o problema"
                :maxlength="maxDescricaoChars"
                class="form-textarea"
              ></textarea>
              <div class="char-counter">
                {{ descricao.length }}/{{ maxDescricaoChars }} caracteres
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Ativo</h3>
              <select v-model="ativoSelecionado" class="form-select">
                <option value="" disabled>Selecione um ativo</option>
                <option v-for="a in ativos" :key="a.id" :value="a.id">
                  {{ a.name || a.nome || `Ativo #${a.id}` }}
                </option>
              </select>
            </div>

            <div class="form-section">
              <h3 class="section-title">Ambiente</h3>
              <select v-model="ambienteSelecionado" class="form-select">
                <option value="" disabled>Selecione um ambiente</option>
                <option v-for="amb in ambientes" :key="amb.id" :value="amb.id">
                  {{ amb.nome || amb.name || `Ambiente #${amb.id}` }}
                </option>
              </select>
            </div>

            <div class="form-section">
              <h3 class="section-title">Prioridade</h3>
              <select v-model="prioridade" class="form-select">
                <option value="" disabled>Selecione a prioridade</option>
                <option v-for="p in prioridades" :key="p.value" :value="p.value">{{ p.label }}</option>
              </select>
            </div>

            <div class="form-section file-section">
              <h3 class="section-title">Anexar imagem</h3>
              <div class="file-upload">
                <label class="file-label">
                  <input type="file" @change="onFileChange" class="file-input" />
                  <span class="file-button">Escolher arquivo</span>
                  <span class="file-text">Nenhum arquivo escolhido</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Resumo -->
          <div class="card-summary">
            <h2 class="summary-title">Resumo</h2>

            <div class="summary-section">
              <p class="summary-label">Título</p>
              <p class="summary-value">{{ titulo || 'Nenhum título' }}</p>
            </div>

            <div class="summary-section">
              <p class="summary-label">Descrição</p>
              <p class="summary-value">{{ descricao || 'Nenhuma descrição' }}</p>
            </div>

            <div class="summary-section">
              <p class="summary-label">Ativo</p>
              <p class="summary-value">{{ obterNomeAtivo(ativoSelecionado) || 'Nenhum selecionado' }}</p>
            </div>

            <div class="summary-section">
              <p class="summary-label">Ambiente</p>
              <p class="summary-value">{{ obterNomeAmbiente(ambienteSelecionado) || 'Nenhum selecionado' }}</p>
            </div>

            <div class="summary-section">
              <p class="summary-label">Prioridade</p>
              <p class="summary-value">
                <span v-if="prioridade" :class="['prioridade-badge', prioridadeClass(prioridade)]">
                  <span class="material-icons prioridade-icon">{{ prioridadeIcon(prioridade) }}</span>
                  {{ formatarPrioridade(prioridade) }}
                </span>
                <span v-else>Nenhuma selecionada</span>
              </p>
            </div>

            <div class="summary-section">
              <p class="summary-label">Imagem</p>
              <p class="summary-value">
                <img v-if="imagemURL" :src="imagemURL" alt="Imagem" style="max-width: 100px; max-height: 100px;">
                <span v-else>Nenhuma imagem</span>
              </p>
            </div>

            <div class="create-btn-container">
              <button class="create-btn" @click="confirmarCriacao" :disabled="isLoading">
                {{ isLoading ? 'Criando...' : 'Criar Chamado' }}
              </button>
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
        </div>

        <div class="popup-actions">
          <button 
            v-if="popupType === 'confirm'"
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
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ClienteSidebar from '@/components/layouts/clienteSidebar.vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

// Interfaces para tipagem
interface Ativo {
  id: string;
  name?: string;
  nome?: string;
}

interface Ambiente {
  id: string;
  name?: string;
  nome?: string;
}

interface Prioridade {
  value: string;
  label: string;
}

export default defineComponent({
  name: 'NovoChamado',
  components: { ClienteSidebar },

  setup() {
    const router = useRouter()
    const auth = useAuthStore()

    // 🔹 Campos do formulário
    const titulo = ref('')
    const descricao = ref('')
    const prioridade = ref('')
    const ativos = ref<Ativo[]>([])                
    const ativoSelecionado = ref('') 
    const ambientes = ref<Ambiente[]>([])              
    const ambienteSelecionado = ref('')
    const imagemURL = ref<string | null>(null)
    const imagem = ref<File | null>(null)
    const isLoading = ref(false)
    const loadingText = ref('Processando...')

    // 🔹 Estados para o popup
    const showPopup = ref(false)
    const popupType = ref<'success' | 'error' | 'confirm'>('confirm')
    const popupTitle = ref('')
    const popupMessage = ref('')
    const popupConfirmText = ref('')
    const popupAction = ref<(() => void) | null>(null)

    // 🔹 Opções fixas
    const prioridades = ref<Prioridade[]>([
      { value: 'alta', label: 'Alta' },
      { value: 'media', label: 'Média' },
      { value: 'baixa', label: 'Baixa' },
    ])
    const maxDescricaoChars = 2830

    const carregarAtivos = async () => {
      try {
        const token = auth.access
        const response = await api.get('/ativo/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        ativos.value = response.data.results || response.data
      } catch (error: any) {
        console.error('❌ Erro ao carregar ativos:', error.response?.data || error)
      }
    }

   const carregarAmbientes = async () => {
    const token = localStorage.getItem('access')
    const response = await api.get('/environment/', { headers: { Authorization: `Bearer ${token}` } })
    ambientes.value = response.data.results || response.data
  }


    // ✅ Função para mostrar popup personalizado
    const showCustomPopup = (
      type: 'success' | 'error' | 'confirm',
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
        default: return 'info'
      }
    })

    // ✅ Obter nome do ativo para exibição no resumo
    const obterNomeAtivo = (ativoId: string) => {
      const ativo = ativos.value.find((a: Ativo) => a.id === ativoId)
      return ativo ? (ativo.name || ativo.nome || `Ativo #${ativo.id}`) : ''
    }

    // ✅ Obter nome do ambiente para exibição no resumo
    const obterNomeAmbiente = (ambienteId: string) => {
      const ambiente = ambientes.value.find((a: Ambiente) => a.id === ambienteId)
      return ambiente ? (ambiente.nome || ambiente.name || `Ambiente #${ambiente.id}`) : ''
    }

    // ✅ Confirmar criação do chamado
    const confirmarCriacao = () => {
      // Validações básicas
      if (!titulo.value.trim()) {
        showCustomPopup('error', 'Campo obrigatório', 'Informe o título do chamado.', 'OK')
        return
      }
      if (!descricao.value.trim()) {
        showCustomPopup('error', 'Campo obrigatório', 'Informe a descrição do problema.', 'OK')
        return
      }
      if (!ativoSelecionado.value) {
        showCustomPopup('error', 'Campo obrigatório', 'Selecione um ativo.', 'OK')
        return
      }
      if (!ambienteSelecionado.value) {
        showCustomPopup('error', 'Campo obrigatório', 'Selecione um ambiente.', 'OK')
        return
      }
      if (!prioridade.value) {
        showCustomPopup('error', 'Campo obrigatório', 'Selecione a prioridade.', 'OK')
        return
      }

      showCustomPopup(
        'confirm',
        'Confirmar Criação',
        'Tem certeza que deseja criar este chamado? Esta ação não pode ser desfeita.',
        'Criar Chamado',
        submitChamado
      )
    }

    // ✅ Criação de um novo chamado
    const submitChamado = async () => {
      try {
        const token = auth.access
        if (!token) {
          showCustomPopup('error', 'Erro de Sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
            router.push('/')
          })
          return
        }

        isLoading.value = true
        loadingText.value = 'Criando chamado...'

        const formData = new FormData()
        formData.append('title', titulo.value)
        formData.append('description', descricao.value)
        formData.append('prioridade', prioridade.value.toUpperCase())
        formData.append('status', 'AGUARDANDO_ATENDIMENTO')
        formData.append('asset', ativoSelecionado.value)
        formData.append('environment_id', ambienteSelecionado.value)

        if (imagem.value) {
          formData.append('photo', imagem.value)
        }

        const response = await api.post('/chamados/', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })

        console.log('✅ Chamado criado:', response.data)
        
        showCustomPopup(
          'success',
          'Sucesso!',
          'Chamado criado com sucesso! Você será redirecionado para a lista de chamados.',
          'OK',
          () => {
            router.push('/cliente/meus-chamados')
          }
        )
      } catch (error: any) {
        console.error('❌ Erro ao criar chamado:', error.response?.data || error)
        
        let errorMessage = 'Erro ao criar chamado. Verifique os campos e tente novamente.'
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

    // ✅ Manipulação da imagem selecionada
    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files && target.files[0]) {
        imagem.value = target.files[0]
        imagemURL.value = URL.createObjectURL(target.files[0])
        const fileText = document.querySelector('.file-text')
        if (fileText) fileText.textContent = target.files[0].name
      } else {
        imagem.value = null
        imagemURL.value = null
        const fileText = document.querySelector('.file-text')
        if (fileText) fileText.textContent = 'Nenhum arquivo escolhido'
      }
    }

    // ✅ Estilos e ícones de prioridade
    const prioridadeClass = (p: string) => {
      switch (p.toLowerCase()) {
        case 'alta': return 'prioridade-alta'
        case 'media': return 'prioridade-media'
        case 'baixa': return 'prioridade-baixa'
        default: return ''
      }
    }

    const prioridadeIcon = (p: string) => {
      switch (p.toLowerCase()) {
        case 'alta': return 'arrow_upward'
        case 'media': return 'remove'
        case 'baixa': return 'arrow_downward'
        default: return ''
      }
    }

    const formatarPrioridade = (p: string) => {
      switch (p.toLowerCase()) {
        case 'alta': return 'Alta'
        case 'media': return 'Média'
        case 'baixa': return 'Baixa'
        default: return p
      }
    }

    const closeProfileMenu = () => {
  // Fecha o menu de perfil
}

    carregarAtivos()
    carregarAmbientes()

    return {
      titulo,
      descricao,
      prioridade,
      imagemURL,
      prioridades,
      isLoading,
      showPopup,
      popupType,
      popupTitle,
      popupMessage,
      popupConfirmText,
      popupIcon,
      loadingText,
      confirmarCriacao,
      submitChamado,
      onFileChange,
      maxDescricaoChars,
      prioridadeClass,
      prioridadeIcon,
      formatarPrioridade,
      ativos,
      ativoSelecionado,
      ambientes,
      ambienteSelecionado,
      obterNomeAtivo,
      obterNomeAmbiente,
      closePopup,
      handlePopupConfirm,
      closeProfileMenu 
    }
  },
})
</script>

<style scoped>
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
.novo-chamado-page {
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

/* Título da página */
.page-title {
  color: indigo;
  font-size: 28px;
  font-weight: bold;
  padding: 40px 0 20px 0;
  margin: 0;
  width: 100%;
  text-align: left;
}

/* Container dos Cards */
.cards-container {
  display: flex;
  gap: 30px;
  width: 100%;
  margin-bottom: 30px;
  max-height: calc(100vh - 180px);
  overflow: hidden;
}

/* Card do Formulário - ESTILO IDÊNTICO À PÁGINA DE EDIÇÃO */
.card-form {
  flex: 2;
  background-color: #fff;
  padding: 0;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
}

.card-header {
  padding: 20px 24px;
}

.card-title {
  color: #000;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
  text-align: left;
}

.card-subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
  text-align: left;
}

/* Seções do Formulário */
.form-section {
  padding: 16px 24px;
}

.section-title {
  color: #000;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  text-align: left;
}

.form-input,
.form-textarea,
.form-select {
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
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-bottom-color: #000;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  max-height: 150px;
  font-family: inherit;
}

.form-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23333' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 8px 10px;
  appearance: none;
  padding-right: 20px;
}

.char-counter {
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: 6px;
}

/* Upload de Arquivo */
.file-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.file-input {
  display: none;
}

.file-button {
  padding: 8px 16px;
  background-color: #555;
  border: none;
  border-bottom: 1px solid #ccc;
  border-radius: 0;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
}

.file-button:hover {
  background-color: #666;
}

.file-text {
  font-size: 14px;
  color: #666;
}

/* Card Resumo */
.card-summary {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: fit-content;
  min-width: 300px;
  max-height: 100%;
}

.summary-title {
  color: #000;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}

.summary-section {
  margin-bottom: 14px;
}

.summary-section:last-of-type {
  margin-bottom: 20px;
}

.summary-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
  text-align: left;
}

.summary-value {
  color: #000;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  text-align: left;
}

/* Badge de Prioridade no Resumo */
.prioridade-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.prioridade-icon {
  font-size: 16px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* CORES DAS PRIORIDADES */
.prioridade-alta {
  background-color: #f8d7da;
  color: #842029;
}

.prioridade-media {
  background-color: #fff3cd;
  color: #856404;
}

.prioridade-baixa {
  background-color: #d1fae5;
  color: #065f46;
}

/* Container do Botão Criar */
.create-btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  padding: 0 20px;
}

.create-btn {
  padding: 12px 60px;
  border: none;
  background-color: #000;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 300px;
}

.create-btn:hover:not(:disabled) {
  background-color: #333;
}

.create-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.7;
}

/* POPUP STYLES */
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
  
  .cards-container {
    flex-direction: column;
    max-height: none;
  }
  
  .card-form,
  .card-summary {
    flex: none;
    width: 100%;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .novo-chamado-page {
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
    padding: 30px 0 15px 0;
  }
  
  .cards-container {
    gap: 20px;
    max-height: none;
  }
  
  .card-form,
  .card-summary {
    padding: 0;
    max-height: none;
  }
  
  .form-textarea {
    min-height: 120px;
    max-height: 200px;
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

@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
}
</style>