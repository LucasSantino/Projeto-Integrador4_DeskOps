<template>
  <div class="dashboard-page" @click="closeProfileMenu">
    <!-- Sidebar do Admin -->
    <adm-sidebar />

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
            <div class="metric-value">{{ metrics.totalAtivos }}</div>
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
          <!-- Gráfico de Chamados - BARRAS -->
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Distribuição de Chamados por Status</h3>
            </div>
            <div class="chart-content">
              <canvas ref="chamadosChart"></canvas>
            </div>
          </div>

          <!-- Gráfico de Usuários - PIZZA -->
          <div class="chart-card pie-chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Distribuição de Usuários</h3>
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
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api'

Chart.register(...registerables)

interface Chamado {
  id: number
  title: string
  status: string
  prioridade: string
  update_date: string
  creator?: { name: string; email: string }
  employee?: { name: string; email: string }
}

interface Usuario {
  id: number
  name: string
  email: string
  is_active: boolean
}

interface Ambiente {
  id: number
  name: string
}

interface Ativo {
  id: number
  name: string
}

export default defineComponent({
  name: 'Dashboard',
  components: { AdmSidebar },
  setup() {
    const router = useRouter()
    const auth = useAuthStore()

    const metrics = ref({
      chamadosAbertos: 0,
      chamadosConcluidos: 0,
      chamadosAguardando: 0,
      chamadosAndamento: 0,
      chamadosCancelados: 0,
      totalUsuarios: 0,
      usuariosAtivos: 0,
      totalAmbientes: 0,
      totalAtivos: 0
    })

    const chamadosChart = ref<HTMLCanvasElement>()
    const usuariosChart = ref<HTMLCanvasElement>()
    let chamadosChartInstance: Chart | null = null
    let usuariosChartInstance: Chart | null = null

    const closeProfileMenu = () => {}
    const navigateTo = (route: string) => router.push(route)

    // 🧩 Carregar dados do backend
    const carregarDados = async () => {
      const token = auth.access
      if (!token) {
        router.push('/')
        return
      }

      try {
        // ✅ Chamados
        const chamadosResp = await api.get('/chamados/', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const chamados: Chamado[] = chamadosResp.data.results || chamadosResp.data
        
        // Contagem de status corrigida
        metrics.value.chamadosAbertos = chamados.filter((c: Chamado) => 
          c.status?.toLowerCase().includes('aberto') || 
          c.status?.toLowerCase().includes('open')
        ).length
        
        metrics.value.chamadosConcluidos = chamados.filter((c: Chamado) => 
          c.status?.toLowerCase().includes('concluído') || 
          c.status?.toLowerCase().includes('concluido') ||
          c.status?.toLowerCase().includes('completed')
        ).length
        
        metrics.value.chamadosAguardando = chamados.filter((c: Chamado) => 
          c.status?.toLowerCase().includes('aguardando') || 
          c.status?.toLowerCase().includes('waiting')
        ).length
        
        metrics.value.chamadosAndamento = chamados.filter((c: Chamado) => 
          c.status?.toLowerCase().includes('andamento') || 
          c.status?.toLowerCase().includes('progress')
        ).length
        
        metrics.value.chamadosCancelados = chamados.filter((c: Chamado) => 
          c.status?.toLowerCase().includes('cancelado') || 
          c.status?.toLowerCase().includes('cancelled')
        ).length

        // ✅ Usuários
        const usuariosResp = await api.get('/usuarios/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const usuarios: Usuario[] = usuariosResp.data.results || usuariosResp.data
        metrics.value.totalUsuarios = usuarios.length
        metrics.value.usuariosAtivos = usuarios.filter((u: Usuario) => u.is_active).length

        // ✅ Ambientes
        const ambientesResp = await api.get('/environment/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const ambientes: Ambiente[] = ambientesResp.data.results || ambientesResp.data
        metrics.value.totalAmbientes = ambientes.length

        // ✅ Ativos
        const ativosResp = await api.get('/ativo/', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const ativos: Ativo[] = ativosResp.data.results || ativosResp.data
        metrics.value.totalAtivos = ativos.length

        console.log('✅ Métricas carregadas:', metrics.value)

        // Atualiza gráficos com dados reais
        initCharts()

      } catch (error: any) {
        console.error('❌ Erro ao carregar dados do dashboard:', error)
        if (error.response) {
          console.log('🧩 Código HTTP:', error.response.status)
          console.log('🧩 Dados retornados:', error.response.data)
        }
      }
    }

    // 🎨 Gráficos - COM DADOS REAIS DO BACKEND
    const initCharts = () => {
      // Destruir gráficos existentes
      if (chamadosChartInstance) {
        chamadosChartInstance.destroy()
      }
      if (usuariosChartInstance) {
        usuariosChartInstance.destroy()
      }

      // Gráfico de Chamados - BARRAS COM DADOS REAIS
      if (chamadosChart.value) {
        const ctx = chamadosChart.value.getContext('2d')
        if (ctx) {
          chamadosChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Abertos', 'Concluídos', 'Em Andamento', 'Aguardando', 'Cancelados'],
              datasets: [
                {
                  label: 'Quantidade de Chamados',
                  data: [
                    metrics.value.chamadosAbertos,
                    metrics.value.chamadosConcluidos,
                    metrics.value.chamadosAndamento,
                    metrics.value.chamadosAguardando,
                    metrics.value.chamadosCancelados
                  ],
                  backgroundColor: [
                    '#0f5132', // Aberto
                    '#065f46', // Concluído
                    '#084298', // Em Andamento
                    '#856404', // Aguardando
                    '#842029'  // Cancelado
                  ],
                  borderColor: [
                    '#0a3a24',
                    '#054c38',
                    '#06357a',
                    '#6b5200',
                    '#6a1a21'
                  ],
                  borderWidth: 1,
                  borderRadius: 4
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  mode: 'index',
                  intersect: false
                }
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
                    display: false
                  }
                }
              }
            }
          })
        }
      }

      // Gráfico de Usuários - PIZZA COM DADOS REAIS
      if (usuariosChart.value) {
        const ctx = usuariosChart.value.getContext('2d')
        if (ctx) {
          const usuariosInativos = metrics.value.totalUsuarios - metrics.value.usuariosAtivos
          
          usuariosChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: ['Usuários Ativos', 'Usuários Inativos'],
              datasets: [
                {
                  data: [
                    metrics.value.usuariosAtivos,
                    usuariosInativos
                  ],
                  backgroundColor: [
                    '#1565c0', // Ativos - azul
                    '#dc3545'  // Inativos - vermelho
                  ],
                  borderColor: [
                    '#0d47a1',
                    '#c62828'
                  ],
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
                  align: 'start',
                  labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                      size: 12
                    },
                    boxWidth: 12,
                    boxHeight: 12
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw as number;
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = Math.round((value / total) * 100);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              },
              cutout: '0%'
            }
          })
        }
      }
    }

    onMounted(() => {
      carregarDados()
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
      metrics,
      chamadosChart,
      usuariosChart,
      closeProfileMenu,
      navigateTo
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

/* Card do Gráfico - AMBOS COM MESMA ALTURA */
.chart-card {
  background: #fff;
  padding: 0;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 400px; /* Altura igual para ambos */
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

/* Estilos específicos para o gráfico de pizza */
.pie-chart-card .chart-content {
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);
}

.pie-chart-card .chart-content canvas {
  flex: 1;
  max-height: 320px !important;
  max-width: 320px !important;
  width: auto !important;
  height: auto !important;
  margin: 0 auto;
  align-self: center;
}

/* Ajuste para a legenda no topo e alinhada à esquerda */
.pie-chart-card :deep(.chartjs-render-monitor) {
  margin-top: 10px;
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
    height: 380px;
  }
  
  .pie-chart-card .chart-content canvas {
    max-height: 280px !important;
    max-width: 280px !important;
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
  
  .chart-card {
    height: 350px;
  }
  
  .pie-chart-card .chart-content canvas {
    max-height: 240px !important;
    max-width: 240px !important;
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
  
  .chart-card {
    height: 420px;
  }
  
  .pie-chart-card .chart-content canvas {
    max-height: 340px !important;
    max-width: 340px !important;
  }
}
</style>