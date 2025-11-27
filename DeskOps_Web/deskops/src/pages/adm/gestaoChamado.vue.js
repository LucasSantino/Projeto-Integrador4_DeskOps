import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdmSidebar from '@/components/layouts/admSidebar.vue';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'GestaoChamados',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const filtroStatus = ref('todos');
        const filtroPrioridade = ref('todos');
        const filtroTecnico = ref('todos');
        const ordemExibicao = ref('recente');
        const pesquisa = ref('');
        const chamados = ref([]);
        // ✅ Buscar todos os chamados
        const carregarChamados = async () => {
            try {
                const token = auth.access;
                if (!token) {
                    router.push('/');
                    return;
                }
                const response = await api.get('/chamados/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data.results || response.data;
                chamados.value = data.map((c) => ({
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
                }));
                console.log('✅ Chamados carregados (Admin):', chamados.value);
            }
            catch (error) {
                console.error('❌ Erro ao carregar chamados:', error.response?.data || error);
                if (error.response?.status === 401) {
                    alert('Sessão expirada. Faça login novamente.');
                    router.push('/');
                }
            }
        };
        onMounted(() => {
            carregarChamados();
        });
        // ✅ Técnicos únicos para filtro
        const tecnicosUnicos = computed(() => {
            const nomes = chamados.value
                .map((c) => c.employee?.name)
                .filter((n) => !!n);
            return [...new Set(nomes)];
        });
        // ✅ Filtro e ordenação - CORRIGIDO
        const filtrados = computed(() => {
            return chamados.value.filter((c) => {
                // Filtro de Status - CORRIGIDO
                let matchStatus = true;
                if (filtroStatus.value !== 'todos') {
                    const statusChamado = c.status?.toLowerCase() || '';
                    const statusFiltro = filtroStatus.value.toLowerCase();
                    // Mapeamento correto dos status
                    if (statusFiltro === 'em andamento') {
                        matchStatus = statusChamado.includes('andamento') || statusChamado.includes('em andamento');
                    }
                    else if (statusFiltro === 'aguardando_atendimento') {
                        matchStatus = statusChamado.includes('aguardando');
                    }
                    else if (statusFiltro === 'concluido') {
                        matchStatus = statusChamado.includes('concluído') || statusChamado.includes('concluido');
                    }
                    else {
                        matchStatus = statusChamado.includes(statusFiltro);
                    }
                }
                // Filtro de Prioridade
                const matchPrioridade = filtroPrioridade.value === 'todos' ||
                    (c.prioridade || '').toLowerCase() === filtroPrioridade.value.toLowerCase();
                // Filtro de Técnico
                const matchTecnico = filtroTecnico.value === 'todos' ||
                    (c.employee?.name || '').toLowerCase().includes(filtroTecnico.value.toLowerCase());
                // Filtro de Pesquisa
                const matchPesquisa = (c.title || '').toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    (c.creator?.name || '').toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    (c.employee?.name || '').toLowerCase().includes(pesquisa.value.toLowerCase());
                return matchStatus && matchPrioridade && matchTecnico && matchPesquisa;
            });
        });
        const chamadosOrdenados = computed(() => {
            const lista = [...filtrados.value];
            if (ordemExibicao.value === 'recente') {
                return lista.sort((a, b) => new Date(b.update_date).getTime() - new Date(a.update_date).getTime());
            }
            else {
                return lista.sort((a, b) => new Date(a.update_date).getTime() - new Date(b.update_date).getTime());
            }
        });
        // ✅ Classes e ícones - MANTIDO IGUAL AO CÓDIGO ORIGINAL
        const statusClass = (status) => {
            const statusLower = status.toLowerCase();
            if (statusLower.includes('concluído') || statusLower.includes('concluido'))
                return 'status-concluido';
            if (statusLower.includes('aberto'))
                return 'status-aberto';
            if (statusLower.includes('aguardando'))
                return 'status-aguardando';
            if (statusLower.includes('andamento'))
                return 'status-andamento';
            if (statusLower.includes('cancelado'))
                return 'status-cancelado';
            return '';
        };
        const statusIcon = (status) => {
            const statusLower = status.toLowerCase();
            if (statusLower.includes('concluído') || statusLower.includes('concluido'))
                return 'check_circle';
            if (statusLower.includes('aberto'))
                return 'circle';
            if (statusLower.includes('aguardando'))
                return 'hourglass_top';
            if (statusLower.includes('andamento'))
                return 'autorenew';
            if (statusLower.includes('cancelado'))
                return 'cancel';
            return 'help_outline';
        };
        const prioridadeClass = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'prioridade-alta';
                case 'media': return 'prioridade-media';
                case 'baixa': return 'prioridade-baixa';
                default: return '';
            }
        };
        const prioridadeIcon = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'arrow_upward';
                case 'media': return 'remove';
                case 'baixa': return 'arrow_downward';
                default: return '';
            }
        };
        const formatarPrioridade = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'Alta';
                case 'media': return 'Média';
                case 'baixa': return 'Baixa';
                default: return prioridade;
            }
        };
        const formatarStatus = (status) => {
            const statusLower = status.toLowerCase();
            if (statusLower.includes('aguardando'))
                return 'Aguardando';
            if (statusLower.includes('andamento'))
                return 'Em Andamento';
            if (statusLower.includes('concluído') || statusLower.includes('concluido'))
                return 'Concluído';
            if (statusLower.includes('aberto'))
                return 'Aberto';
            if (statusLower.includes('cancelado'))
                return 'Cancelado';
            return status.charAt(0).toUpperCase() + status.slice(1);
        };
        const closeProfileMenu = () => { };
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
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'GestaoChamados',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const filtroStatus = ref('todos');
        const filtroPrioridade = ref('todos');
        const filtroTecnico = ref('todos');
        const ordemExibicao = ref('recente');
        const pesquisa = ref('');
        const chamados = ref([]);
        // ✅ Buscar todos os chamados
        const carregarChamados = async () => {
            try {
                const token = auth.access;
                if (!token) {
                    router.push('/');
                    return;
                }
                const response = await api.get('/chamados/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data.results || response.data;
                chamados.value = data.map((c) => ({
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
                }));
                console.log('✅ Chamados carregados (Admin):', chamados.value);
            }
            catch (error) {
                console.error('❌ Erro ao carregar chamados:', error.response?.data || error);
                if (error.response?.status === 401) {
                    alert('Sessão expirada. Faça login novamente.');
                    router.push('/');
                }
            }
        };
        onMounted(() => {
            carregarChamados();
        });
        // ✅ Técnicos únicos para filtro
        const tecnicosUnicos = computed(() => {
            const nomes = chamados.value
                .map((c) => c.employee?.name)
                .filter((n) => !!n);
            return [...new Set(nomes)];
        });
        // ✅ Filtro e ordenação - CORRIGIDO
        const filtrados = computed(() => {
            return chamados.value.filter((c) => {
                // Filtro de Status - CORRIGIDO
                let matchStatus = true;
                if (filtroStatus.value !== 'todos') {
                    const statusChamado = c.status?.toLowerCase() || '';
                    const statusFiltro = filtroStatus.value.toLowerCase();
                    // Mapeamento correto dos status
                    if (statusFiltro === 'em andamento') {
                        matchStatus = statusChamado.includes('andamento') || statusChamado.includes('em andamento');
                    }
                    else if (statusFiltro === 'aguardando_atendimento') {
                        matchStatus = statusChamado.includes('aguardando');
                    }
                    else if (statusFiltro === 'concluido') {
                        matchStatus = statusChamado.includes('concluído') || statusChamado.includes('concluido');
                    }
                    else {
                        matchStatus = statusChamado.includes(statusFiltro);
                    }
                }
                // Filtro de Prioridade
                const matchPrioridade = filtroPrioridade.value === 'todos' ||
                    (c.prioridade || '').toLowerCase() === filtroPrioridade.value.toLowerCase();
                // Filtro de Técnico
                const matchTecnico = filtroTecnico.value === 'todos' ||
                    (c.employee?.name || '').toLowerCase().includes(filtroTecnico.value.toLowerCase());
                // Filtro de Pesquisa
                const matchPesquisa = (c.title || '').toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    (c.creator?.name || '').toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    (c.employee?.name || '').toLowerCase().includes(pesquisa.value.toLowerCase());
                return matchStatus && matchPrioridade && matchTecnico && matchPesquisa;
            });
        });
        const chamadosOrdenados = computed(() => {
            const lista = [...filtrados.value];
            if (ordemExibicao.value === 'recente') {
                return lista.sort((a, b) => new Date(b.update_date).getTime() - new Date(a.update_date).getTime());
            }
            else {
                return lista.sort((a, b) => new Date(a.update_date).getTime() - new Date(b.update_date).getTime());
            }
        });
        // ✅ Classes e ícones - MANTIDO IGUAL AO CÓDIGO ORIGINAL
        const statusClass = (status) => {
            const statusLower = status.toLowerCase();
            if (statusLower.includes('concluído') || statusLower.includes('concluido'))
                return 'status-concluido';
            if (statusLower.includes('aberto'))
                return 'status-aberto';
            if (statusLower.includes('aguardando'))
                return 'status-aguardando';
            if (statusLower.includes('andamento'))
                return 'status-andamento';
            if (statusLower.includes('cancelado'))
                return 'status-cancelado';
            return '';
        };
        const statusIcon = (status) => {
            const statusLower = status.toLowerCase();
            if (statusLower.includes('concluído') || statusLower.includes('concluido'))
                return 'check_circle';
            if (statusLower.includes('aberto'))
                return 'circle';
            if (statusLower.includes('aguardando'))
                return 'hourglass_top';
            if (statusLower.includes('andamento'))
                return 'autorenew';
            if (statusLower.includes('cancelado'))
                return 'cancel';
            return 'help_outline';
        };
        const prioridadeClass = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'prioridade-alta';
                case 'media': return 'prioridade-media';
                case 'baixa': return 'prioridade-baixa';
                default: return '';
            }
        };
        const prioridadeIcon = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'arrow_upward';
                case 'media': return 'remove';
                case 'baixa': return 'arrow_downward';
                default: return '';
            }
        };
        const formatarPrioridade = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'Alta';
                case 'media': return 'Média';
                case 'baixa': return 'Baixa';
                default: return prioridade;
            }
        };
        const formatarStatus = (status) => {
            const statusLower = status.toLowerCase();
            if (statusLower.includes('aguardando'))
                return 'Aguardando';
            if (statusLower.includes('andamento'))
                return 'Em Andamento';
            if (statusLower.includes('concluído') || statusLower.includes('concluido'))
                return 'Concluído';
            if (statusLower.includes('aberto'))
                return 'Aberto';
            if (statusLower.includes('cancelado'))
                return 'Cancelado';
            return status.charAt(0).toUpperCase() + status.slice(1);
        };
        const closeProfileMenu = () => { };
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
        };
    },
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { AdmSidebar };
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['chamados-table']} */ ;
/** @type {__VLS_StyleScopedClasses['chamados-table']} */ ;
/** @type {__VLS_StyleScopedClasses['chamados-table']} */ ;
/** @type {__VLS_StyleScopedClasses['chamados-table']} */ ;
/** @type {__VLS_StyleScopedClasses['chamados-table']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-row']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['gestao-chamados-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "gestao-chamados-page" },
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
    ...{ class: "filters" },
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.filtroStatus),
    ...{ class: "filter-select" },
});
// @ts-ignore
[filtroStatus,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "todos",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "concluido",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "aberto",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "aguardando_atendimento",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "em andamento",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "cancelado",
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.filtroPrioridade),
    ...{ class: "filter-select" },
});
// @ts-ignore
[filtroPrioridade,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "todos",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "alta",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "media",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "baixa",
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.filtroTecnico),
    ...{ class: "filter-select" },
});
// @ts-ignore
[filtroTecnico,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "todos",
});
for (const [tec] of __VLS_getVForSourceType((__VLS_ctx.tecnicosUnicos))) {
    // @ts-ignore
    [tecnicosUnicos,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        key: (tec),
        value: (tec),
    });
    (tec);
}
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.ordemExibicao),
    ...{ class: "filter-select" },
});
// @ts-ignore
[ordemExibicao,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "recente",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "antigo",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "text",
    value: (__VLS_ctx.pesquisa),
    placeholder: "Pesquisar por título, cliente ou técnico",
    ...{ class: "filter-search" },
});
// @ts-ignore
[pesquisa,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "table-container" },
});
__VLS_asFunctionalElement(__VLS_elements.table, __VLS_elements.table)({
    ...{ class: "chamados-table" },
});
__VLS_asFunctionalElement(__VLS_elements.thead, __VLS_elements.thead)({});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-atualizado" },
});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-id" },
});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-titulo" },
});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-cliente" },
});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-tecnico" },
});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-prioridade" },
});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-status" },
});
__VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
for (const [chamado] of __VLS_getVForSourceType((__VLS_ctx.chamadosOrdenados))) {
    // @ts-ignore
    [chamadosOrdenados,];
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({
        key: (chamado.id),
        ...{ class: "clickable-row" },
    });
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    (chamado.update_date);
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    (chamado.id);
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "chamado-titulo" },
    });
    (chamado.title);
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "cliente-info" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "cliente-nome" },
    });
    (chamado.creator?.name || '---');
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "cliente-email" },
    });
    (chamado.creator?.email || '---');
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "tecnico-info" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "tecnico-nome" },
    });
    (chamado.employee?.name || 'Não atribuído');
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "tecnico-email" },
    });
    (chamado.employee?.email || '---');
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: (['prioridade', __VLS_ctx.prioridadeClass(chamado.prioridade)]) },
    });
    // @ts-ignore
    [prioridadeClass,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons prioridade-icon" },
    });
    (__VLS_ctx.prioridadeIcon(chamado.prioridade));
    // @ts-ignore
    [prioridadeIcon,];
    (__VLS_ctx.formatarPrioridade(chamado.prioridade));
    // @ts-ignore
    [formatarPrioridade,];
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: (['status', __VLS_ctx.statusClass(chamado.status)]) },
    });
    // @ts-ignore
    [statusClass,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons status-icon" },
    });
    (__VLS_ctx.statusIcon(chamado.status));
    // @ts-ignore
    [statusIcon,];
    (__VLS_ctx.formatarStatus(chamado.status));
    // @ts-ignore
    [formatarStatus,];
}
/** @type {__VLS_StyleScopedClasses['gestao-chamados-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chamados-table']} */ ;
/** @type {__VLS_StyleScopedClasses['col-atualizado']} */ ;
/** @type {__VLS_StyleScopedClasses['col-id']} */ ;
/** @type {__VLS_StyleScopedClasses['col-titulo']} */ ;
/** @type {__VLS_StyleScopedClasses['col-cliente']} */ ;
/** @type {__VLS_StyleScopedClasses['col-tecnico']} */ ;
/** @type {__VLS_StyleScopedClasses['col-prioridade']} */ ;
/** @type {__VLS_StyleScopedClasses['col-status']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-row']} */ ;
/** @type {__VLS_StyleScopedClasses['chamado-titulo']} */ ;
/** @type {__VLS_StyleScopedClasses['cliente-info']} */ ;
/** @type {__VLS_StyleScopedClasses['cliente-nome']} */ ;
/** @type {__VLS_StyleScopedClasses['cliente-email']} */ ;
/** @type {__VLS_StyleScopedClasses['tecnico-info']} */ ;
/** @type {__VLS_StyleScopedClasses['tecnico-nome']} */ ;
/** @type {__VLS_StyleScopedClasses['tecnico-email']} */ ;
/** @type {__VLS_StyleScopedClasses['prioridade']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['prioridade-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['status-icon']} */ ;
export default {};
//# sourceMappingURL=gestaoChamado.vue.js.map