<template>
  <div class="gestao-usuarios-page" @click="closeProfileMenu">
    <!-- Sidebar do Admin -->
    <adm-sidebar />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <h1 class="page-title">Gestão de Usuários</h1>

        <!-- Filtros -->
        <div class="filters">
          <select v-model="filtroNivel" class="filter-select">
            <option value="todos">Todos os Níveis</option>
            <option value="usuario">Usuário</option>
            <option value="tecnico">Técnico</option>
            <option value="admin">Administrador</option>
          </select>

          <select v-model="filtroStatus" class="filter-select">
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>

          <select v-model="ordemExibicao" class="filter-select">
            <option value="recente">Mais recente</option>
            <option value="antigo">Mais antigo</option>
          </select>

          <input
            type="text"
            v-model="pesquisa"
            placeholder="Pesquisar por nome ou email"
            class="filter-search"
          />
        </div>

        <!-- Tabela de usuários -->
        <div class="table-container" v-if="usuariosOrdenados.length">
          <table class="usuarios-table">
            <thead>
              <tr>
                <th>Criado em</th>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Nível</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="usuario in usuariosOrdenados"
                :key="usuario.id"
                class="clickable-row"
              >
                <td>{{ usuario.criadoEm }}</td>
                <td>{{ usuario.id }}</td>
                <td>
                  <div class="usuario-info">
                    <p>{{ usuario.nome }}</p>
                    <p class="usuario-cpf">{{ usuario.cpf || '---' }}</p>
                  </div>
                </td>
                <td>{{ usuario.email }}</td>

                <td>
                  <select 
                    :value="usuario.nivel" 
                    class="nivel-select"
                    @change="(event) => prepararAtualizacaoNivel(usuario, event)"
                  >
                    <option value="usuario">Usuário</option>
                    <option value="tecnico">Técnico</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>

                <td>
                  <select 
                    :value="usuario.status" 
                    :class="['status-select', statusClass(usuario.status)]"
                    @change="(event) => prepararAtualizacaoStatus(usuario, event)"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="loading-msg">Carregando usuários...</p>
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
          <p class="popup-message" v-html="popupMessage"></p>
        </div>

        <div class="popup-actions">
          <button 
            v-if="popupType === 'confirm'"
            class="popup-btn popup-btn-cancel" 
            @click="cancelAction"
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
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdmSidebar from '@/components/layouts/admSidebar.vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

interface Usuario {
  id: number
  criadoEm: string
  nome: string
  email: string
  cpf: string
  nivel: string
  status: string
}

export default defineComponent({
  name: 'GestaoUsuarios',
  components: { AdmSidebar },
  setup() {
    const router = useRouter()
    const auth = useAuthStore()

    const filtroNivel = ref('todos')
    const filtroStatus = ref('todos')
    const ordemExibicao = ref('recente')
    const pesquisa = ref('')
    const usuarios = ref<Usuario[]>([])
    const isLoading = ref(false)
    const loadingText = ref('Processando...')

    // Estados para o popup
    const showPopup = ref(false)
    const popupType = ref<'success' | 'error' | 'confirm'>('confirm')
    const popupTitle = ref('')
    const popupMessage = ref('')
    const popupConfirmText = ref('')
    const popupAction = ref<(() => void) | null>(null)
    const usuarioPendente = ref<Usuario | null>(null)
    const novoValor = ref<string>('')
    const valorOriginal = ref<string>('') // 🔥 NOVO: Guarda o valor original
    const campoPendente = ref<'nivel' | 'status' | null>(null)

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
      usuarioPendente.value = null
      campoPendente.value = null
      novoValor.value = ''
      valorOriginal.value = ''
    }

    // 🔥 FUNÇÃO: Cancelar ação
    const cancelAction = () => {
      // Não faz nada, apenas fecha o popup (o valor não foi alterado ainda)
      closePopup()
    }

    const handlePopupConfirm = () => {
      if (popupAction.value) {
        popupAction.value()
      }
    }

    const popupIcon = computed(() => {
      switch (popupType.value) {
        case 'success': return 'check_circle'
        case 'error': return 'error'
        case 'confirm': return 'help'
        default: return 'info'
      }
    })

    // ✅ Buscar usuários da API
    const carregarUsuarios = async () => {
      try {
        const token = auth.access
        if (!token) {
          showCustomPopup('error', 'Sessão Expirada', 'Sua sessão expirou. Faça login novamente.', 'OK', () => {
            router.push('/')
          })
          return
        }

        const response = await api.get('/usuarios/', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || []

        console.log('🔍 Estrutura real dos usuários:', data)

        usuarios.value = data.map((u: any) => ({
          id: u.id ?? 0,
          criadoEm: u.created_at
          ? new Date(u.created_at).toLocaleString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '---',
          nome: u.name || '---',
          email: u.email || '---',
          cpf: u.cpf || '---',
          nivel: (u.cargo || '').toLowerCase().replace('adm', 'admin') || 'usuario',
          status: u.is_active ? 'ativo' : 'inativo',
        }))

        console.log('✅ Usuários carregados formatados:', usuarios.value)
      } catch (error: any) {
        console.error('❌ Erro ao carregar usuários:', error)
        if (error.response?.status === 401) {
          showCustomPopup('error', 'Sessão Expirada', 'Sua sessão expirou. Faça login novamente.', 'OK', () => {
            router.push('/')
          })
        } else {
          showCustomPopup('error', 'Erro', 'Erro ao carregar usuários. Tente novamente.', 'OK')
        }
      }
    }

    onMounted(() => {
      carregarUsuarios()
    })

    // ✅ PREPARAR atualização de nível (NÃO atualiza o v-model ainda)
    const prepararAtualizacaoNivel = (usuario: Usuario, event: Event) => {
      const target = event.target as HTMLSelectElement
      const novoNivel = target.value
      
      // 🔥 GUARDA tanto o novo valor quanto o original
      usuarioPendente.value = usuario
      novoValor.value = novoNivel
      valorOriginal.value = usuario.nivel // 🔥 GUARDA O ORIGINAL
      campoPendente.value = 'nivel'
      
      const nivelTexto = {
        'usuario': 'Usuário',
        'tecnico': 'Técnico',
        'admin': 'Administrador'
      }[novoNivel] || novoNivel

      showCustomPopup(
        'confirm',
        'Alterar Nível de Acesso',
        `Tem certeza que deseja alterar o nível de acesso de <strong>${usuario.nome}</strong> para <strong>${nivelTexto}</strong>?`,
        'Confirmar Alteração',
        () => confirmarAtualizacaoNivel()
      )
    }

    // ✅ PREPARAR atualização de status (NÃO atualiza o v-model ainda)
    const prepararAtualizacaoStatus = (usuario: Usuario, event: Event) => {
      const target = event.target as HTMLSelectElement
      const novoStatus = target.value
      
      // 🔥 GUARDA tanto o novo valor quanto o original
      usuarioPendente.value = usuario
      novoValor.value = novoStatus
      valorOriginal.value = usuario.status // 🔥 GUARDA O ORIGINAL
      campoPendente.value = 'status'
      
      const statusTexto = novoStatus === 'ativo' ? 'Ativo' : 'Inativo'
      const acaoTexto = novoStatus === 'ativo' ? 'ativar' : 'desativar'

      showCustomPopup(
        'confirm',
        novoStatus === 'ativo' ? 'Ativar Usuário' : 'Desativar Usuário',
        `Tem certeza que deseja ${acaoTexto} o usuário <strong>${usuario.nome}</strong>?`,
        novoStatus === 'ativo' ? 'Ativar' : 'Desativar',
        () => confirmarAtualizacaoStatus()
      )
    }

    // ✅ CONFIRMAR atualização de nível (agora sim atualiza o v-model)
    const confirmarAtualizacaoNivel = async () => {
      if (!usuarioPendente.value || !novoValor.value) {
        closePopup()
        return
      }

      try {
        const token = auth.access
        if (!token) {
          closePopup()
          return
        }

        isLoading.value = true
        loadingText.value = 'Atualizando nível de acesso...'

        // 🔥 AGORA SIM: Atualiza o v-model
        usuarioPendente.value.nivel = novoValor.value

        const payload = { cargo: novoValor.value }

        const response = await api.patch(`/usuarios/${usuarioPendente.value.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })

        console.log('✅ Resposta da API:', response.data)

        const nivelTexto = {
          'usuario': 'Usuário',
          'tecnico': 'Técnico',
          'admin': 'Administrador'
        }[novoValor.value] || novoValor.value

        showCustomPopup(
          'success',
          'Sucesso!',
          `Nível de acesso de <strong>${usuarioPendente.value.nome}</strong> atualizado para <strong>${nivelTexto}</strong> com sucesso!`,
          'OK',
          () => closePopup()
        )
      } catch (error: any) {
        console.error('❌ Erro ao atualizar nível:', error)
        console.error('❌ Detalhes do erro:', error.response?.data || error)
        
        // 🔥 REVERTE em caso de erro
        if (usuarioPendente.value && valorOriginal.value) {
          usuarioPendente.value.nivel = valorOriginal.value
        }

        let errorMessage = 'Erro ao atualizar nível do usuário. Verifique os dados e tente novamente.'
        if (error.response?.data) {
          if (typeof error.response.data === 'object') {
            // Tenta extrair mensagens de erro específicas
            const errorData = error.response.data
            if (errorData.detail) {
              errorMessage = errorData.detail
            } else if (errorData.cargo) {
              errorMessage = `Cargo: ${Array.isArray(errorData.cargo) ? errorData.cargo.join(', ') : errorData.cargo}`
            } else {
              errorMessage = Object.values(errorData).flat().join('\n')
            }
          } else {
            errorMessage = error.response.data
          }
        }

        showCustomPopup('error', 'Erro', errorMessage, 'OK', () => closePopup())
      } finally {
        isLoading.value = false
      }
    }

    // ✅ CONFIRMAR atualização de status (agora sim atualiza o v-model)
    const confirmarAtualizacaoStatus = async () => {
      if (!usuarioPendente.value || !novoValor.value) {
        closePopup()
        return
      }

      try {
        const token = auth.access
        if (!token) {
          closePopup()
          return
        }

        isLoading.value = true
        loadingText.value = novoValor.value === 'ativo' ? 'Ativando usuário...' : 'Desativando usuário...'

        // 🔥 AGORA SIM: Atualiza o v-model
        usuarioPendente.value.status = novoValor.value

        const ativo = novoValor.value === 'ativo'

        const payload = {
          is_active: ativo,
          is_staff: ativo
        }

        const response = await api.patch(`/usuarios/${usuarioPendente.value.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })

        console.log('✅ Resposta da API:', response.data)

        const acaoTexto = novoValor.value === 'ativo' ? 'ativado' : 'desativado'
        
        showCustomPopup(
          'success',
          'Sucesso!',
          `Usuário <strong>${usuarioPendente.value.nome}</strong> ${acaoTexto} com sucesso!`,
          'OK',
          () => closePopup()
        )
      } catch (error: any) {
        console.error('❌ Erro ao atualizar status:', error)
        console.error('❌ Detalhes do erro:', error.response?.data || error)
        
        // 🔥 REVERTE em caso de erro
        if (usuarioPendente.value && valorOriginal.value) {
          usuarioPendente.value.status = valorOriginal.value
        }

        let errorMessage = 'Erro ao atualizar status do usuário. Verifique os dados e tente novamente.'
        if (error.response?.data) {
          if (typeof error.response.data === 'object') {
            // Tenta extrair mensagens de erro específicas
            const errorData = error.response.data
            if (errorData.detail) {
              errorMessage = errorData.detail
            } else if (errorData.is_active) {
              errorMessage = `Status: ${Array.isArray(errorData.is_active) ? errorData.is_active.join(', ') : errorData.is_active}`
            } else {
              errorMessage = Object.values(errorData).flat().join('\n')
            }
          } else {
            errorMessage = error.response.data
          }
        }

        showCustomPopup('error', 'Erro', errorMessage, 'OK', () => closePopup())
      } finally {
        isLoading.value = false
      }
    }

    // ✅ Filtros e ordenação
    const filtrados = computed(() => {
      return usuarios.value.filter((u) => {
        const matchNivel =
          filtroNivel.value === 'todos' ||
          u.nivel.toLowerCase() === filtroNivel.value.toLowerCase()

        const matchStatus =
          filtroStatus.value === 'todos' ||
          u.status.toLowerCase() === filtroStatus.value.toLowerCase()

        const matchPesquisa =
          u.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
          u.email.toLowerCase().includes(pesquisa.value.toLowerCase())

        return matchNivel && matchStatus && matchPesquisa
      })
    })

    const usuariosOrdenados = computed(() => {
      const lista = [...filtrados.value]
      if (ordemExibicao.value === 'recente') {
        return lista.sort(
          (a, b) =>
            new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
        )
      } else {
        return lista.sort(
          (a, b) =>
            new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime()
        )
      }
    })

    const statusClass = (status: string) => {
      switch (status.toLowerCase()) {
        case 'ativo':
          return 'status-ativo'
        case 'inativo':
          return 'status-inativo'
        default:
          return ''
      }
    }

    const closeProfileMenu = () => {}

    return {
      usuariosOrdenados,
      filtroNivel,
      filtroStatus,
      ordemExibicao,
      pesquisa,
      statusClass,
      showPopup,
      popupType,
      popupTitle,
      popupMessage,
      popupConfirmText,
      popupIcon,
      isLoading,
      loadingText,
      prepararAtualizacaoNivel,
      prepararAtualizacaoStatus,
      cancelAction,
      closePopup,
      handlePopupConfirm,
      closeProfileMenu,
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
.gestao-usuarios-page {
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
  flex-wrap: wrap;
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
  min-width: 200px;
  max-width: 300px;
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
.usuarios-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  table-layout: fixed;
  min-width: 900px;
}

.usuarios-table th,
.usuarios-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  word-wrap: break-word;
  vertical-align: middle;
}

.usuarios-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid #d0d0d0;
  font-size: 14px;
}

.usuarios-table td {
  color: #333;
  font-size: 14px;
}

.usuarios-table tr:last-child td {
  border-bottom: none;
}

/* Larguras específicas para cada coluna - Otimizadas */
.col-criado {
  width: 14%;
  min-width: 130px;
}

.col-id {
  width: 7%;
  min-width: 70px;
}

.col-nome {
  width: 25%;
  min-width: 180px;
}

.col-email {
  width: 22%;
  min-width: 160px;
}

.col-nivel {
  width: 15%;
  min-width: 130px;
}

.col-status {
  width: 12%;
  min-width: 120px;
}

.usuario-info {
  display: flex;
  flex-direction: column;
}

.usuario-cpf {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

/* Seletores dentro da tabela - ESTILO COMPATÍVEL */
.nivel-select,
.status-select {
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
  background-color: #fff;
  color: #000;
  transition: border-color 0.2s;
  width: 100%;
  cursor: pointer;
}

.nivel-select:focus,
.status-select:focus {
  outline: none;
  border-color: indigo;
}

/* CORES PARA O SELETOR DE STATUS - SEGUINDO O PADRÃO DO PROJETO */
.status-ativo {
  background-color: #d1fae5;
  color: #065f46;
  border-color: #065f46;
}

.status-inativo {
  background-color: #f8d7da;
  color: #842029;
  border-color: #842029;
}

/* Linha clicável */
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.clickable-row:hover {
  background-color: #f8f9fa;
}

.clickable-row:hover .nivel-select,
.clickable-row:hover .status-select {
  border-color: #999;
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
  max-width: 450px;
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

.popup-message strong {
  font-weight: 600;
  color: #000;
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
  .main-content {
    margin-left: 220px;
    width: calc(100vw - 220px);
  }
  
  .content-area {
    padding: 0 30px;
  }
  
  .page-title {
    padding: 40px 0 20px 0;
  }
  
  .filters {
    gap: 10px;
  }
  
  .filter-select {
    min-width: 120px;
  }
  
  .filter-search {
    min-width: 180px;
  }
}

@media (max-width: 900px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select,
  .filter-search {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .gestao-usuarios-page {
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
  
  .table-container {
    max-height: none;
    min-height: 300px;
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