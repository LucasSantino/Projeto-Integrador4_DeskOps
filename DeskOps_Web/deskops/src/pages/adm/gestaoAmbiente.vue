<template>
  <div class="gestao-ambientes-page" @click="closeProfileMenu">
    <!-- Sidebar do Admin -->
    <adm-sidebar :usuario="usuario" />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <h1 class="page-title">Gestão de Ambientes</h1>

        <!-- Filtros -->
        <div class="filters">
          <select v-model="filtroResponsavel" class="filter-select">
            <option value="todos">Todos os Responsáveis</option>
            <option value="lucas">Lucas Santino</option>
            <option value="maria">Maria Silva</option>
            <option value="carlos">Carlos Santos</option>
            <option value="ana">Ana Oliveira</option>
          </select>

          <select v-model="ordemExibicao" class="filter-select">
            <option value="recente">Mais recente</option>
            <option value="antigo">Mais antigo</option>
          </select>

          <input
            type="text"
            v-model="pesquisa"
            placeholder="Pesquisar por nome ou descrição"
            class="filter-search"
          />

          <!-- Botão Cadastrar Ambiente -->
          <button class="btn-cadastrar" @click="cadastrarAmbiente">
            <span class="material-icons">add</span>
            Cadastrar Ambiente
          </button>
        </div>

        <!-- Tabela de ambientes -->
        <div class="table-container">
          <table class="ambientes-table">
            <thead>
              <tr>
                <th class="col-criado">Criado em</th>
                <th class="col-id">ID</th>
                <th class="col-nome">Nome do Ambiente</th>
                <th class="col-descricao">Descrição</th>
                <th class="col-responsavel">Responsável</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="ambiente in ambientesOrdenados"
                :key="ambiente.id"
                @click="verDetalhesAmbiente(ambiente.id)"
                class="clickable-row"
              >
                <td>{{ ambiente.criadoEm }}</td>
                <td>{{ ambiente.id }}</td>
                <td>
                  <div class="ambiente-info">
                    <p class="ambiente-nome">{{ ambiente.nome }}</p>
                  </div>
                </td>
                <td>
                  <p class="ambiente-descricao">{{ ambiente.descricao }}</p>
                </td>
                <td>
                  <div class="responsavel-info">
                    <p class="responsavel-nome">{{ ambiente.responsavel.nome }}</p>
                    <p class="responsavel-email">{{ ambiente.responsavel.email }}</p>
                  </div>
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

interface Responsavel {
  nome: string
  email: string
}

interface Ambiente {
  id: number
  criadoEm: string
  nome: string
  descricao: string
  responsavel: Responsavel
}

export default defineComponent({
  name: 'GestaoAmbiente',
  components: {
    AdmSidebar
  },
  setup() {
    const router = useRouter()
    const filtroResponsavel = ref('todos')
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

    const ambientes = ref<Ambiente[]>([
      { 
        id: 2001, 
        criadoEm: '11/10/2025 10:30', 
        nome: 'Sala de Reuniões - Matriz', 
        descricao: 'Sala de reuniões principal com capacidade para 20 pessoas, equipada com projetor e sistema de videoconferência.',
        responsavel: { nome: 'Lucas Santino', email: 'lucas@email.com' }
      },
      { 
        id: 2002, 
        criadoEm: '10/10/2025 14:20', 
        nome: 'Laboratório de TI', 
        descricao: 'Laboratório equipado com computadores de última geração para desenvolvimento e testes.',
        responsavel: { nome: 'Maria Silva', email: 'maria@email.com' }
      },
      { 
        id: 2003, 
        criadoEm: '09/10/2025 09:50', 
        nome: 'Data Center', 
        descricao: 'Sala de servidores com controle de temperatura e redundância de energia.',
        responsavel: { nome: 'Carlos Santos', email: 'carlos@email.com' }
      },
      { 
        id: 2004, 
        criadoEm: '08/10/2025 11:10', 
        nome: 'Escritório - Andar 3', 
        descricao: 'Área de trabalho colaborativa com 30 estações e salas de reunião menores.',
        responsavel: { nome: 'Ana Oliveira', email: 'ana@email.com' }
      },
      { 
        id: 2005, 
        criadoEm: '07/10/2025 16:00', 
        nome: 'Recepção', 
        descricao: 'Área de recepção com balcão de atendimento e sala de espera.',
        responsavel: { nome: 'Lucas Santino', email: 'lucas@email.com' }
      },
      { 
        id: 2006, 
        criadoEm: '06/10/2025 13:45', 
        nome: 'Sala de Treinamento', 
        descricao: 'Ambiente para capacitações e treinamentos corporativos.',
        responsavel: { nome: 'Maria Silva', email: 'maria@email.com' }
      },
      { 
        id: 2007, 
        criadoEm: '05/10/2025 08:20', 
        nome: 'Copa e Cozinha', 
        descricao: 'Área de convivência com cozinha equipada e espaço para refeições.',
        responsavel: { nome: 'Carlos Santos', email: 'carlos@email.com' }
      },
    ])

    const filtrados = computed(() => {
      return ambientes.value.filter((a) => {
        const matchResponsavel = filtroResponsavel.value === 'todos' || 
          a.responsavel.nome.toLowerCase().includes(filtroResponsavel.value.toLowerCase())
        const matchPesquisa =
          a.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
          a.descricao.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
          a.responsavel.nome.toLowerCase().includes(pesquisa.value.toLowerCase())
        return matchResponsavel && matchPesquisa
      })
    })

    const ambientesOrdenados = computed(() => {
      const ambientesFiltrados = [...filtrados.value]
      
      if (ordemExibicao.value === 'recente') {
        return ambientesFiltrados.sort((a, b) => {
          // Ordenação por data mais recente primeiro
          return new Date(b.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime() - 
                 new Date(a.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime()
        })
      } else {
        return ambientesFiltrados.sort((a, b) => {
          // Ordenação por data mais antiga primeiro
          return new Date(a.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime() - 
                 new Date(b.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime()
        })
      }
    })

    const cadastrarAmbiente = () => {
      router.push('/adm/novo-ambiente')
    }

    const verDetalhesAmbiente = (id: number) => {
      // Redireciona para a página de detalhes do ambiente
      router.push('/adm/detalhes-ambiente')
    }

    return { 
      usuario,
      filtroResponsavel,
      ordemExibicao,
      pesquisa, 
      ambientesOrdenados,
      cadastrarAmbiente,
      verDetalhesAmbiente,
      closeProfileMenu
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
.gestao-ambientes-page {
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

/* Botão Cadastrar Ambiente */
.btn-cadastrar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  height: 40px;
  white-space: nowrap;
}

.btn-cadastrar:hover {
  background-color: #222;
  transform: translateY(-2px);
}

.btn-cadastrar .material-icons {
  font-size: 18px;
  color: #fff;
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
.ambientes-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  table-layout: fixed;
  min-width: 900px;
}

.ambientes-table th,
.ambientes-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  word-wrap: break-word;
  vertical-align: middle;
}

.ambientes-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid #d0d0d0;
  font-size: 14px;
}

.ambientes-table td {
  color: #333;
  font-size: 14px;
}

.ambientes-table tr:last-child td {
  border-bottom: none;
}

/* Larguras específicas para cada coluna - Otimizadas */
.col-criado {
  width: 12%;
  min-width: 120px;
}

.col-id {
  width: 6%;
  min-width: 60px;
}

.col-nome {
  width: 20%;
  min-width: 150px;
}

.col-descricao {
  width: 35%;
  min-width: 200px;
}

.col-responsavel {
  width: 22%;
  min-width: 150px;
}

.ambiente-info {
  display: flex;
  flex-direction: column;
}

.ambiente-nome {
  font-weight: 600;
  color: #000;
  margin: 0;
}

.ambiente-descricao {
  color: #555;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
  /* Limite de 3 linhas compatível */
  max-height: 4.2em; /* 3 linhas * 1.4 line-height */
  overflow: hidden;
  position: relative;
  display: block;
}

.ambiente-descricao::after {
  content: '...';
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(90deg, transparent 0%, white 20%, white 100%);
  padding-left: 8px;
}

.responsavel-info {
  display: flex;
  flex-direction: column;
}

.responsavel-nome {
  font-weight: 500;
  color: #000;
  margin: 0;
}

.responsavel-email {
  font-size: 12px;
  color: #666;
  margin: 2px 0 0 0;
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
  
  .btn-cadastrar {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .gestao-ambientes-page {
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