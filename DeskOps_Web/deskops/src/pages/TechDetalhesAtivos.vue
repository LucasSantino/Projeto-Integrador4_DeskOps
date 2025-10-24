<template>
  <div class="detalhes-ativo-page">
    <!-- CONTEÚDO PRINCIPAL - SEM SIDEBAR -->
    <main class="main-content full-width">
      <div class="content-area">
        <!-- Header Simples -->
        <div class="tech-header">
          <div class="logo-section">
            <div class="logo">
              <span class="material-icons">qr_code_2</span>
              <span class="logo-text">DeskOps</span>
            </div>
            <p class="system-label">Consulta de Ativo via QR Code</p>
          </div>
          <button class="btn-fechar" @click="fecharPagina">
            <span class="material-icons">close</span>
            Fechar
          </button>
        </div>

        <!-- Título -->
        <div class="title-container">
          <h1 class="page-title">Informações do Ativo</h1>
        </div>

        <div class="cards-container">
          <!-- Card do ativo (MAIOR) - MESMO LAYOUT -->
          <div class="card-form full-card">
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
                <h3 class="date-title">Data de Criação</h3>
                <p class="info-text date-text">{{ ativo.criadoEm }}</p>
              </div>
              <div class="date-container right">
                <h3 class="date-title">Última Atualização</h3>
                <p class="info-text date-text">{{ ativo.atualizadoEm }}</p>
              </div>
            </div>
          </div>

          <!-- Card de informações rápidas (MENOR) - SEM BOTÕES -->
          <div class="card-summary">
            <h2 class="card-title">Informações Rápidas</h2>
            
            <div class="info-rapida">
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
                <span class="info-label">ID QR Code:</span>
                <span class="info-value">{{ ativo.qrCode }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

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
  name: 'TechDetalhesAtivos',
  setup() {
    // Dados mockados - mesma estrutura do DetalhesAtivos.vue
    const ativo = ref<Ativo>({
      id: 3001,
      nome: 'Notebook Dell Latitude 5420',
      descricao: 'Notebook corporativo para desenvolvimento, equipado com 16GB RAM, SSD 512GB e processador Intel i7.',
      ambiente: {
        id: 2,
        nome: 'Laboratório de TI',
        localizacao: 'Andar 2'
      },
      status: 'ativo',
      qrCode: 'QR001',
      criadoEm: '10/10/2025 - 14:22',
      atualizadoEm: '11/10/2025 - 09:10'
    })

    const statusClass = (status: string) => {
      switch (status) {
        case 'ativo': return 'status-ativo'
        case 'manutencao': return 'status-manutencao'
        default: return ''
      }
    }

    const statusIcon = (status: string) => {
      switch (status) {
        case 'ativo': return 'check_circle'
        case 'manutencao': return 'build'
        default: return ''
      }
    }

    const formatarStatus = (status: string) => {
      switch (status) {
        case 'ativo': return 'Ativo'
        case 'manutencao': return 'Em Manutenção'
        default: return status
      }
    }

    const fecharPagina = () => {
      // Fecha a aba ou volta para a página anterior
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.close()
      }
    }

    return { 
      ativo,
      statusClass,
      statusIcon,
      formatarStatus,
      fecharPagina
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

/* CONTEÚDO PRINCIPAL - LAYOUT FULLSCREEN (SEM SIDEBAR) */
.main-content.full-width {
  flex: 1;
  background-color: #fff;
  margin-left: 0;
  width: 100vw;
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

/* Header para técnico */
.tech-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 0 0 0;
  margin-bottom: 10px;
  width: 100%;
}

.logo-section {
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: bold;
  color: indigo;
  margin-bottom: 4px;
}

.logo-text {
  font-size: 24px;
}

.system-label {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.btn-fechar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #dc2626;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-fechar:hover {
  background-color: #b91c1c;
}

.btn-fechar .material-icons {
  font-size: 18px;
  color: inherit;
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
  gap: 20px;
  min-height: 500px;
}

.card-form.full-card {
  flex: 2;
}

/* Card de informações - MENOR (flex: 1) */
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
  margin-bottom: 10px;
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
  margin-top: auto;
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

/* Card Summary */
.card-title {
  color: #000;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 8px;
  width: 100%;
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

/* RESPONSIVIDADE */
@media (max-width: 1024px) {
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
  
  .main-content.full-width {
    width: 100%;
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
  
  .tech-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 20px 0 0 0;
  }
  
  .date-info {
    flex-direction: column;
    gap: 15px;
  }
  
  .date-container.right {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .content-area {
    padding: 0 15px;
  }
  
  .card-form,
  .card-summary {
    padding: 20px;
  }
  
  .tech-header {
    padding: 15px 0 0 0;
  }
  
  .logo {
    font-size: 20px;
  }
  
  .logo-text {
    font-size: 20px;
  }
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
}
</style>