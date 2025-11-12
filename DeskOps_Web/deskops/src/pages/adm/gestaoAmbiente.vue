<template>
  <div class="gestao-ambientes-page" @click="closeProfileMenu">
    <!-- Sidebar do Admin -->
    <adm-sidebar />

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
                @click="$router.push(`/adm/detalhes-ambiente/${ambiente.id}`)"
                class="clickable-row"
              >
               
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
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdmSidebar from '@/components/layouts/admSidebar.vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

interface Responsavel {
  nome: string
  email: string
}

interface Ambiente {
  id: number
  nome: string
  descricao: string
  responsavel: Responsavel
  criadoEm: string
}

export default defineComponent({
  name: 'GestaoAmbientes',
  components: { AdmSidebar },

  setup() {
    const router = useRouter()
    const auth = useAuthStore()
    const token = auth.access

    const ambientes = ref<Ambiente[]>([])
    const filtroResponsavel = ref('todos')
    const ordemExibicao = ref('recente')
    const pesquisa = ref('')

    // 🔹 Buscar ambientes reais da API
    const carregarAmbientes = async () => {
      try {
        const response = await api.get('/environment/', {
          headers: { Authorization: `Bearer ${token}` }
        })

        console.log('✅ Dados recebidos:', response.data)

        const data = Array.isArray(response.data)
      ? response.data
      : response.data.results

    ambientes.value = data.map((a: any) => ({
      id: a.id,
      nome: a.name,
      descricao: a.description || 'Sem descrição',
      responsavel: {
        nome: a.responsible?.name || 'Não definido',
        email: a.responsible?.email || '---',
   
      },
     
      criadoEm: a.created_at
        ? new Date(a.created_at).toLocaleString('pt-BR')
        : '---',
        }))
      } catch (error) {
        console.error('❌ Erro ao carregar ambientes:', error)
         
      }
    }

    const filtrados = computed(() => {
      return ambientes.value.filter((a) => {
        const matchResponsavel =
          filtroResponsavel.value === 'todos' ||
          a.responsavel.nome.toLowerCase().includes(filtroResponsavel.value.toLowerCase())

        const matchPesquisa =
          a.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
          a.descricao.toLowerCase().includes(pesquisa.value.toLowerCase())

        return matchResponsavel && matchPesquisa
      })
    })

    const ambientesOrdenados = computed(() => {
      const lista = [...filtrados.value]
      return lista.sort((a, b) => {
        const dataA = new Date(a.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime()
        const dataB = new Date(b.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime()
        return ordemExibicao.value === 'recente' ? dataB - dataA : dataA - dataB
      })
    })

    const verDetalhesAmbiente = (id: number) => {
      router.push(`/adm/detalhes-ambiente/${id}`)
    }

    const cadastrarAmbiente = () => {
      router.push('/adm/novo-ambiente')
    }

    const closeProfileMenu = () => {}

    onMounted(() => carregarAmbientes())

    return {
      ambientes,
      filtroResponsavel,
      ordemExibicao,
      pesquisa,
      ambientesOrdenados,
      verDetalhesAmbiente,
      cadastrarAmbiente,
      closeProfileMenu
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