<template>
  <div class="gestao-chamados-page" @click="closeProfileMenu">
    <!-- Sidebar do Admin -->
    <adm-sidebar />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <h1 class="page-title">Gestão de Chamados</h1>

        <!-- Filtros -->
        <div class="filters">
          <select v-model="filtroStatus" class="filter-select">
            <option value="todos">Todos os Status</option>
            <option value="concluido">Concluído</option>
            <option value="aberto">Aberto</option>
            <option value="aguardando_atendimento">Aguardando</option>
            <option value="em andamento">Em Andamento</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <select v-model="filtroPrioridade" class="filter-select">
            <option value="todos">Todas as Prioridades</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>

          <select v-model="filtroTecnico" class="filter-select">
            <option value="todos">Todos os Técnicos</option>
            <option v-for="tec in tecnicosUnicos" :key="tec" :value="tec">{{ tec }}</option>
          </select>

          <select v-model="ordemExibicao" class="filter-select">
            <option value="recente">Mais recente</option>
            <option value="antigo">Mais antigo</option>
          </select>

          <input
            type="text"
            v-model="pesquisa"
            placeholder="Pesquisar por título, cliente ou técnico"
            class="filter-search"
          />
        </div>

        <!-- Tabela -->
        <div class="table-container">
          <table class="chamados-table">
            <thead>
              <tr>
                <th class="col-atualizado">Atualizado</th>
                <th class="col-id">ID</th>
                <th class="col-titulo">Título</th>
                <th class="col-cliente">Cliente</th>
                <th class="col-tecnico">Técnico</th>
                <th class="col-prioridade">Prioridade</th>
                <th class="col-status">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="chamado in chamadosOrdenados"
                :key="chamado.id"
                class="clickable-row"
              >
                <td>{{ chamado.update_date }}</td>
                <td>{{ chamado.id }}</td>
                <td>
                  <p class="chamado-titulo">{{ chamado.title }}</p>
                </td>
                <td>
                  <div class="cliente-info">
                    <p class="cliente-nome">{{ chamado.creator?.name || '---' }}</p>
                    <p class="cliente-email">{{ chamado.creator?.email || '---' }}</p>
                  </div>
                </td>
                <td>
                  <div class="tecnico-info">
                    <p class="tecnico-nome">{{ chamado.employee?.name || 'Não atribuído' }}</p>
                    <p class="tecnico-email">{{ chamado.employee?.email || '---' }}</p>
                  </div>
                </td>
                <td>
                  <span :class="['prioridade', prioridadeClass(chamado.prioridade)]">
                    <span class="material-icons prioridade-icon">
                      {{ prioridadeIcon(chamado.prioridade) }}
                    </span>
                    {{ formatarPrioridade(chamado.prioridade) }}
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
import AdmSidebar from '@/components/layouts/admSidebar.vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

interface Chamado {
  id: number
  title: string
  status: string
  prioridade: string
  update_date: string
  creator?: { name: string; email: string }
  employee?: { name: string; email: string }
}

export default defineComponent({
  name: 'GestaoChamados',
  components: { AdmSidebar },
  setup() {
    const router = useRouter()
    const auth = useAuthStore()

    const filtroStatus = ref('todos')
    const filtroPrioridade = ref('todos')
    const filtroTecnico = ref('todos')
    const ordemExibicao = ref('recente')
    const pesquisa = ref('')
    const chamados = ref<Chamado[]>([])

    // ✅ Buscar todos os chamados
    const carregarChamados = async () => {
      try {
        const token = auth.access
        if (!token) {
          router.push('/')
          return
        }

        const response = await api.get('/chamados/', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data.results || response.data

        chamados.value = data.map((c: any) => ({
          id: c.id,
          title: c.title || 'Sem título',
          status: c.status || 'Sem status',
          prioridade: c.prioridade || 'Não definida',
          update_date: c.update_date
            ? new Date(c.update_date).toLocaleString('pt-BR')
            : '---',
          creator: c.creator
            ? { name: c.creator.name, email: c.creator.email }
            : { name: '---', email: '---' },
          employee: c.employee
            ? { name: c.employee.name, email: c.employee.email }
            : null,
        }))

        console.log('✅ Chamados carregados (Admin):', chamados.value)
      } catch (error: any) {
        console.error('❌ Erro ao carregar chamados:', error.response?.data || error)
        if (error.response?.status === 401) {
          alert('Sessão expirada. Faça login novamente.')
          router.push('/')
        }
      }
    }

    onMounted(() => {
      carregarChamados()
    })

    // ✅ Técnicos únicos para filtro
    const tecnicosUnicos = computed(() => {
      const nomes = chamados.value
        .map((c) => c.employee?.name)
        .filter((n) => !!n)
      return [...new Set(nomes)]
    })

    // ✅ Filtro e ordenação - CORRIGIDO
    const filtrados = computed(() => {
      return chamados.value.filter((c) => {
        // Filtro de Status - CORRIGIDO
        let matchStatus = true
        if (filtroStatus.value !== 'todos') {
          const statusChamado = c.status?.toLowerCase() || ''
          const statusFiltro = filtroStatus.value.toLowerCase()
          
          // Mapeamento correto dos status
          if (statusFiltro === 'em andamento') {
            matchStatus = statusChamado.includes('andamento') || statusChamado.includes('em andamento')
          } else if (statusFiltro === 'aguardando_atendimento') {
            matchStatus = statusChamado.includes('aguardando')
          } else if (statusFiltro === 'concluido') {
            matchStatus = statusChamado.includes('concluído') || statusChamado.includes('concluido')
          } else {
            matchStatus = statusChamado.includes(statusFiltro)
          }
        }

        // Filtro de Prioridade
        const matchPrioridade =
          filtroPrioridade.value === 'todos' ||
          (c.prioridade || '').toLowerCase() === filtroPrioridade.value.toLowerCase()

        // Filtro de Técnico
        const matchTecnico =
          filtroTecnico.value === 'todos' ||
          (c.employee?.name || '').toLowerCase().includes(filtroTecnico.value.toLowerCase())

        // Filtro de Pesquisa
        const matchPesquisa =
          (c.title || '').toLowerCase().includes(pesquisa.value.toLowerCase()) ||
          (c.creator?.name || '').toLowerCase().includes(pesquisa.value.toLowerCase()) ||
          (c.employee?.name || '').toLowerCase().includes(pesquisa.value.toLowerCase())

        return matchStatus && matchPrioridade && matchTecnico && matchPesquisa
      })
    })

    const chamadosOrdenados = computed(() => {
      const lista = [...filtrados.value]
      if (ordemExibicao.value === 'recente') {
        return lista.sort(
          (a, b) =>
            new Date(b.update_date).getTime() - new Date(a.update_date).getTime()
        )
      } else {
        return lista.sort(
          (a, b) =>
            new Date(a.update_date).getTime() - new Date(b.update_date).getTime()
        )
      }
    })

    // ✅ Classes e ícones - MANTIDO IGUAL AO CÓDIGO ORIGINAL
    const statusClass = (status: string) => {
      const statusLower = status.toLowerCase();
      if (statusLower.includes('concluído') || statusLower.includes('concluido')) return 'status-concluido'
      if (statusLower.includes('aberto')) return 'status-aberto'
      if (statusLower.includes('aguardando')) return 'status-aguardando'
      if (statusLower.includes('andamento')) return 'status-andamento'
      if (statusLower.includes('cancelado')) return 'status-cancelado'
      return ''
    }

    const statusIcon = (status: string) => {
      const statusLower = status.toLowerCase();
      if (statusLower.includes('concluído') || statusLower.includes('concluido')) return 'check_circle'
      if (statusLower.includes('aberto')) return 'circle'
      if (statusLower.includes('aguardando')) return 'hourglass_top'
      if (statusLower.includes('andamento')) return 'autorenew'
      if (statusLower.includes('cancelado')) return 'cancel'
      return 'help_outline'
    }

    const prioridadeClass = (prioridade: string) => {
      switch (prioridade.toLowerCase()) {
        case 'alta': return 'prioridade-alta'
        case 'media': return 'prioridade-media'
        case 'baixa': return 'prioridade-baixa'
        default: return ''
      }
    }

    const prioridadeIcon = (prioridade: string) => {
      switch (prioridade.toLowerCase()) {
        case 'alta': return 'arrow_upward'
        case 'media': return 'remove'
        case 'baixa': return 'arrow_downward'
        default: return ''
      }
    }

    const formatarPrioridade = (prioridade: string) => {
      switch (prioridade.toLowerCase()) {
        case 'alta': return 'Alta'
        case 'media': return 'Média'
        case 'baixa': return 'Baixa'
        default: return prioridade
      }
    }

    const formatarStatus = (status: string) => {
      const statusLower = status.toLowerCase();
      if (statusLower.includes('aguardando')) return 'Aguardando'
      if (statusLower.includes('andamento')) return 'Em Andamento'
      if (statusLower.includes('concluído') || statusLower.includes('concluido')) return 'Concluído'
      if (statusLower.includes('aberto')) return 'Aberto'
      if (statusLower.includes('cancelado')) return 'Cancelado'
      return status.charAt(0).toUpperCase() + status.slice(1)
    }

    const closeProfileMenu = () => {}

    return {
      chamados,
      chamadosOrdenados,
      tecnicosUnicos,
      filtroStatus,
      filtroPrioridade,
      filtroTecnico,
      ordemExibicao,
      pesquisa,
      statusClass,
      statusIcon,
      prioridadeClass,
      prioridadeIcon,
      formatarPrioridade,
      formatarStatus,
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
.gestao-chamados-page {
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
  max-width: 160px;
}

.filter-search {
  flex: 1;
  min-width: 180px;
  max-width: 250px;
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
  padding: 10px 12px;
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
  font-size: 13px;
}

.chamados-table td {
  color: #333;
  font-size: 13px;
}

.chamados-table tr:last-child td {
  border-bottom: none;
}

/* LARGURAS DAS COLUNAS OTIMIZADAS - MESMO DO ORIGINAL */
.col-atualizado {
  width: 11%;
  min-width: 100px;
}

.col-id {
  width: 5%;
  min-width: 50px;
}

.col-titulo {
  width: 20%;
  min-width: 140px;
}

.col-cliente {
  width: 16%;
  min-width: 120px;
}

.col-tecnico {
  width: 16%;
  min-width: 120px;
}

.col-prioridade {
  width: 10%;
  min-width: 90px;
}

.col-status {
  width: 10%;
  min-width: 90px;
}

/* Estilos para o conteúdo das células - MESMO DO ORIGINAL */
.chamado-titulo {
  margin: 0;
  font-weight: 500;
  line-height: 1.3;
}

.cliente-info,
.tecnico-info {
  display: flex;
  flex-direction: column;
}

.cliente-nome,
.tecnico-nome {
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.cliente-email,
.tecnico-email {
  font-size: 11px;
  color: #666;
  margin: 1px 0 0 0;
  line-height: 1.2;
}

/* Status e Prioridade com ESTILO COMPACTO - MESMO DO ORIGINAL */
.status,
.prioridade {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
}

.status-icon,
.prioridade-icon {
  font-size: 14px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* CORES DOS STATUS - EXATAMENTE IGUAL AO CÓDIGO ORIGINAL */
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

/* CORES DAS PRIORIDADES - MESMO ESTILO DOS STATUS - IGUAL AO ORIGINAL */
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
    max-width: 140px;
  }
  
  .filter-search {
    min-width: 150px;
    max-width: 200px;
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
  .gestao-chamados-page {
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