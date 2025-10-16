<template>
  <div class="gestao-usuarios-page" @click="closeProfileMenu">
    <!-- Sidebar do Admin -->
    <adm-sidebar :usuario="usuario" />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <h1 class="page-title">Gestão de Usuários</h1>

        <!-- Filtros -->
        <div class="filters">
          <select v-model="filtroNivel" class="filter-select">
            <option value="todos">Todos os Níveis</option>
            <option value="cliente">Cliente</option>
            <option value="tecnico">Técnico</option>
            <option value="administrador">Administrador</option>
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
        <div class="table-container">
          <table class="usuarios-table">
            <thead>
              <tr>
                <th class="col-criado">Criado em</th>
                <th class="col-id">ID</th>
                <th class="col-nome">Nome</th>
                <th class="col-email">Email</th>
                <th class="col-nivel">Nível</th>
                <th class="col-status">Status</th>
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
                    <p class="usuario-cpf">{{ usuario.cpf }}</p>
                  </div>
                </td>
                <td>{{ usuario.email }}</td>
                <td>
                  <select 
                    v-model="usuario.nivel" 
                    class="nivel-select"
                    @change="atualizarNivelUsuario(usuario)"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="tecnico">Técnico</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </td>
                <td>
                  <select 
                    v-model="usuario.status" 
                    :class="['status-select', statusClass(usuario.status)]"
                    @change="atualizarStatusUsuario(usuario)"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
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
  components: {
    AdmSidebar
  },
  setup() {
    const router = useRouter()
    const filtroNivel = ref('todos')
    const filtroStatus = ref('todos')
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

    const usuarios = ref<Usuario[]>([
      { id: 1001, criadoEm: '11/10/2025 10:30', nome: 'Lucas Santino', email: 'lucas@email.com', cpf: '123.456.789-00', nivel: 'cliente', status: 'ativo' },
      { id: 1002, criadoEm: '10/10/2025 14:20', nome: 'Maria Silva', email: 'maria@email.com', cpf: '234.567.890-11', nivel: 'cliente', status: 'ativo' },
      { id: 1003, criadoEm: '09/10/2025 09:50', nome: 'Victor Ribeiro', email: 'victor@email.com', cpf: '345.678.901-22', nivel: 'tecnico', status: 'ativo' },
      { id: 1004, criadoEm: '08/10/2025 11:10', nome: 'Ana Oliveira', email: 'ana@email.com', cpf: '456.789.012-33', nivel: 'cliente', status: 'inativo' },
      { id: 1005, criadoEm: '07/10/2025 16:00', nome: 'Carlos Santos', email: 'carlos@email.com', cpf: '567.890.123-44', nivel: 'administrador', status: 'ativo' },
      { id: 1006, criadoEm: '06/10/2025 13:45', nome: 'Fernanda Lima', email: 'fernanda@email.com', cpf: '678.901.234-55', nivel: 'cliente', status: 'ativo' },
      { id: 1007, criadoEm: '05/10/2025 08:20', nome: 'Roberto Alves', email: 'roberto@email.com', cpf: '789.012.345-66', nivel: 'tecnico', status: 'ativo' },
      { id: 1008, criadoEm: '04/10/2025 15:30', nome: 'Patrícia Costa', email: 'patricia@email.com', cpf: '890.123.456-77', nivel: 'cliente', status: 'inativo' },
    ])

    const filtrados = computed(() => {
      return usuarios.value.filter((u) => {
        const matchNivel = filtroNivel.value === 'todos' || u.nivel.toLowerCase() === filtroNivel.value.toLowerCase()
        const matchStatus = filtroStatus.value === 'todos' || u.status.toLowerCase() === filtroStatus.value.toLowerCase()
        const matchPesquisa =
          u.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
          u.email.toLowerCase().includes(pesquisa.value.toLowerCase())
        return matchNivel && matchStatus && matchPesquisa
      })
    })

    const usuariosOrdenados = computed(() => {
      const usuariosFiltrados = [...filtrados.value]
      
      if (ordemExibicao.value === 'recente') {
        return usuariosFiltrados.sort((a, b) => {
          // Ordenação por data mais recente primeiro
          return new Date(b.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime() - 
                 new Date(a.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime()
        })
      } else {
        return usuariosFiltrados.sort((a, b) => {
          // Ordenação por data mais antiga primeiro
          return new Date(a.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime() - 
                 new Date(b.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime()
        })
      }
    })

    const statusClass = (status: string) => {
      switch (status.toLowerCase()) {
        case 'ativo': return 'status-ativo'
        case 'inativo': return 'status-inativo'
        default: return ''
      }
    }

    const atualizarNivelUsuario = (usuario: Usuario) => {
      console.log('Atualizando nível do usuário:', usuario.id, 'para:', usuario.nivel)
      // Aqui você faria a chamada à API para atualizar o nível do usuário
    }

    const atualizarStatusUsuario = (usuario: Usuario) => {
      console.log('Atualizando status do usuário:', usuario.id, 'para:', usuario.status)
      // Aqui você faria a chamada à API para atualizar o status do usuário
    }

    return { 
      usuario,
      filtroNivel,
      filtroStatus,
      ordemExibicao,
      pesquisa, 
      usuariosOrdenados,
      statusClass,
      atualizarNivelUsuario,
      atualizarStatusUsuario,
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
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
}
</style>