<template>
  <div class="detalhes-ativo-page" @click="closeProfileMenu">
    <adm-sidebar />

    <main class="main-content">
      <div class="content-area">
        <div class="back-container" @click="$router.push('/adm/gestao-ativos')">
          <span class="material-icons back-icon">arrow_back</span>
          <span class="back-text">Voltar</span>
        </div>

        <div class="title-container">
          <h1 class="page-title">Detalhes do Ativo</h1>
          <div class="action-buttons-header">
            <button v-if="!editando && ativo" class="btn-editar" @click.stop="iniciarEdicao">
              <span class="material-icons">edit</span>
              Editar Ativo
            </button>
            <button v-if="ativo" class="btn-excluir" @click.stop="confirmarExclusao">
              <span class="material-icons">delete</span>
              Excluir Ativo
            </button>
          </div>
        </div>

        <!-- Estado de carregamento -->
        <div v-if="carregando" class="loading">
          <p>Carregando ativo...</p>
        </div>

        <!-- Conteúdo principal quando o ativo estiver carregado -->
        <div v-else-if="ativo" class="cards-container">
          <!-- Card principal -->
          <div class="card-form">
            <!-- VISUALIZAÇÃO -->
            <div v-if="!editando" class="view-mode">
              <div class="header-info">
                <p class="ativo-id">#{{ ativo.id }}</p>
                <span :class="['status-badge', statusClass(ativo.status)]">
                  <span class="material-icons status-icon">{{ statusIcon(ativo.status) }}</span>
                  {{ formatarStatus(ativo.status) }}
                </span>
              </div>

              <h2 class="ativo-nome">{{ ativo.nome }}</h2>

              <div class="info-section">
                <h3>Descrição</h3>
                <p class="info-text">{{ ativo.descricao }}</p>
              </div>

              <div class="info-section">
                <h3>Ambiente</h3>
                <p class="info-text">{{ ativo.ambiente.nome }}</p>
                <p class="info-text">{{ ativo.ambiente.localizacao }}</p>
              </div>

              <div class="date-info">
                <div class="date-container left">
                  <h3 class="date-title">Criado em</h3>
                  <p class="info-text">{{ ativo.criadoEm }}</p>
                </div>
                <div class="date-container right">
                  <h3 class="date-title">Atualizado em</h3>
                  <p class="info-text">{{ ativo.atualizadoEm }}</p>
                </div>
              </div>
            </div>

            <!-- EDIÇÃO -->
            <div v-else class="edit-mode">
              <div class="form-section">
                <h3 class="section-title">Nome do Ativo</h3>
                <input type="text" v-model="formEdit.nome" class="form-input" />
              </div>

              <div class="form-section">
                <h3 class="section-title">Descrição</h3>
                <textarea v-model="formEdit.descricao" class="form-textarea" rows="4"></textarea>
              </div>

              <div class="form-section">
                <h3 class="section-title">Ambiente</h3>
                <select v-model="formEdit.ambiente.id" class="form-select">
                  <option value="" disabled>Selecione o ambiente</option>
                  <option v-for="amb in ambientes" :key="amb.id" :value="amb.id">
                    {{ amb.nome }}
                  </option>
                </select>
              </div>

              <div class="form-section">
                <h3 class="section-title">Status</h3>
                <select v-model="formEdit.status" class="form-select">
                  <option value="ATIVO">Ativo</option>
                  <option value="EM_MANUTENCAO">Em Manutenção</option>
                </select>
              </div>

              <div class="form-actions">
                <button class="btn-cancelar" @click="cancelarEdicao">
                  <span class="material-icons">close</span>
                  Cancelar
                </button>
                <button class="btn-salvar" @click="confirmarEdicao" :disabled="isLoading">
                  <span class="material-icons">save</span>
                  {{ isLoading ? 'Salvando...' : 'Salvar Alterações' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Card lateral -->
          <div class="card-summary">
            <h2 class="card-title">Ações</h2>
            <div class="action-buttons">
              <button class="btn-secondary" @click="alterarStatus" :disabled="editando || isLoading">
                <span class="material-icons">
                  {{ ativo.status === 'ATIVO' ? 'build' : 'check_circle' }}
                </span>
                {{ ativo.status === 'ATIVO' ? 'Colocar em Manutenção' : 'Ativar Ativo' }}
              </button>
            </div>

            <div class="info-rapida">
              <h3>Informações Rápidas</h3>
              <div class="info-item">
                <span class="info-label">Status:</span>
                <span :class="['info-value', statusClass(ativo.status)]">
                  {{ formatarStatus(ativo.status) }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">Ambiente:</span>
                <span class="info-value">{{ ativo.ambiente.nome }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Localização:</span>
                <span class="info-value">{{ ativo.ambiente.localizacao }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">QR Code:</span>
                <span class="info-value">{{ ativo.qrCode }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensagem quando o ativo não for encontrado -->
        <div v-else class="error-container">
          <p>Ativo não encontrado.</p>
          <button class="btn-voltar" @click="$router.push('/adm/gestao-ativos')">
            Voltar para Gestão de Ativos
          </button>
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
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdmSidebar from '@/components/layouts/admSidebar.vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

interface Ambiente {
  id: number
  nome: string
  localizacao: string
}

interface Ativo {
  id: number
  nome: string
  descricao: string
  ambiente: Ambiente
  status: string
  qrCode: string
  criadoEm: string
  atualizadoEm: string
}

export default defineComponent({
  name: 'DetalhesAtivo',
  components: { AdmSidebar },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const auth = useAuthStore()
    const token = auth.access

    const ativo = ref<Ativo | null>(null)
    const ambientes = ref<Ambiente[]>([])
    const carregando = ref(true)
    const editando = ref(false)
    const isLoading = ref(false)
    const loadingText = ref('Processando...')

    // Estados para o popup
    const showPopup = ref(false)
    const popupType = ref<'success' | 'error' | 'confirm'>('confirm')
    const popupTitle = ref('')
    const popupMessage = ref('')
    const popupConfirmText = ref('')
    const popupAction = ref<(() => void) | null>(null)

    const formEdit = reactive({
      nome: '',
      descricao: '',
      ambiente: { id: 0, nome: '', localizacao: '' },
      status: ''
    })

    const carregarAtivo = async () => {
      try {
        const id = route.params.id
        const response = await api.get(`/ativo/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data
        ativo.value = {
          id: data.id,
          nome: data.name,
          descricao: data.description || 'Sem descrição',
          status: data.status,
          qrCode: data.qr_code || '---',
          criadoEm: new Date(data.created_at).toLocaleString('pt-BR'),
          atualizadoEm: new Date(data.updated_at).toLocaleString('pt-BR'),
          ambiente: {
            id: data.environment_FK?.id || 0,
            nome: data.environment_FK?.name || 'Sem ambiente',
            localizacao: data.environment_FK?.description || '---'
          }
        }
        carregando.value = false
      } catch (error) {
        console.error('❌ Erro ao carregar ativo:', error)
        showCustomPopup('error', 'Erro', 'Erro ao carregar o ativo.', 'OK', () => {
          router.push('/adm/gestao-ativos')
        })
        carregando.value = false
      }
    }

    const carregarAmbientes = async () => {
      try {
        const response = await api.get('/environment/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        ambientes.value = response.data.results?.map((a: any) => ({
          id: a.id,
          nome: a.name,
          localizacao: a.description || '---',
        })) || []
      } catch (error) {
        console.error('❌ Erro ao carregar ambientes:', error)
      }
    }

    const iniciarEdicao = () => {
      if (!ativo.value) return
      formEdit.nome = ativo.value.nome
      formEdit.descricao = ativo.value.descricao
      formEdit.ambiente = { ...ativo.value.ambiente }
      formEdit.status = ativo.value.status
      editando.value = true
    }

    const cancelarEdicao = () => {
      editando.value = false
    }

    const confirmarEdicao = () => {
      if (!ativo.value) return

      // Validações básicas
      if (!formEdit.nome.trim()) {
        showCustomPopup('error', 'Campo obrigatório', 'Informe o nome do ativo.', 'OK')
        return
      }
      if (!formEdit.descricao.trim()) {
        showCustomPopup('error', 'Campo obrigatório', 'Informe a descrição do ativo.', 'OK')
        return
      }
      if (!formEdit.ambiente.id) {
        showCustomPopup('error', 'Campo obrigatório', 'Selecione um ambiente.', 'OK')
        return
      }

      showCustomPopup(
        'confirm',
        'Confirmar Edição',
        'Tem certeza que deseja salvar as alterações neste ativo?',
        'Salvar',
        salvarEdicao
      )
    }

    const salvarEdicao = async () => {
      if (!ativo.value) return

      isLoading.value = true
      loadingText.value = 'Salvando alterações...'

      try {
        const payload = {
          name: formEdit.nome.trim(),
          description: formEdit.descricao.trim(),
          environment_FK: Number(formEdit.ambiente.id),
          status: formEdit.status.toUpperCase()
        }

        const response = await api.patch(`/ativo/${ativo.value.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })

        // Atualiza o objeto ativo com os dados da resposta
        if (ativo.value) {
          ativo.value.nome = response.data.name
          ativo.value.descricao = response.data.description
          ativo.value.status = response.data.status
          ativo.value.atualizadoEm = new Date(response.data.updated_at).toLocaleString('pt-BR')
          
          // Atualiza o ambiente se necessário
          const ambienteEncontrado = ambientes.value.find(amb => amb.id === Number(formEdit.ambiente.id))
          if (ambienteEncontrado) {
            ativo.value.ambiente = { ...ambienteEncontrado }
          }
        }

        editando.value = false
        
        showCustomPopup(
          'success',
          'Sucesso!',
          'Ativo atualizado com sucesso!',
          'OK'
        )
      } catch (error: any) {
        console.error('❌ Erro ao atualizar ativo:', error.response?.data || error)
        
        let errorMessage = 'Erro desconhecido ao atualizar ativo.'
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

    const alterarStatus = async () => {
      if (!ativo.value) return
      
      const novoStatus = ativo.value.status === 'ATIVO' ? 'EM_MANUTENCAO' : 'ATIVO'
      const acao = novoStatus === 'EM_MANUTENCAO' ? 'colocar em manutenção' : 'reativar'
      
      showCustomPopup(
        'confirm',
        'Alterar Status',
        `Tem certeza que deseja ${acao} este ativo?`,
        'Confirmar',
        async () => {
          isLoading.value = true
          loadingText.value = 'Alterando status...'

          try {
            const response = await api.patch(`/ativo/${ativo.value!.id}/`, 
              { status: novoStatus }, 
              { headers: { Authorization: `Bearer ${token}` } }
            )
            
            if (ativo.value) {
              ativo.value.status = response.data.status
              ativo.value.atualizadoEm = new Date().toLocaleString('pt-BR')
            }
            
            showCustomPopup(
              'success',
              'Sucesso!',
              `Ativo ${novoStatus === 'EM_MANUTENCAO' ? 'colocado em manutenção' : 'reativado'} com sucesso!`,
              'OK'
            )
          } catch (error) {
            console.error('❌ Erro ao alterar status:', error)
            showCustomPopup('error', 'Erro', 'Erro ao alterar status do ativo.', 'OK')
          } finally {
            isLoading.value = false
          }
        }
      )
    }

    const confirmarExclusao = () => {
      if (!ativo.value) return
      
      showCustomPopup(
        'confirm',
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir este ativo? Esta ação não pode ser desfeita.',
        'Excluir',
        excluirAtivo
      )
    }

    const excluirAtivo = async () => {
      if (!ativo.value) return
      
      isLoading.value = true
      loadingText.value = 'Excluindo ativo...'

      try {
        await api.delete(`/ativo/${ativo.value.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        showCustomPopup(
          'success',
          'Sucesso!',
          'Ativo excluído com sucesso!',
          'OK',
          () => router.push('/adm/gestao-ativos')
        )
      } catch (error) {
        console.error('❌ Erro ao excluir ativo:', error)
        showCustomPopup('error', 'Erro', 'Erro ao excluir ativo.', 'OK')
      } finally {
        isLoading.value = false
      }
    }

    // Função para mostrar popup personalizado
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

    const statusClass = (status: string) => {
      return status === 'ATIVO' ? 'status-ativo' : 'status-manutencao'
    }

    const statusIcon = (status: string) => {
      return status === 'ATIVO' ? 'check_circle' : 'build'
    }

    const formatarStatus = (status: string) => {
      return status === 'ATIVO' ? 'Ativo' : 'Em Manutenção'
    }

    const closeProfileMenu = () => {}

    onMounted(() => {
      carregarAtivo()
      carregarAmbientes()
    })

    return {
      ativo,
      ambientes,
      carregando,
      editando,
      isLoading,
      formEdit,
      showPopup,
      popupType,
      popupTitle,
      popupMessage,
      popupConfirmText,
      popupIcon,
      loadingText,
      iniciarEdicao,
      cancelarEdicao,
      confirmarEdicao,
      salvarEdicao,
      alterarStatus,
      confirmarExclusao,
      excluirAtivo,
      statusClass,
      statusIcon,
      formatarStatus,
      closeProfileMenu,
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
.detalhes-ativo-page {
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

/* Título com botões de editar e excluir no canto direito */
.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
}

.page-title {
  color: indigo;
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

.action-buttons-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Botão Editar */
.btn-editar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid indigo;
  background-color: transparent;
  color: indigo;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-editar:hover {
  background-color: indigo;
  color: white;
}

.btn-editar .material-icons {
  font-size: 18px;
  color: inherit;
}

/* Botão Excluir */
.btn-excluir {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #dc2626;
  background-color: transparent;
  color: #dc2626;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-excluir:hover {
  background-color: #dc2626;
  color: white;
}

.btn-excluir .material-icons {
  font-size: 18px;
  color: inherit;
}

/* Container dos Cards - ALTURAS ORIGINAIS */
.cards-container {
  display: flex;
  gap: 30px;
  width: 100%;
  margin-bottom: 40px;
  align-items: flex-start;
}

/* Card do ativo - MAIOR (flex: 2) */
.card-form {
  flex: 2;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-height: 500px;
}

/* Card de ações - MENOR (flex: 1) */
.card-summary {
  flex: 1;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 24px;
  height: fit-content;
  min-height: 400px;
}

/* Header do Card */
.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.ativo-id {
  font-weight: bold;
  color: #000;
  font-size: 16px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.status-icon {
  font-size: 16px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* CORES DOS STATUS PARA ATIVOS */
.status-ativo {
  background-color: #d1fae5;
  color: #065f46;
}

.status-manutencao {
  background-color: #fff3cd;
  color: #856404;
}

.ativo-nome {
  font-size: 20px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
  text-align: left;
}

/* Seções de Informação - ESPAÇAMENTOS AUMENTADOS */
.info-section {
  text-align: left;
}

.info-section h3,
.date-title {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.info-text,
.date-text {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.date-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
  margin-top: auto;
  padding-top: 20px;
}

.date-container {
  flex: 1;
}

.date-container.left {
  text-align: left;
}

.date-container.right {
  text-align: right;
}

/* ESTILOS DO MODO EDIÇÃO - COM ESPAÇAMENTOS AUMENTADOS */

/* Seções do Formulário - ESPAÇAMENTOS AUMENTADOS */
.form-section {
  text-align: left;
  margin-bottom: 25px;
}

.form-section:last-of-type {
  margin-bottom: 0;
}

.section-title {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: left;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px 0;
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
  font-family: inherit;
  min-height: 120px;
  padding: 12px 0;
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

/* Ações do Formulário */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 30px;
}

.btn-cancelar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #6b7280;
  background-color: transparent;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-cancelar:hover {
  background-color: #6b7280;
  color: white;
}

.btn-salvar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #059669;
  background-color: transparent;
  color: #059669;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-salvar:hover:not(:disabled) {
  background-color: #059669;
  color: white;
}

.btn-salvar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancelar .material-icons,
.btn-salvar .material-icons {
  font-size: 18px;
  color: inherit;
}

/* Card Summary - Ações */
.card-title {
  color: #000;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 8px;
  width: 100%;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

/* BOTÕES CONSISTENTES COM O DESIGN DO PROJETO */
.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: center;
  background-color: #000000;
  color: #fffefe;
  border: 2px solid #ffffff;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #585858;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary .material-icons {
  font-size: 18px;
  color: white;
}

/* Informações Rápidas */
.info-rapida {
  width: 100%;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  margin-top: auto;
}

.info-rapida h3 {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.info-label {
  color: #666;
  font-size: 14px;
}

.info-value {
  color: #000;
  font-size: 14px;
  font-weight: 500;
}

/* Container de erro */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.error-container p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

.btn-voltar {
  padding: 12px 24px;
  background-color: indigo;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-voltar:hover {
  background-color: #4b0082;
}

/* POPUP STYLES - MESMO ESTILO DA PÁGINA NOVO_ATIVO */
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
  }
  
  .card-form,
  .card-summary {
    flex: none;
    width: 100%;
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .detalhes-ativo-page {
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
  }
  
  .title-container {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .action-buttons-header {
    width: 100%;
    justify-content: flex-start;
  }
  
  .btn-editar,
  .btn-excluir {
    align-self: flex-start;
  }
  
  .date-info {
    flex-direction: column;
    gap: 15px;
  }
  
  .date-container.right {
    text-align: left;
  }
  
  .back-container {
    padding: 30px 0 0 0;
  }
  
  .form-actions {
    flex-direction: column;
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
  .content-area {
    max-width: 1400px;
  }
}
</style>