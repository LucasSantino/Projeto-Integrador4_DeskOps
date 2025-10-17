<template>
  <div class="gestao-chamados-page" @click="closeProfileMenu">
    <!-- Sidebar do Admin -->
    <adm-sidebar :usuario="usuario" />

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
            <option value="aguardando">Aguardando</option>
            <option value="andamento">Em Andamento</option>
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
            <option value="victor">Victor Ribeiro</option>
            <option value="carlos">Carlos Almeida</option>
            <option value="maria">Maria Silva</option>
            <option value="pedro">Pedro Costa</option>
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

        <!-- Tabela de chamados -->
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
                @click="goToChamadoDetalhado(chamado.id)"
                class="clickable-row"
              >
                <td>{{ chamado.atualizado }}</td>
                <td>{{ chamado.id }}</td>
                <td>
                  <p class="chamado-titulo">{{ chamado.titulo }}</p>
                </td>
                <td>
                  <div class="cliente-info">
                    <p class="cliente-nome">{{ chamado.cliente }}</p>
                    <p class="cliente-email">{{ chamado.email || chamado.cliente.toLowerCase() + '@email.com' }}</p>
                  </div>
                </td>
                <td>
                  <div class="tecnico-info">
                    <p class="tecnico-nome">{{ chamado.tecnico || 'Não atribuído' }}</p>
                    <p class="tecnico-email" v-if="chamado.tecnico">{{ getTecnicoEmail(chamado.tecnico) }}</p>
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
                    {{ chamado.status }}
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
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdmSidebar from '@/components/layouts/admSidebar.vue'

interface Chamado {
  id: number
  atualizado: string
  titulo: string
  cliente: string
  email?: string
  tecnico?: string
  status: string
  prioridade: string
}

export default defineComponent({
  name: 'GestaoChamados',
  components: {
    AdmSidebar
  },
  setup() {
    const router = useRouter()
    const filtroStatus = ref('todos')
    const filtroPrioridade = ref('todos')
    const filtroTecnico = ref('todos')
    const ordemExibicao = ref('recente')
    const pesquisa = ref('')

    const usuario = ref({
      nome: 'Administrador',
      email: 'admin@deskops.com',
      dataNascimento: '10/05/1980',
      cpf: '111.222.333-44',
      endereco: 'Av. Principal, 1000, São Paulo, SP',
      tipoUsuario: 'Administrador',
      foto: '', 
    })

    const closeProfileMenu = () => {
      // Esta função será chamada no clique da página para fechar o menu de perfil
    }

    const goToChamadoDetalhado = (id: number) => {
      router.push({ path: '/adm/chamado-detalhado', query: { id: id.toString() } })
    }

    const chamados = ref<Chamado[]>([
      { id: 101, atualizado: '11/10/2025 10:30', titulo: 'Troca de cabo de rede', cliente: 'Lucas Santino', email:'lucas@email.com', tecnico: 'Victor Ribeiro', status: 'Aberto', prioridade: 'alta' },
      { id: 102, atualizado: '10/10/2025 14:20', titulo: 'Atualização sistema operacional', cliente: 'Maria Silva', email:'maria@email.com', tecnico: 'Carlos Almeida', status: 'Concluído', prioridade: 'media' },
      { id: 103, atualizado: '09/10/2025 09:50', titulo: 'Manutenção impressora laser', cliente: 'Pedro Costa', email:'pedro@email.com', tecnico: 'Victor Ribeiro', status: 'Em Andamento', prioridade: 'alta' },
      { id: 104, atualizado: '08/10/2025 11:10', titulo: 'Configuração rede Wi-Fi', cliente: 'Ana Oliveira', email:'ana@email.com', tecnico: 'Maria Silva', status: 'Aguardando', prioridade: 'baixa' },
      { id: 105, atualizado: '07/10/2025 16:00', titulo: 'Backup servidor arquivos', cliente: 'Carlos Santos', email:'carlos@email.com', tecnico: 'Pedro Costa', status: 'Cancelado', prioridade: 'media' },
      { id: 106, atualizado: '06/10/2025 13:45', titulo: 'Instalação software antivírus', cliente: 'Fernanda Lima', email:'fernanda@email.com', tecnico: 'Victor Ribeiro', status: 'Em Andamento', prioridade: 'alta' },
      { id: 107, atualizado: '05/10/2025 08:20', titulo: 'Troca de HD com defeito', cliente: 'Roberto Alves', email:'roberto@email.com', tecnico: 'Carlos Almeida', status: 'Concluído', prioridade: 'baixa' },
      { id: 108, atualizado: '04/10/2025 15:30', titulo: 'Problema com acesso à rede', cliente: 'Patrícia Costa', email:'patricia@email.com', status: 'Aberto', prioridade: 'alta' },
    ])

    const getTecnicoEmail = (tecnico: string) => {
      const emails: { [key: string]: string } = {
        'Victor Ribeiro': 'victor@email.com',
        'Carlos Almeida': 'carlos@email.com',
        'Maria Silva': 'maria.tec@email.com',
        'Pedro Costa': 'pedro@email.com'
      }
      return emails[tecnico] || `${tecnico.toLowerCase().replace(' ', '.')}@email.com`
    }

    const filtrados = computed(() => {
      return chamados.value.filter((c) => {
        const matchStatus = filtroStatus.value === 'todos' || c.status.toLowerCase() === filtroStatus.value.toLowerCase()
        const matchPrioridade = filtroPrioridade.value === 'todos' || c.prioridade.toLowerCase() === filtroPrioridade.value.toLowerCase()
        const matchTecnico = filtroTecnico.value === 'todos' || 
          (c.tecnico && c.tecnico.toLowerCase().includes(filtroTecnico.value.toLowerCase()))
        const matchPesquisa =
          c.titulo.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
          c.cliente.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
          (c.tecnico && c.tecnico.toLowerCase().includes(pesquisa.value.toLowerCase()))
        return matchStatus && matchPrioridade && matchTecnico && matchPesquisa
      })
    })

    const chamadosOrdenados = computed(() => {
      const chamadosFiltrados = [...filtrados.value]
      
      if (ordemExibicao.value === 'recente') {
        return chamadosFiltrados.sort((a, b) => {
          // Ordenação por data mais recente primeiro
          return new Date(b.atualizado.split(' ')[0].split('/').reverse().join('-')).getTime() - 
                 new Date(a.atualizado.split(' ')[0].split('/').reverse().join('-')).getTime()
        })
      } else {
        return chamadosFiltrados.sort((a, b) => {
          // Ordenação por data mais antiga primeiro
          return new Date(a.atualizado.split(' ')[0].split('/').reverse().join('-')).getTime() - 
                 new Date(b.atualizado.split(' ')[0].split('/').reverse().join('-')).getTime()
        })
      }
    })

    const statusClass = (status: string) => {
      switch (status.toLowerCase()) {
        case 'concluído': return 'status-concluido'
        case 'aberto': return 'status-aberto'
        case 'aguardando': return 'status-aguardando'
        case 'em andamento': return 'status-andamento'
        case 'cancelado': return 'status-cancelado'
        default: return ''
      }
    }

    const statusIcon = (status: string) => {
      switch (status.toLowerCase()) {
        case 'concluído': return 'check_circle'
        case 'aberto': return 'circle'
        case 'aguardando': return 'hourglass_top'
        case 'em andamento': return 'autorenew'
        case 'cancelado': return 'cancel'
        default: return ''
      }
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

    return { 
      usuario,
      filtroStatus, 
      filtroPrioridade,
      filtroTecnico,
      ordemExibicao,
      pesquisa, 
      chamadosOrdenados, 
      statusClass, 
      statusIcon,
      prioridadeClass,
      prioridadeIcon,
      formatarPrioridade,
      getTecnicoEmail,
      closeProfileMenu, 
      goToChamadoDetalhado 
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

/* LARGURAS DAS COLUNAS OTIMIZADAS */
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

/* Estilos para o conteúdo das células */
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

/* Status e Prioridade com ESTILO COMPACTO */
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

/* CORES DOS STATUS - IGUAL À IMAGEM */
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