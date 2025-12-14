<template>
  <div class="meus-chamados-page" @click="closeProfileMenu">
    <cliente-sidebar :usuario="usuario" />
    <main class="main-content">
      <div class="content-area">
        <h1 class="page-title">Meus Chamados</h1>

        <!-- Filtros -->
        <div class="filters">
          <select v-model="filtroStatus" class="filter-select">
            <option value="todos">Todos</option>
            <option value="concluido">Concluído</option>
            <option value="aberto">Aberto</option>
            <option value="aguardando">Aguardando</option>
            <option value="andamento">Em Andamento</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <!-- Filtro de Prioridade -->
          <select v-model="filtroPrioridade" class="filter-select">
            <option value="todos">Todas as Prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <!-- Filtro de Ordenação -->
          <select v-model="ordemExibicao" class="filter-select">
            <option value="recente">Mais recente</option>
            <option value="antigo">Mais antigo</option>
          </select>

          <input
            type="text"
            v-model="pesquisa"
            placeholder="Pesquisar por título ou técnico"
            class="filter-search"
          />
        </div>

        <!-- Loading State -->
        <div v-if="carregando" class="loading">
          Carregando chamados...
        </div>

        <!-- Tabela de chamados -->
        <div v-else class="table-container">
          <table class="chamados-table">
            <thead>
              <tr>
                <th class="col-atualizado">Atualizado</th>
                <th class="col-id">ID</th>
                <th class="col-titulo">Título e Serviço</th>
                <th class="col-tecnico">Técnico</th>
                <th class="col-prioridade">Prioridade</th>
                <th class="col-status">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="chamado in chamadosOrdenados"
                :key="chamado.id"
                @click="goToChamadoDetalhado(chamado.id)"
                class="clickable-row"
              >
                <td>{{ formatarData(chamado.update_date) }}</td>
                <td>{{ chamado.id }}</td>
                <td>{{ chamado.title }}</td>
                <td>
                  <div class="tecnico-info">
                    <p>{{ getTecnicoNome(chamado) }}</p>
                    <p class="tecnico-email">
                      {{ getTecnicoEmail(chamado) }}
                    </p>
                  </div>
                </td>
                <td>
                  <span :class="['prioridade', prioridadeClass(chamado.priority || chamado.prioridade)]">
                    <span class="material-icons prioridade-icon">
                      {{ prioridadeIcon(chamado.priority || chamado.prioridade) }}
                    </span>
                    {{ formatarPrioridade(chamado.priority || chamado.prioridade) }}
                  </span>
                </td>
                <td>
                  <span :class="['status', statusClass(chamado.status)]">
                    <span class="material-icons status-icon">
                      {{ statusIcon(chamado.status) }}
                    </span>
                    {{ formatarStatus(chamado.status) }}
                  </span>
                </td>
              </tr>
              <tr v-if="chamadosOrdenados.length === 0">
                <td colspan="6" class="no-data">
                  Nenhum chamado encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ClienteSidebar from '@/components/layouts/clienteSidebar.vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

interface Creator {
  id: number
  name: string
  email: string
  cargo: string
  cpf: string
}

interface Tecnico {
  id: number
  name: string
  email: string
}

interface Chamado {
  id: number
  title: string
  status: string
  priority?: string
  prioridade?: string
  update_date: string
  employee?: Tecnico[] | null
  creator?: Creator | null
  created_by?: number
}

export default defineComponent({
  name: 'MeusChamados',
  components: { ClienteSidebar },

  setup() {
    const router = useRouter()
    const auth = useAuthStore()

    // Filtros
    const filtroStatus = ref('todos')
    const filtroPrioridade = ref('todos')
    const ordemExibicao = ref('recente')
    const pesquisa = ref('')
    const carregando = ref(true)
    const closeProfileMenu = () => {}

    const usuario = ref({
      nome: auth.user?.name || 'Usuário',
      email: auth.user?.email || 'sem@email.com'
    })

    const chamados = ref<Chamado[]>([])

    // Carrega chamados do usuário logado
    const carregarChamados = async () => {
      try {
        carregando.value = true
        const token = auth.access
        if (!token) {
          console.warn('⚠️ Nenhum token encontrado. Redirecionando para login...')
          router.push('/')
          return
        }

        const response = await api.get('chamados/', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const todosChamados = response.data.results || response.data

        // Filtro corrigido: suporta diferentes nomes de campo de criador
        const meusChamados = todosChamados.filter((c: any) => {
          const creatorId = c.creator?.id || c.creator_id || c.created_by
          const userId = auth.user?.id
          return creatorId === userId
        })

        chamados.value = meusChamados
      } catch (error: any) {
        console.error('❌ Erro ao carregar chamados:', error.response?.data || error)
        if (error.response?.status === 401) {
          alert('Sessão expirada. Faça login novamente.')
          router.push('/')
        }
      } finally {
        carregando.value = false
      }
    }

    onMounted(() => {
      carregarChamados()
    })



    const goToChamadoDetalhado = (id: number) => {
      router.push({ name: 'ChamadoDetalhado', params: { id } })
    }

    // Protegidas contra employee undefined
      const getTecnicoNome = (chamado: Chamado) => {
  if (!chamado.employee || chamado.employee.length === 0) return 'Sem técnico'
  return chamado.employee[0].name || 'Sem técnico'
}

const getTecnicoEmail = (chamado: Chamado) => {
  if (!chamado.employee || chamado.employee.length === 0) return 'sem-tecnico@email.com'
  return chamado.employee[0].email || 'sem-tecnico@email.com'
}



    const formatarData = (dataString: string) => {
      if (!dataString) return '--/--/---- --:--'
      const data = new Date(dataString)
      return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatarStatus = (status: string) => {
      const s = status?.toUpperCase() || ''
      switch (s) {
        case 'AGUARDANDO_ATENDIMENTO': return 'Aguardando'
        case 'EM_ANDAMENTO': return 'Em Andamento'
        case 'CONCLUIDO': return 'Concluído'
        case 'CANCELADO': return 'Cancelado'
        case 'ABERTO': return 'Aberto'
        default: return status || 'Desconhecido'
      }
    }

    const filtrados = computed(() => {
      return chamados.value.filter((c) => {
        const statusFormatado = formatarStatus(c.status).toLowerCase()
        const filtroStatusLower = filtroStatus.value.toLowerCase()

        const matchStatus =
          filtroStatus.value === 'todos' ||
          statusFormatado === filtroStatusLower ||
          (filtroStatusLower === 'aguardando' && statusFormatado === 'aguardando') ||
          (filtroStatusLower === 'andamento' && statusFormatado === 'em andamento')

        const prioridade = c.priority || c.prioridade || ''
        const matchPrioridade =
          filtroPrioridade.value === 'todos' ||
          prioridade.toLowerCase() === filtroPrioridade.value.toLowerCase()

        const titulo = c.title || ''
        const tecnicoNome = getTecnicoNome(c) || ''
        const matchPesquisa =
          titulo.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
          tecnicoNome.toLowerCase().includes(pesquisa.value.toLowerCase())

        return matchStatus && matchPrioridade && matchPesquisa
      })
    })

    const chamadosOrdenados = computed(() => {
      const lista = [...filtrados.value]
      if (ordemExibicao.value === 'recente') {
        return lista.sort(
          (a, b) => new Date(b.update_date).getTime() - new Date(a.update_date).getTime()
        )
      } else {
        return lista.sort(
          (a, b) => new Date(a.update_date).getTime() - new Date(b.update_date).getTime()
        )
      }
    })

    const statusClass = (status: string) => {
      const s = formatarStatus(status).toLowerCase()
      switch (s) {
        case 'concluído': return 'status-concluido'
        case 'aberto': return 'status-aberto'
        case 'aguardando': return 'status-aguardando'
        case 'em andamento': return 'status-andamento'
        case 'cancelado': return 'status-cancelado'
        default: return ''
      }
    }

    const statusIcon = (status: string) => {
      const s = formatarStatus(status).toLowerCase()
      switch (s) {
        case 'concluído': return 'check_circle'
        case 'aberto': return 'circle'
        case 'aguardando': return 'hourglass_top'
        case 'em andamento': return 'autorenew'
        case 'cancelado': return 'cancel'
        default: return 'help_outline'
      }
    }

    const prioridadeClass = (prioridade?: string) => {
      const p = prioridade?.toUpperCase() || ''
      switch (p) {
        case 'ALTA': return 'prioridade-alta'
        case 'MEDIA': return 'prioridade-media'
        case 'BAIXA': return 'prioridade-baixa'
        default: return ''
      }
    }

    const prioridadeIcon = (prioridade?: string) => {
      const p = prioridade?.toUpperCase() || ''
      switch (p) {
        case 'ALTA': return 'arrow_upward'
        case 'MEDIA': return 'remove'
        case 'BAIXA': return 'arrow_downward'
        default: return ''
      }
    }

    const formatarPrioridade = (prioridade?: string) => {
      const p = prioridade?.toUpperCase() || ''
      switch (p) {
        case 'ALTA': return 'Alta'
        case 'MEDIA': return 'Média'
        case 'BAIXA': return 'Baixa'
        default: return prioridade || 'Não definida'
      }
    }

    return {
      filtroStatus,
      filtroPrioridade,
      ordemExibicao,
      pesquisa,
      usuario,
      chamados,
      carregando,
      carregarChamados,
      goToChamadoDetalhado,
      filtrados,
      chamadosOrdenados,
      statusClass,
      statusIcon,
      prioridadeClass,
      prioridadeIcon,
      formatarPrioridade,
      formatarData,
      formatarStatus,
      getTecnicoNome,
      closeProfileMenu,
      getTecnicoEmail
    }
  }
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
.meus-chamados-page {
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

/* CORREÇÃO: Material-icons no conteúdo principal devem herdar a cor do contexto */
.main-content .material-icons {
  color: inherit;
  font-size: inherit;
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
.chamados-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  table-layout: fixed;
  min-width: 900px;
}

.chamados-table th,
.chamados-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  word-wrap: break-word;
  vertical-align: middle;
}

.chamados-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid #d0d0d0;
  font-size: 14px;
}

.chamados-table td {
  color: #333;
  font-size: 14px;
}

.chamados-table tr:last-child td {
  border-bottom: none;
}

/* Larguras específicas para cada coluna - Otimizadas */
.col-atualizado {
  width: 14%;
  min-width: 130px;
}

.col-id {
  width: 7%;
  min-width: 70px;
}

.col-titulo {
  width: 25%;
  min-width: 180px;
}

.col-tecnico {
  width: 20%;
  min-width: 160px;
}

.col-prioridade {
  width: 12%;
  min-width: 110px;
}

.col-status {
  width: 12%;
  min-width: 120px;
}

.tecnico-info {
  display: flex;
  flex-direction: column;
}

.tecnico-email {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

/* Status e Prioridade com ESTILO IDÊNTICO */
.status,
.prioridade {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 13px;
  white-space: nowrap;
}

.status-icon,
.prioridade-icon {
  font-size: 16px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* CORES DOS STATUS CORRIGIDAS - IGUAL À IMAGEM */
.status-concluido {
  background-color: #d1fae5;
  color: #065f46;
}

.status-aberto {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-aguardando {
  background-color: #fff3cd;
  color: #856404;
}

.status-andamento {
  background-color: #cfe2ff;
  color: #084298;
}

.status-cancelado {
  background-color: #f8d7da;
  color: #842029;
}

/* CORES DAS PRIORIDADES - MESMO ESTILO DOS STATUS */
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

/* Linha clicável */
.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.clickable-row:hover {
  background-color: #f8f9fa;
}

/* Loading e estados vazios */
.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
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
  .meus-chamados-page {
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
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
}
</style>