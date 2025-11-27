import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ClienteSidebar from '@/components/layouts/clienteSidebar.vue';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'MeusChamados',
    components: { ClienteSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        // Filtros
        const filtroStatus = ref('todos');
        const filtroPrioridade = ref('todos');
        const ordemExibicao = ref('recente');
        const pesquisa = ref('');
        const carregando = ref(true);
        const usuario = ref({
            nome: auth.user?.name || 'Usuário',
            email: auth.user?.email || 'sem@email.com'
        });
        const chamados = ref([]);
        // Carrega chamados do usuário logado
        const carregarChamados = async () => {
            try {
                carregando.value = true;
                const token = auth.access;
                if (!token) {
                    console.warn('⚠️ Nenhum token encontrado. Redirecionando para login...');
                    router.push('/');
                    return;
                }
                const response = await api.get('chamados/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const todosChamados = response.data.results || response.data;
                // Filtro corrigido: suporta diferentes nomes de campo de criador
                const meusChamados = todosChamados.filter((c) => {
                    const creatorId = c.creator?.id || c.creator_id || c.created_by;
                    const userId = auth.user?.id;
                    return creatorId === userId;
                });
                chamados.value = meusChamados;
            }
            catch (error) {
                console.error('❌ Erro ao carregar chamados:', error.response?.data || error);
                if (error.response?.status === 401) {
                    alert('Sessão expirada. Faça login novamente.');
                    router.push('/');
                }
            }
            finally {
                carregando.value = false;
            }
        };
        onMounted(() => {
            carregarChamados();
        });
        const closeProfileMenu = () => { };
        const goToChamadoDetalhado = (id) => {
            router.push({ name: 'ChamadoDetalhado', params: { id } });
        };
        // Protegidas contra employee undefined
        const getTecnicoNome = (chamado) => {
            if (!chamado || !chamado.employee)
                return 'Sem técnico';
            return chamado.employee.name || 'Sem técnico';
        };
        const getTecnicoEmail = (chamado) => {
            if (!chamado || !chamado.employee)
                return 'sem-tecnico@email.com';
            return chamado.employee.email || 'sem-tecnico@email.com';
        };
        const formatarData = (dataString) => {
            if (!dataString)
                return '--/--/---- --:--';
            const data = new Date(dataString);
            return data.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };
        const formatarStatus = (status) => {
            const s = status?.toUpperCase() || '';
            switch (s) {
                case 'AGUARDANDO_ATENDIMENTO': return 'Aguardando';
                case 'EM_ANDAMENTO': return 'Em Andamento';
                case 'CONCLUIDO': return 'Concluído';
                case 'CANCELADO': return 'Cancelado';
                case 'ABERTO': return 'Aberto';
                default: return status || 'Desconhecido';
            }
        };
        const filtrados = computed(() => {
            return chamados.value.filter((c) => {
                const statusFormatado = formatarStatus(c.status).toLowerCase();
                const filtroStatusLower = filtroStatus.value.toLowerCase();
                const matchStatus = filtroStatus.value === 'todos' ||
                    statusFormatado === filtroStatusLower ||
                    (filtroStatusLower === 'aguardando' && statusFormatado === 'aguardando') ||
                    (filtroStatusLower === 'andamento' && statusFormatado === 'em andamento');
                const prioridade = c.priority || c.prioridade || '';
                const matchPrioridade = filtroPrioridade.value === 'todos' ||
                    prioridade.toLowerCase() === filtroPrioridade.value.toLowerCase();
                const titulo = c.title || '';
                const tecnicoNome = getTecnicoNome(c) || '';
                const matchPesquisa = titulo.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    tecnicoNome.toLowerCase().includes(pesquisa.value.toLowerCase());
                return matchStatus && matchPrioridade && matchPesquisa;
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
        const statusClass = (status) => {
            const s = formatarStatus(status).toLowerCase();
            switch (s) {
                case 'concluído': return 'status-concluido';
                case 'aberto': return 'status-aberto';
                case 'aguardando': return 'status-aguardando';
                case 'em andamento': return 'status-andamento';
                case 'cancelado': return 'status-cancelado';
                default: return '';
            }
        };
        const statusIcon = (status) => {
            const s = formatarStatus(status).toLowerCase();
            switch (s) {
                case 'concluído': return 'check_circle';
                case 'aberto': return 'circle';
                case 'aguardando': return 'hourglass_top';
                case 'em andamento': return 'autorenew';
                case 'cancelado': return 'cancel';
                default: return 'help_outline';
            }
        };
        const prioridadeClass = (prioridade) => {
            const p = prioridade?.toUpperCase() || '';
            switch (p) {
                case 'ALTA': return 'prioridade-alta';
                case 'MEDIA': return 'prioridade-media';
                case 'BAIXA': return 'prioridade-baixa';
                default: return '';
            }
        };
        const prioridadeIcon = (prioridade) => {
            const p = prioridade?.toUpperCase() || '';
            switch (p) {
                case 'ALTA': return 'arrow_upward';
                case 'MEDIA': return 'remove';
                case 'BAIXA': return 'arrow_downward';
                default: return '';
            }
        };
        const formatarPrioridade = (prioridade) => {
            const p = prioridade?.toUpperCase() || '';
            switch (p) {
                case 'ALTA': return 'Alta';
                case 'MEDIA': return 'Média';
                case 'BAIXA': return 'Baixa';
                default: return prioridade || 'Não definida';
            }
        };
        return {
            filtroStatus,
            filtroPrioridade,
            ordemExibicao,
            pesquisa,
            usuario,
            chamados,
            carregando,
            carregarChamados,
            closeProfileMenu,
            goToChamadoDetalhado,
            filtrados,
            chamadosOrdenados,
            statusClass,
            statusIcon,
            prioridadeClass,
            prioridadeIcon,
            formatarPrioridade,
            formatarData,
            formatarStatus,
            getTecnicoNome,
            getTecnicoEmail
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'MeusChamados',
    components: { ClienteSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        // Filtros
        const filtroStatus = ref('todos');
        const filtroPrioridade = ref('todos');
        const ordemExibicao = ref('recente');
        const pesquisa = ref('');
        const carregando = ref(true);
        const usuario = ref({
            nome: auth.user?.name || 'Usuário',
            email: auth.user?.email || 'sem@email.com'
        });
        const chamados = ref([]);
        // Carrega chamados do usuário logado
        const carregarChamados = async () => {
            try {
                carregando.value = true;
                const token = auth.access;
                if (!token) {
                    console.warn('⚠️ Nenhum token encontrado. Redirecionando para login...');
                    router.push('/');
                    return;
                }
                const response = await api.get('chamados/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const todosChamados = response.data.results || response.data;
                // Filtro corrigido: suporta diferentes nomes de campo de criador
                const meusChamados = todosChamados.filter((c) => {
                    const creatorId = c.creator?.id || c.creator_id || c.created_by;
                    const userId = auth.user?.id;
                    return creatorId === userId;
                });
                chamados.value = meusChamados;
            }
            catch (error) {
                console.error('❌ Erro ao carregar chamados:', error.response?.data || error);
                if (error.response?.status === 401) {
                    alert('Sessão expirada. Faça login novamente.');
                    router.push('/');
                }
            }
            finally {
                carregando.value = false;
            }
        };
        onMounted(() => {
            carregarChamados();
        });
        const closeProfileMenu = () => { };
        const goToChamadoDetalhado = (id) => {
            router.push({ name: 'ChamadoDetalhado', params: { id } });
        };
        // Protegidas contra employee undefined
        const getTecnicoNome = (chamado) => {
            if (!chamado || !chamado.employee)
                return 'Sem técnico';
            return chamado.employee.name || 'Sem técnico';
        };
        const getTecnicoEmail = (chamado) => {
            if (!chamado || !chamado.employee)
                return 'sem-tecnico@email.com';
            return chamado.employee.email || 'sem-tecnico@email.com';
        };
        const formatarData = (dataString) => {
            if (!dataString)
                return '--/--/---- --:--';
            const data = new Date(dataString);
            return data.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };
        const formatarStatus = (status) => {
            const s = status?.toUpperCase() || '';
            switch (s) {
                case 'AGUARDANDO_ATENDIMENTO': return 'Aguardando';
                case 'EM_ANDAMENTO': return 'Em Andamento';
                case 'CONCLUIDO': return 'Concluído';
                case 'CANCELADO': return 'Cancelado';
                case 'ABERTO': return 'Aberto';
                default: return status || 'Desconhecido';
            }
        };
        const filtrados = computed(() => {
            return chamados.value.filter((c) => {
                const statusFormatado = formatarStatus(c.status).toLowerCase();
                const filtroStatusLower = filtroStatus.value.toLowerCase();
                const matchStatus = filtroStatus.value === 'todos' ||
                    statusFormatado === filtroStatusLower ||
                    (filtroStatusLower === 'aguardando' && statusFormatado === 'aguardando') ||
                    (filtroStatusLower === 'andamento' && statusFormatado === 'em andamento');
                const prioridade = c.priority || c.prioridade || '';
                const matchPrioridade = filtroPrioridade.value === 'todos' ||
                    prioridade.toLowerCase() === filtroPrioridade.value.toLowerCase();
                const titulo = c.title || '';
                const tecnicoNome = getTecnicoNome(c) || '';
                const matchPesquisa = titulo.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    tecnicoNome.toLowerCase().includes(pesquisa.value.toLowerCase());
                return matchStatus && matchPrioridade && matchPesquisa;
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
        const statusClass = (status) => {
            const s = formatarStatus(status).toLowerCase();
            switch (s) {
                case 'concluído': return 'status-concluido';
                case 'aberto': return 'status-aberto';
                case 'aguardando': return 'status-aguardando';
                case 'em andamento': return 'status-andamento';
                case 'cancelado': return 'status-cancelado';
                default: return '';
            }
        };
        const statusIcon = (status) => {
            const s = formatarStatus(status).toLowerCase();
            switch (s) {
                case 'concluído': return 'check_circle';
                case 'aberto': return 'circle';
                case 'aguardando': return 'hourglass_top';
                case 'em andamento': return 'autorenew';
                case 'cancelado': return 'cancel';
                default: return 'help_outline';
            }
        };
        const prioridadeClass = (prioridade) => {
            const p = prioridade?.toUpperCase() || '';
            switch (p) {
                case 'ALTA': return 'prioridade-alta';
                case 'MEDIA': return 'prioridade-media';
                case 'BAIXA': return 'prioridade-baixa';
                default: return '';
            }
        };
        const prioridadeIcon = (prioridade) => {
            const p = prioridade?.toUpperCase() || '';
            switch (p) {
                case 'ALTA': return 'arrow_upward';
                case 'MEDIA': return 'remove';
                case 'BAIXA': return 'arrow_downward';
                default: return '';
            }
        };
        const formatarPrioridade = (prioridade) => {
            const p = prioridade?.toUpperCase() || '';
            switch (p) {
                case 'ALTA': return 'Alta';
                case 'MEDIA': return 'Média';
                case 'BAIXA': return 'Baixa';
                default: return prioridade || 'Não definida';
            }
        };
        return {
            filtroStatus,
            filtroPrioridade,
            ordemExibicao,
            pesquisa,
            usuario,
            chamados,
            carregando,
            carregarChamados,
            closeProfileMenu,
            goToChamadoDetalhado,
            filtrados,
            chamadosOrdenados,
            statusClass,
            statusIcon,
            prioridadeClass,
            prioridadeIcon,
            formatarPrioridade,
            formatarData,
            formatarStatus,
            getTecnicoNome,
            getTecnicoEmail
        };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { ClienteSidebar };
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
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
/** @type {__VLS_StyleScopedClasses['meus-chamados-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "meus-chamados-page" },
});
// @ts-ignore
[closeProfileMenu,];
const __VLS_0 = {}.ClienteSidebar;
/** @type {[typeof __VLS_components.ClienteSidebar, typeof __VLS_components.clienteSidebar, ]} */ ;
// @ts-ignore
ClienteSidebar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    usuario: (__VLS_ctx.usuario),
}));
const __VLS_2 = __VLS_1({
    usuario: (__VLS_ctx.usuario),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
// @ts-ignore
[usuario,];
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
    value: "aguardando",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "andamento",
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
    placeholder: "Pesquisar por título ou técnico",
    ...{ class: "filter-search" },
});
// @ts-ignore
[pesquisa,];
if (__VLS_ctx.carregando) {
    // @ts-ignore
    [carregando,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading" },
    });
}
else {
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
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.carregando))
                        return;
                    __VLS_ctx.goToChamadoDetalhado(chamado.id);
                    // @ts-ignore
                    [goToChamadoDetalhado,];
                } },
            key: (chamado.id),
            ...{ class: "clickable-row" },
        });
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (__VLS_ctx.formatarData(chamado.update_date));
        // @ts-ignore
        [formatarData,];
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (chamado.id);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (chamado.title);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "tecnico-info" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (__VLS_ctx.getTecnicoNome(chamado));
        // @ts-ignore
        [getTecnicoNome,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "tecnico-email" },
        });
        (__VLS_ctx.getTecnicoEmail(chamado));
        // @ts-ignore
        [getTecnicoEmail,];
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: (['prioridade', __VLS_ctx.prioridadeClass(chamado.priority || chamado.prioridade)]) },
        });
        // @ts-ignore
        [prioridadeClass,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "material-icons prioridade-icon" },
        });
        (__VLS_ctx.prioridadeIcon(chamado.priority || chamado.prioridade));
        // @ts-ignore
        [prioridadeIcon,];
        (__VLS_ctx.formatarPrioridade(chamado.priority || chamado.prioridade));
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
    if (__VLS_ctx.chamadosOrdenados.length === 0) {
        // @ts-ignore
        [chamadosOrdenados,];
        __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({
            colspan: "6",
            ...{ class: "no-data" },
        });
    }
}
/** @type {__VLS_StyleScopedClasses['meus-chamados-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['chamados-table']} */ ;
/** @type {__VLS_StyleScopedClasses['col-atualizado']} */ ;
/** @type {__VLS_StyleScopedClasses['col-id']} */ ;
/** @type {__VLS_StyleScopedClasses['col-titulo']} */ ;
/** @type {__VLS_StyleScopedClasses['col-tecnico']} */ ;
/** @type {__VLS_StyleScopedClasses['col-prioridade']} */ ;
/** @type {__VLS_StyleScopedClasses['col-status']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-row']} */ ;
/** @type {__VLS_StyleScopedClasses['tecnico-info']} */ ;
/** @type {__VLS_StyleScopedClasses['tecnico-email']} */ ;
/** @type {__VLS_StyleScopedClasses['prioridade']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['prioridade-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['status-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['no-data']} */ ;
export default {};
//# sourceMappingURL=meusChamados.vue.js.map