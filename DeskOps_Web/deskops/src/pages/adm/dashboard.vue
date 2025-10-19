<template>
  <div class="dashboard-page" @click="closeProfileMenu">
    <!-- Sidebar do Admin -->
    <adm-sidebar :usuario="usuario" />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <h1 class="page-title">Dashboard</h1>

        <!-- Cards de Métricas -->
        <div class="metrics-cards">
          <!-- Chamados -->
          <div class="metric-card clickable" @click="navigateTo('/adm/gestao-chamado')">
            <div class="metric-header">
              <span class="material-icons metric-icon status-aberto">circle</span>
              <h3 class="metric-title">Chamados Abertos</h3>
            </div>
            <div class="metric-value">{{ metrics.chamadosAbertos }}</div>
            <div class="metric-trend positive">
              <span class="material-icons">trending_up</span>
              +12% vs último mês
            </div>
          </div>

          <div class="metric-card clickable" @click="navigateTo('/adm/gestao-chamado')">
            <div class="metric-header">
              <span class="material-icons metric-icon status-concluido">check_circle</span>
              <h3 class="metric-title">Chamados Concluídos</h3>
            </div>
            <div class="metric-value">{{ metrics.chamadosConcluidos }}</div>
            <div class="metric-trend positive">
              <span class="material-icons">trending_up</span>
              +8% vs último mês
            </div>
          </div>

          <div class="metric-card clickable" @click="navigateTo('/adm/gestao-chamado')">
            <div class="metric-header">
              <span class="material-icons metric-icon status-aguardando">hourglass_top</span>
              <h3 class="metric-title">Aguardando</h3>
            </div>
            <div class="metric-value">{{ metrics.chamadosAguardando }}</div>
            <div class="metric-trend negative">
              <span class="material-icons">trending_down</span>
              -5% vs último mês
            </div>
          </div>

          <div class="metric-card clickable" @click="navigateTo('/adm/gestao-chamado')">
            <div class="metric-header">
              <span class="material-icons metric-icon status-andamento">autorenew</span>
              <h3 class="metric-title">Em Andamento</h3>
            </div>
            <div class="metric-value">{{ metrics.chamadosAndamento }}</div>
            <div class="metric-trend positive">
              <span class="material-icons">trending_up</span>
              +15% vs último mês
            </div>
          </div>

          <div class="metric-card clickable" @click="navigateTo('/adm/gestao-chamado')">
            <div class="metric-header">
              <span class="material-icons metric-icon status-cancelado">cancel</span>
              <h3 class="metric-title">Cancelados</h3>
            </div>
            <div class="metric-value">{{ metrics.chamadosCancelados }}</div>
            <div class="metric-trend negative">
              <span class="material-icons">trending_down</span>
              -3% vs último mês
            </div>
          </div>

          <div class="metric-card clickable" @click="navigateTo('/adm/gestao-usuarios')">
            <div class="metric-header">
              <span class="material-icons metric-icon icon-usuarios">people</span>
              <h3 class="metric-title">Total de Usuários</h3>
            </div>
            <div class="metric-value">{{ metrics.totalUsuarios }}</div>
            <div class="metric-trend positive">
              <span class="material-icons">trending_up</span>
              +5% vs último mês
            </div>
          </div>

          <div class="metric-card clickable" @click="navigateTo('/adm/gestao-ativos')">
            <div class="metric-header">
              <span class="material-icons metric-icon icon-ativos">inventory</span>
              <h3 class="metric-title">Ativos</h3>
            </div>
            <div class="metric-value">{{ metrics.usuariosAtivos }}</div>
            <div class="metric-trend positive">
              <span class="material-icons">trending_up</span>
              +7% vs último mês
            </div>
          </div>

          <div class="metric-card clickable" @click="navigateTo('/adm/gestao-ambiente')">
            <div class="metric-header">
              <span class="material-icons metric-icon icon-ambientes">apartment</span>
              <h3 class="metric-title">Ambientes</h3>
            </div>
            <div class="metric-value">{{ metrics.totalAmbientes }}</div>
            <div class="metric-trend positive">
              <span class="material-icons">trending_up</span>
              +10% vs último mês
            </div>
          </div>
        </div>

        <!-- Gráficos -->
        <div class="charts-container">
          <!-- Gráfico de Chamados -->
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Chamados por Status (Últimos 30 dias)</h3>
            </div>
            <div class="chart-content">
              <canvas ref="chamadosChart"></canvas>
            </div>
          </div>

          <!-- Gráfico de Usuários -->
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Usuários Ativos (Últimos 30 dias)</h3>
            </div>
            <div class="chart-content">
              <canvas ref="usuariosChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useRouter } from 'vue-router'
import AdmSidebar from '@/components/layouts/admSidebar.vue'

Chart.register(...registerables)

export default defineComponent({
  name: 'Dashboard',
  components: {
    AdmSidebar
  },
  setup() {
    const router = useRouter()
    
    const usuario = ref({
      nome: 'Administrador',
      email: 'admin@deskops.com',
      dataNascimento: '10/05/1980',
      cpf: '111.222.333-44',
      endereco: 'Av. Principal, 1000, São Paulo, SP',
      tipoUsuario: 'Administrador',
      foto: '', 
    })

    const metrics = ref({
      chamadosAbertos: 24,
      chamadosConcluidos: 156,
      chamadosAguardando: 8,
      chamadosAndamento: 12,
      chamadosCancelados: 5,
      totalUsuarios: 342,
      usuariosAtivos: 289,
      totalAmbientes: 47
    })

    const chamadosChart = ref<HTMLCanvasElement>()
    const usuariosChart = ref<HTMLCanvasElement>()
    let chamadosChartInstance: Chart | null = null
    let usuariosChartInstance: Chart | null = null

    const closeProfileMenu = () => {
      // Esta função será chamada no clique da página para fechar o menu de perfil
    }

    const navigateTo = (route: string) => {
      router.push(route)
    }

    const initCharts = () => {
      // Destruir gráficos existentes
      if (chamadosChartInstance) {
        chamadosChartInstance.destroy()
      }
      if (usuariosChartInstance) {
        usuariosChartInstance.destroy()
      }

      // Gráfico de Chamados - COM TODOS OS STATUS
      if (chamadosChart.value) {
        const ctx = chamadosChart.value.getContext('2d')
        if (ctx) {
          chamadosChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['1', '5', '10', '15', '20', '25', '30'],
              datasets: [
                {
                  label: 'Abertos',
                  data: [8, 12, 6, 15, 10, 8, 12],
                  borderColor: '#0f5132',
                  backgroundColor: 'rgba(209, 231, 221, 0.1)',
                  tension: 0.4,
                  fill: true,
                  borderWidth: 2
                },
                {
                  label: 'Concluídos',
                  data: [20, 25, 30, 22, 28, 35, 40],
                  borderColor: '#065f46',
                  backgroundColor: 'rgba(209, 250, 229, 0.1)',
                  tension: 0.4,
                  fill: true,
                  borderWidth: 2
                },
                {
                  label: 'Em Andamento',
                  data: [5, 8, 6, 10, 12, 8, 6],
                  borderColor: '#084298',
                  backgroundColor: 'rgba(207, 226, 255, 0.1)',
                  tension: 0.4,
                  fill: true,
                  borderWidth: 2
                },
                {
                  label: 'Aguardando',
                  data: [3, 5, 8, 6, 4, 7, 5],
                  borderColor: '#856404',
                  backgroundColor: 'rgba(255, 243, 205, 0.1)',
                  tension: 0.4,
                  fill: true,
                  borderWidth: 2
                },
                {
                  label: 'Cancelados',
                  data: [1, 2, 1, 3, 2, 1, 2],
                  borderColor: '#842029',
                  backgroundColor: 'rgba(248, 215, 218, 0.1)',
                  tension: 0.4,
                  fill: true,
                  borderWidth: 2
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    usePointStyle: true,
                    padding: 15
                  }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false
                }
              },
              interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  },
                  title: {
                    display: true,
                    text: 'Quantidade de Chamados'
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  },
                  title: {
                    display: true,
                    text: 'Dias do Mês'
                  }
                }
              }
            }
          })
        }
      }

      // Gráfico de Usuários
      if (usuariosChart.value) {
        const ctx = usuariosChart.value.getContext('2d')
        if (ctx) {
          usuariosChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['1', '5', '10', '15', '20', '25', '30'],
              datasets: [
                {
                  label: 'Usuários Ativos',
                  data: [250, 265, 270, 275, 280, 285, 289],
                  borderColor: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  tension: 0.4,
                  fill: true,
                  borderWidth: 2
                },
                {
                  label: 'Novos Usuários',
                  data: [5, 8, 3, 6, 4, 7, 5],
                  borderColor: '#ec4899',
                  backgroundColor: 'rgba(236, 72, 153, 0.1)',
                  tension: 0.4,
                  fill: true,
                  borderWidth: 2
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    usePointStyle: true,
                    padding: 15
                  }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false
                }
              },
              interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  },
                  title: {
                    display: true,
                    text: 'Quantidade de Usuários'
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  },
                  title: {
                    display: true,
                    text: 'Dias do Mês'
                  }
                }
              }
            }
          })
        }
      }
    }

    onMounted(() => {
      // Pequeno delay para garantir que o DOM esteja pronto
      setTimeout(initCharts, 100)
    })

    onUnmounted(() => {
      if (chamadosChartInstance) {
        chamadosChartInstance.destroy()
      }
      if (usuariosChartInstance) {
        usuariosChartInstance.destroy()
      }
    })

    return { 
      usuario,
      metrics,
      chamadosChart,
      usuariosChart,
      closeProfileMenu,
      navigateTo
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
.dashboard-page {
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

/* Título da página */
.page-title {
  color: indigo;
  font-size: 28px;
  font-weight: bold;
  padding: 50px 0 25px 0;
  margin: 0;
  width: 100%;
  text-align: left;
}

/* Container dos Cards de Métricas */
.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  width: 100%;
}

/* Card de Métrica */
.metric-card {
  background: #fff;
  padding: 20px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.metric-card.clickable {
  cursor: pointer;
}

.metric-card.clickable:hover {
  border-color: indigo;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.metric-icon {
  font-size: 24px;
  border-radius: 6px;
  padding: 4px;
}

.metric-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0;
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  color: #000;
  margin-bottom: 10px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
}

.metric-trend.positive {
  color: #065f46;
}

.metric-trend.negative {
  color: #842029;
}

.metric-trend .material-icons {
  font-size: 16px;
}

/* CORES DOS STATUS - IGUAL À IMAGEM ORIGINAL */
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

/* NOVAS CORES PARA OS ÍCONES DE USUÁRIOS E AMBIENTES */
.icon-usuarios {
  background-color: #e3f2fd;
  color: #1565c0;
}

.icon-ativos {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.icon-ambientes {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

/* Container dos Gráficos */
.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  width: 100%;
  margin-bottom: 40px;
}

/* Card do Gráfico */
.chart-card {
  background: #fff;
  padding: 0;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 400px;
}

.chart-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.chart-title {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  text-align: left;
}

.chart-content {
  flex: 1;
  padding: 20px;
  position: relative;
}

.chart-content canvas {
  width: 100% !important;
  height: 100% !important;
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
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .metrics-cards {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-page {
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
  
  .metrics-cards {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .chart-card {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .content-area {
    padding: 0 15px;
  }
  
  .metric-card {
    padding: 15px;
  }
  
  .metric-value {
    font-size: 28px;
  }
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
  
  .metrics-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>