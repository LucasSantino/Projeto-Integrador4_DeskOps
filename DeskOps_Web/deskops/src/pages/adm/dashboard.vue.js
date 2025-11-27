import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useRouter } from 'vue-router';
import AdmSidebar from '@/components/layouts/admSidebar.vue';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
Chart.register(...registerables);
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'Dashboard',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
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
        });
        const chamadosChart = ref();
        const usuariosChart = ref();
        let chamadosChartInstance = null;
        let usuariosChartInstance = null;
        const closeProfileMenu = () => { };
        const navigateTo = (route) => router.push(route);
        // 🧩 Carregar dados do backend
        const carregarDados = async () => {
            const token = auth.access;
            if (!token) {
                router.push('/');
                return;
            }
            try {
                // ✅ Chamados
                const chamadosResp = await api.get('/chamados/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const chamados = chamadosResp.data.results || chamadosResp.data;
                // Contagem de status corrigida
                metrics.value.chamadosAbertos = chamados.filter((c) => c.status?.toLowerCase().includes('aberto') ||
                    c.status?.toLowerCase().includes('open')).length;
                metrics.value.chamadosConcluidos = chamados.filter((c) => c.status?.toLowerCase().includes('concluído') ||
                    c.status?.toLowerCase().includes('concluido') ||
                    c.status?.toLowerCase().includes('completed')).length;
                metrics.value.chamadosAguardando = chamados.filter((c) => c.status?.toLowerCase().includes('aguardando') ||
                    c.status?.toLowerCase().includes('waiting')).length;
                metrics.value.chamadosAndamento = chamados.filter((c) => c.status?.toLowerCase().includes('andamento') ||
                    c.status?.toLowerCase().includes('progress')).length;
                metrics.value.chamadosCancelados = chamados.filter((c) => c.status?.toLowerCase().includes('cancelado') ||
                    c.status?.toLowerCase().includes('cancelled')).length;
                // ✅ Usuários
                const usuariosResp = await api.get('/usuarios/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const usuarios = usuariosResp.data.results || usuariosResp.data;
                metrics.value.totalUsuarios = usuarios.length;
                metrics.value.usuariosAtivos = usuarios.filter((u) => u.is_active).length;
                // ✅ Ambientes
                const ambientesResp = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const ambientes = ambientesResp.data.results || ambientesResp.data;
                metrics.value.totalAmbientes = ambientes.length;
                // ✅ Ativos
                const ativosResp = await api.get('/ativo/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const ativos = ativosResp.data.results || ativosResp.data;
                metrics.value.totalAtivos = ativos.length;
                console.log('✅ Métricas carregadas:', metrics.value);
                // Atualiza gráficos com dados reais
                initCharts();
            }
            catch (error) {
                console.error('❌ Erro ao carregar dados do dashboard:', error);
                if (error.response) {
                    console.log('🧩 Código HTTP:', error.response.status);
                    console.log('🧩 Dados retornados:', error.response.data);
                }
            }
        };
        // 🎨 Gráficos - COM DADOS REAIS DO BACKEND
        const initCharts = () => {
            // Destruir gráficos existentes
            if (chamadosChartInstance) {
                chamadosChartInstance.destroy();
            }
            if (usuariosChartInstance) {
                usuariosChartInstance.destroy();
            }
            // Gráfico de Chamados - BARRAS COM DADOS REAIS
            if (chamadosChart.value) {
                const ctx = chamadosChart.value.getContext('2d');
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
                                        '#842029' // Cancelado
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
                    });
                }
            }
            // Gráfico de Usuários - PIZZA COM DADOS REAIS
            if (usuariosChart.value) {
                const ctx = usuariosChart.value.getContext('2d');
                if (ctx) {
                    const usuariosInativos = metrics.value.totalUsuarios - metrics.value.usuariosAtivos;
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
                                        '#dc3545' // Inativos - vermelho
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
                                        label: function (context) {
                                            const label = context.label || '';
                                            const value = context.raw;
                                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                            const percentage = Math.round((value / total) * 100);
                                            return `${label}: ${value} (${percentage}%)`;
                                        }
                                    }
                                }
                            },
                            cutout: '0%'
                        }
                    });
                }
            }
        };
        onMounted(() => {
            carregarDados();
        });
        onUnmounted(() => {
            if (chamadosChartInstance) {
                chamadosChartInstance.destroy();
            }
            if (usuariosChartInstance) {
                usuariosChartInstance.destroy();
            }
        });
        return {
            metrics,
            chamadosChart,
            usuariosChart,
            closeProfileMenu,
            navigateTo
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'Dashboard',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
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
        });
        const chamadosChart = ref();
        const usuariosChart = ref();
        let chamadosChartInstance = null;
        let usuariosChartInstance = null;
        const closeProfileMenu = () => { };
        const navigateTo = (route) => router.push(route);
        // 🧩 Carregar dados do backend
        const carregarDados = async () => {
            const token = auth.access;
            if (!token) {
                router.push('/');
                return;
            }
            try {
                // ✅ Chamados
                const chamadosResp = await api.get('/chamados/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const chamados = chamadosResp.data.results || chamadosResp.data;
                // Contagem de status corrigida
                metrics.value.chamadosAbertos = chamados.filter((c) => c.status?.toLowerCase().includes('aberto') ||
                    c.status?.toLowerCase().includes('open')).length;
                metrics.value.chamadosConcluidos = chamados.filter((c) => c.status?.toLowerCase().includes('concluído') ||
                    c.status?.toLowerCase().includes('concluido') ||
                    c.status?.toLowerCase().includes('completed')).length;
                metrics.value.chamadosAguardando = chamados.filter((c) => c.status?.toLowerCase().includes('aguardando') ||
                    c.status?.toLowerCase().includes('waiting')).length;
                metrics.value.chamadosAndamento = chamados.filter((c) => c.status?.toLowerCase().includes('andamento') ||
                    c.status?.toLowerCase().includes('progress')).length;
                metrics.value.chamadosCancelados = chamados.filter((c) => c.status?.toLowerCase().includes('cancelado') ||
                    c.status?.toLowerCase().includes('cancelled')).length;
                // ✅ Usuários
                const usuariosResp = await api.get('/usuarios/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const usuarios = usuariosResp.data.results || usuariosResp.data;
                metrics.value.totalUsuarios = usuarios.length;
                metrics.value.usuariosAtivos = usuarios.filter((u) => u.is_active).length;
                // ✅ Ambientes
                const ambientesResp = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const ambientes = ambientesResp.data.results || ambientesResp.data;
                metrics.value.totalAmbientes = ambientes.length;
                // ✅ Ativos
                const ativosResp = await api.get('/ativo/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const ativos = ativosResp.data.results || ativosResp.data;
                metrics.value.totalAtivos = ativos.length;
                console.log('✅ Métricas carregadas:', metrics.value);
                // Atualiza gráficos com dados reais
                initCharts();
            }
            catch (error) {
                console.error('❌ Erro ao carregar dados do dashboard:', error);
                if (error.response) {
                    console.log('🧩 Código HTTP:', error.response.status);
                    console.log('🧩 Dados retornados:', error.response.data);
                }
            }
        };
        // 🎨 Gráficos - COM DADOS REAIS DO BACKEND
        const initCharts = () => {
            // Destruir gráficos existentes
            if (chamadosChartInstance) {
                chamadosChartInstance.destroy();
            }
            if (usuariosChartInstance) {
                usuariosChartInstance.destroy();
            }
            // Gráfico de Chamados - BARRAS COM DADOS REAIS
            if (chamadosChart.value) {
                const ctx = chamadosChart.value.getContext('2d');
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
                                        '#842029' // Cancelado
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
                    });
                }
            }
            // Gráfico de Usuários - PIZZA COM DADOS REAIS
            if (usuariosChart.value) {
                const ctx = usuariosChart.value.getContext('2d');
                if (ctx) {
                    const usuariosInativos = metrics.value.totalUsuarios - metrics.value.usuariosAtivos;
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
                                        '#dc3545' // Inativos - vermelho
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
                                        label: function (context) {
                                            const label = context.label || '';
                                            const value = context.raw;
                                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                            const percentage = Math.round((value / total) * 100);
                                            return `${label}: ${value} (${percentage}%)`;
                                        }
                                    }
                                }
                            },
                            cutout: '0%'
                        }
                    });
                }
            }
        };
        onMounted(() => {
            carregarDados();
        });
        onUnmounted(() => {
            if (chamadosChartInstance) {
                chamadosChartInstance.destroy();
            }
            if (usuariosChartInstance) {
                usuariosChartInstance.destroy();
            }
        });
        return {
            metrics,
            chamadosChart,
            usuariosChart,
            closeProfileMenu,
            navigateTo
        };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { AdmSidebar };
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-content']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-content']} */ ;
/** @type {__VLS_StyleScopedClasses['pie-chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-content']} */ ;
/** @type {__VLS_StyleScopedClasses['pie-chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['charts-container']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-cards']} */ ;
/** @type {__VLS_StyleScopedClasses['dashboard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-cards']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pie-chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pie-chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-cards']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pie-chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-content']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "dashboard-page" },
});
// @ts-ignore
[closeProfileMenu,];
const __VLS_0 = {}.AdmSidebar;
/** @type {[typeof __VLS_components.AdmSidebar, typeof __VLS_components.admSidebar, ]} */ ;
// @ts-ignore
AdmSidebar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)({
    ...{ class: "main-content" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "content-area" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metrics-cards" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/adm/gestao-chamado');
            // @ts-ignore
            [navigateTo,];
        } },
    ...{ class: "metric-card clickable" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-header" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons metric-icon status-aberto" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "metric-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-value" },
});
(__VLS_ctx.metrics.chamadosAbertos);
// @ts-ignore
[metrics,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-trend positive" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/adm/gestao-chamado');
            // @ts-ignore
            [navigateTo,];
        } },
    ...{ class: "metric-card clickable" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-header" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons metric-icon status-concluido" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "metric-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-value" },
});
(__VLS_ctx.metrics.chamadosConcluidos);
// @ts-ignore
[metrics,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-trend positive" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/adm/gestao-chamado');
            // @ts-ignore
            [navigateTo,];
        } },
    ...{ class: "metric-card clickable" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-header" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons metric-icon status-aguardando" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "metric-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-value" },
});
(__VLS_ctx.metrics.chamadosAguardando);
// @ts-ignore
[metrics,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-trend negative" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/adm/gestao-chamado');
            // @ts-ignore
            [navigateTo,];
        } },
    ...{ class: "metric-card clickable" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-header" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons metric-icon status-andamento" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "metric-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-value" },
});
(__VLS_ctx.metrics.chamadosAndamento);
// @ts-ignore
[metrics,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-trend positive" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/adm/gestao-chamado');
            // @ts-ignore
            [navigateTo,];
        } },
    ...{ class: "metric-card clickable" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-header" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons metric-icon status-cancelado" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "metric-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-value" },
});
(__VLS_ctx.metrics.chamadosCancelados);
// @ts-ignore
[metrics,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-trend negative" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/adm/gestao-usuarios');
            // @ts-ignore
            [navigateTo,];
        } },
    ...{ class: "metric-card clickable" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-header" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons metric-icon icon-usuarios" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "metric-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-value" },
});
(__VLS_ctx.metrics.totalUsuarios);
// @ts-ignore
[metrics,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-trend positive" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/adm/gestao-ativos');
            // @ts-ignore
            [navigateTo,];
        } },
    ...{ class: "metric-card clickable" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-header" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons metric-icon icon-ativos" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "metric-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-value" },
});
(__VLS_ctx.metrics.totalAtivos);
// @ts-ignore
[metrics,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-trend positive" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.navigateTo('/adm/gestao-ambiente');
            // @ts-ignore
            [navigateTo,];
        } },
    ...{ class: "metric-card clickable" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-header" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons metric-icon icon-ambientes" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "metric-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-value" },
});
(__VLS_ctx.metrics.totalAmbientes);
// @ts-ignore
[metrics,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "metric-trend positive" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "charts-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "chart-card" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "chart-header" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "chart-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "chart-content" },
});
__VLS_asFunctionalElement(__VLS_elements.canvas, __VLS_elements.canvas)({
    ref: "chamadosChart",
});
/** @type {typeof __VLS_ctx.chamadosChart} */ ;
// @ts-ignore
[chamadosChart,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "chart-card pie-chart-card" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "chart-header" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "chart-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "chart-content" },
});
__VLS_asFunctionalElement(__VLS_elements.canvas, __VLS_elements.canvas)({
    ref: "usuariosChart",
});
/** @type {typeof __VLS_ctx.usuariosChart} */ ;
// @ts-ignore
[usuariosChart,];
/** @type {__VLS_StyleScopedClasses['dashboard-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metrics-cards']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['status-aberto']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['positive']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['status-concluido']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['positive']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['status-aguardando']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['negative']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['status-andamento']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['positive']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['status-cancelado']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['negative']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-usuarios']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['positive']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-ativos']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['positive']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-card']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['icon-ambientes']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-title']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-value']} */ ;
/** @type {__VLS_StyleScopedClasses['metric-trend']} */ ;
/** @type {__VLS_StyleScopedClasses['positive']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['charts-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-content']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['pie-chart-card']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-header']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-title']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-content']} */ ;
export default {};
//# sourceMappingURL=dashboard.vue.js.map