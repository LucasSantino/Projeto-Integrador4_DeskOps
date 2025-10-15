<template>
  <div class="chamado-detalhado-page" @click="closeProfileMenu">
    <!-- Sidebar como componente -->
    <tecnico-sidebar :usuario="usuario" />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <!-- Botão Voltar -->
        <div class="back-container" @click="$router.push('/tecnico/chamados')">
          <span class="material-icons back-icon">arrow_back</span>
          <span class="back-text">Voltar</span>
        </div>

        <!-- Título -->
        <div class="title-container">
          <h1 class="page-title">Chamado Detalhado</h1>
        </div>

        <div class="cards-container">
          <!-- Card do chamado -->
          <div class="card-form">
            <div class="header-info">
              <p class="chamado-id">#{{ chamado.id }}</p>
              <span :class="['status-badge', statusClass(chamado.status)]">
                <span class="material-icons status-icon">{{ statusIcon(chamado.status) }}</span>
                {{ chamado.status }}
              </span>
            </div>

            <h2 class="chamado-titulo">{{ chamado.titulo }}</h2>

            <div class="info-section">
              <h3>Descrição</h3>
              <p class="info-text">{{ chamado.descricao }}</p>
            </div>

            <div class="info-section">
              <h3>Categoria</h3>
              <p class="info-text">{{ chamado.categoria }}</p>
            </div>

            <div class="info-section">
              <h3>Prioridade</h3>
              <span :class="['prioridade-badge', prioridadeClass(chamado.prioridade)]">
                <span class="material-icons prioridade-icon">{{ prioridadeIcon(chamado.prioridade) }}</span>
                {{ chamado.prioridade }}
              </span>
            </div>

            <div class="info-section">
              <h3>Imagem</h3>
              <div v-if="chamado.imagem">
                <img :src="chamado.imagem" alt="Imagem do chamado" class="chamado-imagem" />
              </div>
              <p v-else class="info-text">Nenhuma imagem adicionada</p>
            </div>

            <div class="date-info">
              <div class="date-container left">
                <h3 class="date-title">Criado em</h3>
                <p class="info-text date-text">{{ chamado.criadoEm }}</p>
              </div>
              <div class="date-container right">
                <h3 class="date-title">Atualizado em</h3>
                <p class="info-text date-text">{{ chamado.atualizadoEm }}</p>
              </div>
            </div>

            <div class="info-section">
              <h3>Criado por</h3>
              <p class="info-text">{{ chamado.criadoPor.nome }}</p>
              <p class="info-text">{{ chamado.criadoPor.email }}</p>
            </div>
          </div>

          <!-- Card de ações do técnico -->
          <div class="card-summary">
            <h2 class="card-title">Ações do Técnico</h2>
            
            <!-- Seletor para atribuir chamado -->
            <div class="action-section" v-if="chamado.status === 'Aguardando'">
              <h3>Atribuir Chamado</h3>
              <p class="summary-text">Este chamado está aguardando atribuição</p>
              <button class="btn-atribuir" @click="atribuirChamado">
                <span class="material-icons">person_add</span>
                Atribuir para Mim
              </button>
            </div>

            <!-- Ações para chamado em andamento -->
            <div class="action-section" v-else-if="chamado.status === 'Em Andamento'">
              <h3>Gerenciar Chamado</h3>
              <p class="summary-text">Chamado em andamento</p>
              
              <div class="action-buttons">
                <button class="btn-concluir" @click="concluirChamado">
                  <span class="material-icons">check_circle</span>
                  Marcar como Concluído
                </button>
                
                <select v-model="novoStatus" class="status-select" @change="alterarStatus">
                  <option value="">Alterar Status</option>
                  <option value="Aguardando">Aguardando</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <!-- Status do chamado concluído -->
            <div class="action-section" v-else-if="chamado.status === 'Concluído'">
              <h3>Chamado Concluído</h3>
              <p class="summary-text">Este chamado foi finalizado</p>
              <button class="btn-reabrir" @click="reabrirChamado">
                <span class="material-icons">refresh</span>
                Reabrir Chamado
              </button>
            </div>

            <!-- Informações do técnico responsável -->
            <div class="tecnico-info-section">
              <h3>Técnico Responsável</h3>
              <div v-if="chamado.tecnicoResponsavel">
                <p class="summary-item">Nome<br /><span class="summary-text tecnico-text">{{ chamado.tecnicoResponsavel.nome }}</span></p>
                <p class="summary-item">E-mail<br /><span class="summary-text tecnico-text">{{ chamado.tecnicoResponsavel.email }}</span></p>
              </div>
              <p v-else class="summary-text">Aguardando atribuição</p>
            </div>

            <!-- Histórico de ações -->
            <div class="historico-section">
              <h3>Última Ação</h3>
              <p class="summary-text">{{ chamado.ultimaAcao }}</p>
              <p class="info-text timestamp">{{ chamado.dataUltimaAcao }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TecnicoSidebar from '@/components/layouts/tecnicoSidebar.vue'

export default defineComponent({
  name: 'TecnicoChamadoDetalhado',
  components: {
    TecnicoSidebar
  },
  setup() {
    const router = useRouter()
    const novoStatus = ref('')

    const usuario = ref({
      nome: 'Victor Ribeiro',
      email: 'victor@email.com',
      dataNascimento: '15/03/1985',
      cpf: '987.654.321-00',
      endereco: 'Av. Técnica, 456, São Paulo, SP',
      tipoUsuario: 'Técnico',
      foto: '',
    })

    const chamado = ref({
      id: 1024,
      titulo: 'Erro ao acessar o painel administrativo',
      descricao: 'Usuário relata que ao tentar acessar o painel, uma tela de erro 500 é exibida. Foi realizado teste em diferentes navegadores e o problema persiste.',
      categoria: 'Suporte Técnico',
      imagem: '',
      status: 'Aguardando',
      prioridade: 'Alta',
      criadoEm: '10/10/2025 - 14:22',
      atualizadoEm: '11/10/2025 - 09:10',
      criadoPor: { 
        nome: 'Lucas Santino', 
        email: 'lucas@email.com' 
      },
      tecnicoResponsavel: null as { nome: string; email: string } | null,
      ultimaAcao: 'Chamado criado pelo cliente',
      dataUltimaAcao: '10/10/2025 - 14:22'
    })

    const closeProfileMenu = () => {
      // Esta função será chamada no clique da página para fechar o menu de perfil
    }

    const statusClass = (status: string) => {
      const s = status.toLowerCase()
      if (s.includes('concl')) return 'status-concluido'
      if (s.includes('aberto')) return 'status-aberto'
      if (s.includes('aguard')) return 'status-aguardando'
      if (s.includes('andamento')) return 'status-andamento'
      if (s.includes('cancel')) return 'status-cancelado'
      return ''
    }

    const statusIcon = (status: string) => {
      const s = status.toLowerCase()
      if (s.includes('concl')) return 'check_circle'
      if (s.includes('aberto')) return 'radio_button_unchecked'
      if (s.includes('aguard')) return 'hourglass_top'
      if (s.includes('andamento')) return 'autorenew'
      if (s.includes('cancel')) return 'cancel'
      return 'info'
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

    const atribuirChamado = () => {
      chamado.value.status = 'Em Andamento'
      chamado.value.tecnicoResponsavel = {
        nome: usuario.value.nome,
        email: usuario.value.email
      }
      chamado.value.ultimaAcao = 'Chamado atribuído ao técnico'
      chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR')
      chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR')
      
      // Simular ação no backend
      console.log('Chamado atribuído:', chamado.value.id)
    }

    const concluirChamado = () => {
      chamado.value.status = 'Concluído'
      chamado.value.ultimaAcao = 'Chamado concluído pelo técnico'
      chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR')
      chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR')
      
      // Simular ação no backend
      console.log('Chamado concluído:', chamado.value.id)
    }

    const alterarStatus = () => {
      if (novoStatus.value) {
        const statusAnterior = chamado.value.status
        chamado.value.status = novoStatus.value
        chamado.value.ultimaAcao = `Status alterado de "${statusAnterior}" para "${novoStatus.value}"`
        chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR')
        chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR')
        novoStatus.value = ''
        
        // Simular ação no backend
        console.log('Status alterado para:', chamado.value.status)
      }
    }

    const reabrirChamado = () => {
      chamado.value.status = 'Em Andamento'
      chamado.value.ultimaAcao = 'Chamado reaberto pelo técnico'
      chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR')
      chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR')
      
      // Simular ação no backend
      console.log('Chamado reaberto:', chamado.value.id)
    }

    // Simular carregamento dos dados do chamado
    onMounted(() => {
      // Aqui viria a chamada à API para carregar os dados do chamado
      console.log('Carregando dados do chamado...')
    })

    return { 
      chamado,
      usuario,
      novoStatus,
      closeProfileMenu,
      statusClass, 
      statusIcon,
      prioridadeClass,
      prioridadeIcon,
      formatarPrioridade,
      atribuirChamado,
      concluirChamado,
      alterarStatus,
      reabrirChamado
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
.chamado-detalhado-page {
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

/* Título */
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

/* Container dos Cards */
.cards-container {
  display: flex;
  gap: 30px;
  width: 100%;
  margin-bottom: 40px;
}

.card-form {
  flex: 2;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

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
  gap: 20px;
  height: fit-content;
}

/* Header do Card */
.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.chamado-id {
  font-weight: bold;
  color: #000;
  font-size: 16px;
}

.status-badge,
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

.status-icon,
.prioridade-icon {
  font-size: 16px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* CORES DOS STATUS */
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

.chamado-titulo {
  font-size: 20px;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
  text-align: left;
}

/* Seções de Informação */
.info-section {
  text-align: left;
}

.info-section h3,
.date-title {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.info-text,
.date-text {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

.date-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
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

.chamado-imagem {
  margin-top: 8px;
  width: 100%;
  max-height: 320px;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

/* Card Summary - Ações do Técnico */
.card-title {
  color: #000;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 8px;
}

.action-section {
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.action-section:last-of-type {
  border-bottom: none;
}

.action-section h3 {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.summary-text {
  color: #555;
  font-size: 14px;
  margin-bottom: 12px;
}

/* Botões de Ação */
.btn-atribuir,
.btn-concluir,
.btn-reabrir {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
}

.btn-atribuir {
  background-color: #000000;
  color: white;
}

.btn-atribuir:hover {
  background-color: #06357a;
}

.btn-concluir {
  background-color: #065f46;
  color: white;
}

.btn-concluir:hover {
  background-color: #054c35;
}

.btn-reabrir {
  background-color: #856404;
  color: white;
}

.btn-reabrir:hover {
  background-color: #6b5303;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.status-select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fff;
  color: #000;
  transition: border-color 0.2s;
  width: 100%;
}

.status-select:focus {
  outline: none;
  border-color: indigo;
}

/* Informações do Técnico */
.tecnico-info-section {
  width: 100%;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.summary-item {
  color: #888;
  font-size: 14px;
  width: 100%;
  margin-bottom: 8px;
}

.tecnico-text {
  color: #000;
  font-weight: 500;
}

/* Histórico */
.historico-section {
  width: 100%;
}

.timestamp {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
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
  }
}

@media (max-width: 768px) {
  .chamado-detalhado-page {
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
  
  .title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .date-info {
    flex-direction: column;
    gap: 15px;
  }
  
  .date-container.right {
    text-align: left;
  }
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
}
</style>