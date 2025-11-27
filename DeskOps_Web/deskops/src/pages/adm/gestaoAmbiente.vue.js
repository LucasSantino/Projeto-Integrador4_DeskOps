import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdmSidebar from '@/components/layouts/admSidebar.vue';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'GestaoAmbientes',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const token = auth.access;
        const ambientes = ref([]);
        const filtroResponsavel = ref('todos');
        const ordemExibicao = ref('recente');
        const pesquisa = ref('');
        // 🔹 Buscar ambientes reais da API
        const carregarAmbientes = async () => {
            try {
                const response = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✅ Dados recebidos:', response.data);
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results;
                ambientes.value = data.map((a) => ({
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
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambientes:', error);
            }
        };
        const filtrados = computed(() => {
            return ambientes.value.filter((a) => {
                const matchResponsavel = filtroResponsavel.value === 'todos' ||
                    a.responsavel.nome.toLowerCase().includes(filtroResponsavel.value.toLowerCase());
                const matchPesquisa = a.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    a.descricao.toLowerCase().includes(pesquisa.value.toLowerCase());
                return matchResponsavel && matchPesquisa;
            });
        });
        const ambientesOrdenados = computed(() => {
            const lista = [...filtrados.value];
            return lista.sort((a, b) => {
                const dataA = new Date(a.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime();
                const dataB = new Date(b.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime();
                return ordemExibicao.value === 'recente' ? dataB - dataA : dataA - dataB;
            });
        });
        const verDetalhesAmbiente = (id) => {
            router.push(`/adm/detalhes-ambiente/${id}`);
        };
        const cadastrarAmbiente = () => {
            router.push('/adm/novo-ambiente');
        };
        const closeProfileMenu = () => { };
        onMounted(() => carregarAmbientes());
        return {
            ambientes,
            filtroResponsavel,
            ordemExibicao,
            pesquisa,
            ambientesOrdenados,
            verDetalhesAmbiente,
            cadastrarAmbiente,
            closeProfileMenu
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'GestaoAmbientes',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const token = auth.access;
        const ambientes = ref([]);
        const filtroResponsavel = ref('todos');
        const ordemExibicao = ref('recente');
        const pesquisa = ref('');
        // 🔹 Buscar ambientes reais da API
        const carregarAmbientes = async () => {
            try {
                const response = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✅ Dados recebidos:', response.data);
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results;
                ambientes.value = data.map((a) => ({
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
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambientes:', error);
            }
        };
        const filtrados = computed(() => {
            return ambientes.value.filter((a) => {
                const matchResponsavel = filtroResponsavel.value === 'todos' ||
                    a.responsavel.nome.toLowerCase().includes(filtroResponsavel.value.toLowerCase());
                const matchPesquisa = a.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    a.descricao.toLowerCase().includes(pesquisa.value.toLowerCase());
                return matchResponsavel && matchPesquisa;
            });
        });
        const ambientesOrdenados = computed(() => {
            const lista = [...filtrados.value];
            return lista.sort((a, b) => {
                const dataA = new Date(a.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime();
                const dataB = new Date(b.criadoEm.split(' ')[0].split('/').reverse().join('-')).getTime();
                return ordemExibicao.value === 'recente' ? dataB - dataA : dataA - dataB;
            });
        });
        const verDetalhesAmbiente = (id) => {
            router.push(`/adm/detalhes-ambiente/${id}`);
        };
        const cadastrarAmbiente = () => {
            router.push('/adm/novo-ambiente');
        };
        const closeProfileMenu = () => { };
        onMounted(() => carregarAmbientes());
        return {
            ambientes,
            filtroResponsavel,
            ordemExibicao,
            pesquisa,
            ambientesOrdenados,
            verDetalhesAmbiente,
            cadastrarAmbiente,
            closeProfileMenu
        };
    }
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
/** @type {__VLS_StyleScopedClasses['btn-cadastrar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cadastrar']} */ ;
/** @type {__VLS_StyleScopedClasses['ambientes-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ambientes-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ambientes-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ambientes-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ambientes-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ambiente-descricao']} */ ;
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
/** @type {__VLS_StyleScopedClasses['btn-cadastrar']} */ ;
/** @type {__VLS_StyleScopedClasses['gestao-ambientes-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "gestao-ambientes-page" },
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
    value: (__VLS_ctx.filtroResponsavel),
    ...{ class: "filter-select" },
});
// @ts-ignore
[filtroResponsavel,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "todos",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "lucas",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "maria",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "carlos",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "ana",
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
    placeholder: "Pesquisar por nome ou descrição",
    ...{ class: "filter-search" },
});
// @ts-ignore
[pesquisa,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.cadastrarAmbiente) },
    ...{ class: "btn-cadastrar" },
});
// @ts-ignore
[cadastrarAmbiente,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "table-container" },
});
__VLS_asFunctionalElement(__VLS_elements.table, __VLS_elements.table)({
    ...{ class: "ambientes-table" },
});
__VLS_asFunctionalElement(__VLS_elements.thead, __VLS_elements.thead)({});
__VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-id" },
});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-nome" },
});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-descricao" },
});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-responsavel" },
});
__VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
for (const [ambiente] of __VLS_getVForSourceType((__VLS_ctx.ambientesOrdenados))) {
    // @ts-ignore
    [ambientesOrdenados,];
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.$router.push(`/adm/detalhes-ambiente/${ambiente.id}`);
                // @ts-ignore
                [$router,];
            } },
        key: (ambiente.id),
        ...{ class: "clickable-row" },
    });
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    (ambiente.id);
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "ambiente-info" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "ambiente-nome" },
    });
    (ambiente.nome);
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "ambiente-descricao" },
    });
    (ambiente.descricao);
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "responsavel-info" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "responsavel-nome" },
    });
    (ambiente.responsavel.nome);
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "responsavel-email" },
    });
    (ambiente.responsavel.email);
}
/** @type {__VLS_StyleScopedClasses['gestao-ambientes-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cadastrar']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['ambientes-table']} */ ;
/** @type {__VLS_StyleScopedClasses['col-id']} */ ;
/** @type {__VLS_StyleScopedClasses['col-nome']} */ ;
/** @type {__VLS_StyleScopedClasses['col-descricao']} */ ;
/** @type {__VLS_StyleScopedClasses['col-responsavel']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-row']} */ ;
/** @type {__VLS_StyleScopedClasses['ambiente-info']} */ ;
/** @type {__VLS_StyleScopedClasses['ambiente-nome']} */ ;
/** @type {__VLS_StyleScopedClasses['ambiente-descricao']} */ ;
/** @type {__VLS_StyleScopedClasses['responsavel-info']} */ ;
/** @type {__VLS_StyleScopedClasses['responsavel-nome']} */ ;
/** @type {__VLS_StyleScopedClasses['responsavel-email']} */ ;
export default {};
//# sourceMappingURL=gestaoAmbiente.vue.js.map