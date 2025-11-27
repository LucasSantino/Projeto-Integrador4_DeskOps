import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TecnicoSidebar from '@/components/layouts/tecnicoSidebar.vue';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'ChamadosTecnico',
    components: { TecnicoSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const filtroStatus = ref('todos');
        const filtroPrioridade = ref('todos');
        const ordemExibicao = ref('recente');
        const pesquisa = ref('');
        const usuario = ref({
            nome: auth.user?.name || 'Técnico',
            email: auth.user?.email || 'sem@email.com',
            tipoUsuario: 'Técnico',
        });
        const chamados = ref([]);
        const carregarChamados = async () => {
            try {
                const token = auth.access;
                if (!token) {
                    console.warn('⚠️ Sem token, redirecionando...');
                    router.push('/');
                    return;
                }
                const response = await api.get('/chamados/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data.results || response.data;
                console.log('📦 Dados brutos da API:', data);
                console.log('👤 Técnico logado ID:', auth.user?.id);
                // ✅ Filtro para mostrar SOMENTE chamados atribuídos ao técnico logado
                const chamadosFiltrados = data.filter((c) => {
                    // Ignora chamados sem técnico
                    if (!c.employee)
                        return false;
                    // Se o backend retornar apenas o ID
                    if (typeof c.employee === 'number') {
                        return c.employee === auth.user?.id;
                    }
                    // Se o backend retornar objeto { id, name, email }
                    if (typeof c.employee === 'object') {
                        return c.employee.id === auth.user?.id;
                    }
                    return false;
                });
                console.log('✅ Chamados atribuídos a mim:', chamadosFiltrados);
                chamados.value = chamadosFiltrados.map((c) => ({
                    id: c.id,
                    title: c.title || 'Sem título',
                    status: c.status || 'Sem status',
                    prioridade: c.prioridade || 'Não definida',
                    update_date: c.update_date,
                    creator: c.creator
                        ? { name: c.creator.name, email: c.creator.email }
                        : { name: '---', email: '---' },
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar chamados:', error.response?.data || error);
            }
        };
        onMounted(() => {
            carregarChamados();
        });
        // ✅ Formatar data no padrão do código original (DD/MM/AAAA HH:MM)
        const formatarData = (dataString) => {
            if (!dataString)
                return '---';
            try {
                const data = new Date(dataString);
                const dia = String(data.getDate()).padStart(2, '0');
                const mes = String(data.getMonth() + 1).padStart(2, '0');
                const ano = data.getFullYear();
                const horas = String(data.getHours()).padStart(2, '0');
                const minutos = String(data.getMinutes()).padStart(2, '0');
                return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
            }
            catch (error) {
                console.error('Erro ao formatar data:', error);
                return '---';
            }
        };
        // ✅ Formatar status para exibição amigável
        const formatarStatus = (status) => {
            if (!status)
                return '---';
            switch (status.toLowerCase()) {
                case 'aguardando_atendimento': return 'Aguardando';
                case 'em_andamento': return 'Em Andamento';
                case 'concluido': return 'Concluído';
                case 'aberto': return 'Aberto';
                case 'cancelado': return 'Cancelado';
                default: return status;
            }
        };
        // ✅ Função closeProfileMenu do original
        const closeProfileMenu = () => {
            // Esta função será chamada no clique da página para fechar o menu de perfil
        };
        // ✅ Filtros e ordenação - compatível com formato do backend
        const filtrados = computed(() => {
            return chamados.value.filter((c) => {
                const statusOriginal = (c.status || '').toLowerCase();
                const statusFormatado = formatarStatus(c.status).toLowerCase();
                const prioridade = (c.prioridade || '').toLowerCase();
                const titulo = (c.title || '').toLowerCase();
                const cliente = (c.creator?.name || '').toLowerCase();
                const busca = pesquisa.value.toLowerCase();
                // Mapeamento dos filtros para os valores do backend
                let matchStatus = true;
                if (filtroStatus.value !== 'todos') {
                    const filtro = filtroStatus.value.toLowerCase();
                    switch (filtro) {
                        case 'aguardando':
                            matchStatus = statusOriginal === 'aguardando_atendimento';
                            break;
                        case 'andamento':
                            matchStatus = statusOriginal === 'em_andamento';
                            break;
                        case 'concluido':
                            matchStatus = statusOriginal === 'concluido';
                            break;
                        case 'aberto':
                            matchStatus = statusOriginal === 'aberto';
                            break;
                        case 'cancelado':
                            matchStatus = statusOriginal === 'cancelado';
                            break;
                        default:
                            matchStatus = statusFormatado.includes(filtro);
                    }
                }
                const matchPrioridade = filtroPrioridade.value === 'todos' ||
                    prioridade === filtroPrioridade.value.toLowerCase();
                const matchPesquisa = titulo.includes(busca) ||
                    cliente.includes(busca);
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
        const goToChamadoDetalhado = (id) => {
            router.push(`/tecnico/chamado-detalhado/${id}`);
        };
        // ✅ Classes e ícones - compatíveis com formato do backend
        const statusClass = (status) => {
            const statusLower = status.toLowerCase();
            switch (statusLower) {
                case 'concluído':
                case 'concluido': return 'status-concluido';
                case 'aberto': return 'status-aberto';
                case 'aguardando':
                case 'aguardando_atendimento': return 'status-aguardando';
                case 'em andamento':
                case 'em_andamento': return 'status-andamento';
                case 'cancelado': return 'status-cancelado';
                default: return '';
            }
        };
        const statusIcon = (status) => {
            const statusLower = status.toLowerCase();
            switch (statusLower) {
                case 'concluído':
                case 'concluido': return 'check_circle';
                case 'aberto': return 'circle';
                case 'aguardando':
                case 'aguardando_atendimento': return 'hourglass_top';
                case 'em andamento':
                case 'em_andamento': return 'autorenew';
                case 'cancelado': return 'cancel';
                default: return 'help_outline';
            }
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
        return {
            usuario,
            filtroStatus,
            filtroPrioridade,
            ordemExibicao,
            pesquisa,
            chamadosOrdenados,
            statusClass,
            statusIcon,
            prioridadeClass,
            prioridadeIcon,
            formatarPrioridade,
            formatarData,
            formatarStatus,
            closeProfileMenu,
            goToChamadoDetalhado,
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'ChamadosTecnico',
    components: { TecnicoSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const filtroStatus = ref('todos');
        const filtroPrioridade = ref('todos');
        const ordemExibicao = ref('recente');
        const pesquisa = ref('');
        const usuario = ref({
            nome: auth.user?.name || 'Técnico',
            email: auth.user?.email || 'sem@email.com',
            tipoUsuario: 'Técnico',
        });
        const chamados = ref([]);
        const carregarChamados = async () => {
            try {
                const token = auth.access;
                if (!token) {
                    console.warn('⚠️ Sem token, redirecionando...');
                    router.push('/');
                    return;
                }
                const response = await api.get('/chamados/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data.results || response.data;
                console.log('📦 Dados brutos da API:', data);
                console.log('👤 Técnico logado ID:', auth.user?.id);
                // ✅ Filtro para mostrar SOMENTE chamados atribuídos ao técnico logado
                const chamadosFiltrados = data.filter((c) => {
                    // Ignora chamados sem técnico
                    if (!c.employee)
                        return false;
                    // Se o backend retornar apenas o ID
                    if (typeof c.employee === 'number') {
                        return c.employee === auth.user?.id;
                    }
                    // Se o backend retornar objeto { id, name, email }
                    if (typeof c.employee === 'object') {
                        return c.employee.id === auth.user?.id;
                    }
                    return false;
                });
                console.log('✅ Chamados atribuídos a mim:', chamadosFiltrados);
                chamados.value = chamadosFiltrados.map((c) => ({
                    id: c.id,
                    title: c.title || 'Sem título',
                    status: c.status || 'Sem status',
                    prioridade: c.prioridade || 'Não definida',
                    update_date: c.update_date,
                    creator: c.creator
                        ? { name: c.creator.name, email: c.creator.email }
                        : { name: '---', email: '---' },
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar chamados:', error.response?.data || error);
            }
        };
        onMounted(() => {
            carregarChamados();
        });
        // ✅ Formatar data no padrão do código original (DD/MM/AAAA HH:MM)
        const formatarData = (dataString) => {
            if (!dataString)
                return '---';
            try {
                const data = new Date(dataString);
                const dia = String(data.getDate()).padStart(2, '0');
                const mes = String(data.getMonth() + 1).padStart(2, '0');
                const ano = data.getFullYear();
                const horas = String(data.getHours()).padStart(2, '0');
                const minutos = String(data.getMinutes()).padStart(2, '0');
                return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
            }
            catch (error) {
                console.error('Erro ao formatar data:', error);
                return '---';
            }
        };
        // ✅ Formatar status para exibição amigável
        const formatarStatus = (status) => {
            if (!status)
                return '---';
            switch (status.toLowerCase()) {
                case 'aguardando_atendimento': return 'Aguardando';
                case 'em_andamento': return 'Em Andamento';
                case 'concluido': return 'Concluído';
                case 'aberto': return 'Aberto';
                case 'cancelado': return 'Cancelado';
                default: return status;
            }
        };
        // ✅ Função closeProfileMenu do original
        const closeProfileMenu = () => {
            // Esta função será chamada no clique da página para fechar o menu de perfil
        };
        // ✅ Filtros e ordenação - compatível com formato do backend
        const filtrados = computed(() => {
            return chamados.value.filter((c) => {
                const statusOriginal = (c.status || '').toLowerCase();
                const statusFormatado = formatarStatus(c.status).toLowerCase();
                const prioridade = (c.prioridade || '').toLowerCase();
                const titulo = (c.title || '').toLowerCase();
                const cliente = (c.creator?.name || '').toLowerCase();
                const busca = pesquisa.value.toLowerCase();
                // Mapeamento dos filtros para os valores do backend
                let matchStatus = true;
                if (filtroStatus.value !== 'todos') {
                    const filtro = filtroStatus.value.toLowerCase();
                    switch (filtro) {
                        case 'aguardando':
                            matchStatus = statusOriginal === 'aguardando_atendimento';
                            break;
                        case 'andamento':
                            matchStatus = statusOriginal === 'em_andamento';
                            break;
                        case 'concluido':
                            matchStatus = statusOriginal === 'concluido';
                            break;
                        case 'aberto':
                            matchStatus = statusOriginal === 'aberto';
                            break;
                        case 'cancelado':
                            matchStatus = statusOriginal === 'cancelado';
                            break;
                        default:
                            matchStatus = statusFormatado.includes(filtro);
                    }
                }
                const matchPrioridade = filtroPrioridade.value === 'todos' ||
                    prioridade === filtroPrioridade.value.toLowerCase();
                const matchPesquisa = titulo.includes(busca) ||
                    cliente.includes(busca);
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
        const goToChamadoDetalhado = (id) => {
            router.push(`/tecnico/chamado-detalhado/${id}`);
        };
        // ✅ Classes e ícones - compatíveis com formato do backend
        const statusClass = (status) => {
            const statusLower = status.toLowerCase();
            switch (statusLower) {
                case 'concluído':
                case 'concluido': return 'status-concluido';
                case 'aberto': return 'status-aberto';
                case 'aguardando':
                case 'aguardando_atendimento': return 'status-aguardando';
                case 'em andamento':
                case 'em_andamento': return 'status-andamento';
                case 'cancelado': return 'status-cancelado';
                default: return '';
            }
        };
        const statusIcon = (status) => {
            const statusLower = status.toLowerCase();
            switch (statusLower) {
                case 'concluído':
                case 'concluido': return 'check_circle';
                case 'aberto': return 'circle';
                case 'aguardando':
                case 'aguardando_atendimento': return 'hourglass_top';
                case 'em andamento':
                case 'em_andamento': return 'autorenew';
                case 'cancelado': return 'cancel';
                default: return 'help_outline';
            }
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
        return {
            usuario,
            filtroStatus,
            filtroPrioridade,
            ordemExibicao,
            pesquisa,
            chamadosOrdenados,
            statusClass,
            statusIcon,
            prioridadeClass,
            prioridadeIcon,
            formatarPrioridade,
            formatarData,
            formatarStatus,
            closeProfileMenu,
            goToChamadoDetalhado,
        };
    },
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { TecnicoSidebar };
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
/** @type {__VLS_StyleScopedClasses['chamados-tecnico-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "chamados-tecnico-page" },
});
// @ts-ignore
[closeProfileMenu,];
const __VLS_0 = {}.TecnicoSidebar;
/** @type {[typeof __VLS_components.TecnicoSidebar, typeof __VLS_components.tecnicoSidebar, ]} */ ;
// @ts-ignore
TecnicoSidebar;
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
    placeholder: "Pesquisar por título ou cliente",
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
        ...{ class: "cliente-info" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (chamado.creator?.name || '---');
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "cliente-email" },
    });
    (chamado.creator?.email || '---');
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
/** @type {__VLS_StyleScopedClasses['chamados-tecnico-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
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
/** @type {__VLS_StyleScopedClasses['col-prioridade']} */ ;
/** @type {__VLS_StyleScopedClasses['col-status']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-row']} */ ;
/** @type {__VLS_StyleScopedClasses['cliente-info']} */ ;
/** @type {__VLS_StyleScopedClasses['cliente-email']} */ ;
/** @type {__VLS_StyleScopedClasses['prioridade']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['prioridade-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['status-icon']} */ ;
export default {};
//# sourceMappingURL=chamadosTecnico.vue.js.map