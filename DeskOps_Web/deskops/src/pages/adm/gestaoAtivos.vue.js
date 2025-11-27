import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdmSidebar from '@/components/layouts/admSidebar.vue';
import QrcodeVue from 'qrcode.vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'GestaoAtivos',
    components: {
        AdmSidebar,
        QrcodeVue
    },
    setup() {
        const auth = useAuthStore();
        const router = useRouter();
        const token = auth.access;
        const ativos = ref([]);
        const ambientes = ref([]);
        const modalAberto = ref(false);
        const ativoSelecionado = ref(null);
        const filtroStatus = ref('todos');
        const filtroAmbiente = ref('todos');
        const pesquisa = ref('');
        // Computed para gerar o valor do QR Code - ROTA PÚBLICA
        const qrCodeValue = computed(() => {
            if (!ativoSelecionado.value)
                return '';
            // URL que aponta para a página pública de detalhes do ativo
            const baseUrl = window.location.origin;
            return `${baseUrl}/tech/ativo/${ativoSelecionado.value.id}`;
        });
        // 🔹 Buscar ativos da API
        const carregarAtivos = async () => {
            try {
                const response = await api.get('/ativo/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('✅ Ativos recebidos:', response.data);
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results;
                ativos.value = data.map((a) => ({
                    id: a.id,
                    nome: a.name,
                    descricao: a.description || 'Sem descrição',
                    status: a.status || 'ATIVO',
                    ambiente: {
                        id: a.environment_FK || 0,
                        nome: `Ambiente ${a.environment_FK || 'N/D'}`,
                    },
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar ativos:', error);
            }
        };
        // 🔹 Buscar ambientes da API
        const carregarAmbientes = async () => {
            try {
                const response = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results;
                ambientes.value = data.map((a) => ({
                    id: a.id,
                    nome: a.name,
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambientes:', error);
            }
        };
        // 🔹 Filtragem
        const ativosFiltrados = computed(() => {
            return ativos.value.filter((a) => {
                const matchStatus = filtroStatus.value === 'todos' || a.status === filtroStatus.value;
                const matchAmbiente = filtroAmbiente.value === 'todos' ||
                    a.ambiente.id === Number(filtroAmbiente.value);
                const matchPesquisa = a.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    a.descricao.toLowerCase().includes(pesquisa.value.toLowerCase());
                return matchStatus && matchAmbiente && matchPesquisa;
            });
        });
        // 🔥 ORDENAÇÃO POR ID CRESCENTE
        const ativosFiltradosOrdenados = computed(() => [...ativosFiltrados.value].sort((a, b) => a.id - b.id));
        // ✅ Redirecionar para o cadastro
        const cadastrarAtivo = () => {
            router.push('/adm/novo-ativo');
        };
        const verDetalhesAtivo = (id) => {
            router.push(`/adm/detalhes-ativo/${id}`);
        };
        // Funções do Modal QR Code
        const abrirModalQRCode = (ativo) => {
            ativoSelecionado.value = ativo;
            modalAberto.value = true;
        };
        const fecharModal = () => {
            modalAberto.value = false;
            ativoSelecionado.value = null;
        };
        const downloadQRCode = () => {
            if (!ativoSelecionado.value)
                return;
            // Criar um elemento canvas temporário para download
            const canvas = document.querySelector('.qr-code canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.download = `qrcode-ativo-${ativoSelecionado.value.id}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        };
        const imprimirQRCode = () => {
            // Simular impressão do QR Code
            window.print();
        };
        const closeProfileMenu = () => { };
        // Função para determinar a classe do status
        const statusClass = (status) => status === 'ATIVO' ? 'status-ativo' : 'status-manutencao';
        // Função para determinar o ícone do status
        const statusIcon = (status) => {
            switch (status) {
                case 'ATIVO': return 'check_circle';
                case 'EM_MANUTENCAO': return 'build';
                default: return '';
            }
        };
        const formatarStatus = (status) => status === 'ATIVO' ? 'Ativo' : 'Em Manutenção';
        onMounted(() => {
            carregarAtivos();
            carregarAmbientes();
        });
        return {
            ativos,
            ambientes,
            filtroStatus,
            filtroAmbiente,
            pesquisa,
            ativosFiltradosOrdenados,
            modalAberto,
            ativoSelecionado,
            qrCodeValue,
            cadastrarAtivo,
            verDetalhesAtivo,
            abrirModalQRCode,
            fecharModal,
            downloadQRCode,
            imprimirQRCode,
            closeProfileMenu,
            statusClass,
            statusIcon,
            formatarStatus,
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'GestaoAtivos',
    components: {
        AdmSidebar,
        QrcodeVue
    },
    setup() {
        const auth = useAuthStore();
        const router = useRouter();
        const token = auth.access;
        const ativos = ref([]);
        const ambientes = ref([]);
        const modalAberto = ref(false);
        const ativoSelecionado = ref(null);
        const filtroStatus = ref('todos');
        const filtroAmbiente = ref('todos');
        const pesquisa = ref('');
        // Computed para gerar o valor do QR Code - ROTA PÚBLICA
        const qrCodeValue = computed(() => {
            if (!ativoSelecionado.value)
                return '';
            // URL que aponta para a página pública de detalhes do ativo
            const baseUrl = window.location.origin;
            return `${baseUrl}/tech/ativo/${ativoSelecionado.value.id}`;
        });
        // 🔹 Buscar ativos da API
        const carregarAtivos = async () => {
            try {
                const response = await api.get('/ativo/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('✅ Ativos recebidos:', response.data);
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results;
                ativos.value = data.map((a) => ({
                    id: a.id,
                    nome: a.name,
                    descricao: a.description || 'Sem descrição',
                    status: a.status || 'ATIVO',
                    ambiente: {
                        id: a.environment_FK || 0,
                        nome: `Ambiente ${a.environment_FK || 'N/D'}`,
                    },
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar ativos:', error);
            }
        };
        // 🔹 Buscar ambientes da API
        const carregarAmbientes = async () => {
            try {
                const response = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results;
                ambientes.value = data.map((a) => ({
                    id: a.id,
                    nome: a.name,
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambientes:', error);
            }
        };
        // 🔹 Filtragem
        const ativosFiltrados = computed(() => {
            return ativos.value.filter((a) => {
                const matchStatus = filtroStatus.value === 'todos' || a.status === filtroStatus.value;
                const matchAmbiente = filtroAmbiente.value === 'todos' ||
                    a.ambiente.id === Number(filtroAmbiente.value);
                const matchPesquisa = a.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    a.descricao.toLowerCase().includes(pesquisa.value.toLowerCase());
                return matchStatus && matchAmbiente && matchPesquisa;
            });
        });
        // 🔥 ORDENAÇÃO POR ID CRESCENTE
        const ativosFiltradosOrdenados = computed(() => [...ativosFiltrados.value].sort((a, b) => a.id - b.id));
        // ✅ Redirecionar para o cadastro
        const cadastrarAtivo = () => {
            router.push('/adm/novo-ativo');
        };
        const verDetalhesAtivo = (id) => {
            router.push(`/adm/detalhes-ativo/${id}`);
        };
        // Funções do Modal QR Code
        const abrirModalQRCode = (ativo) => {
            ativoSelecionado.value = ativo;
            modalAberto.value = true;
        };
        const fecharModal = () => {
            modalAberto.value = false;
            ativoSelecionado.value = null;
        };
        const downloadQRCode = () => {
            if (!ativoSelecionado.value)
                return;
            // Criar um elemento canvas temporário para download
            const canvas = document.querySelector('.qr-code canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.download = `qrcode-ativo-${ativoSelecionado.value.id}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        };
        const imprimirQRCode = () => {
            // Simular impressão do QR Code
            window.print();
        };
        const closeProfileMenu = () => { };
        // Função para determinar a classe do status
        const statusClass = (status) => status === 'ATIVO' ? 'status-ativo' : 'status-manutencao';
        // Função para determinar o ícone do status
        const statusIcon = (status) => {
            switch (status) {
                case 'ATIVO': return 'check_circle';
                case 'EM_MANUTENCAO': return 'build';
                default: return '';
            }
        };
        const formatarStatus = (status) => status === 'ATIVO' ? 'Ativo' : 'Em Manutenção';
        onMounted(() => {
            carregarAtivos();
            carregarAmbientes();
        });
        return {
            ativos,
            ambientes,
            filtroStatus,
            filtroAmbiente,
            pesquisa,
            ativosFiltradosOrdenados,
            modalAberto,
            ativoSelecionado,
            qrCodeValue,
            cadastrarAtivo,
            verDetalhesAtivo,
            abrirModalQRCode,
            fecharModal,
            downloadQRCode,
            imprimirQRCode,
            closeProfileMenu,
            statusClass,
            statusIcon,
            formatarStatus,
        };
    },
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = {
    AdmSidebar,
    QrcodeVue
};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cadastrar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cadastrar']} */ ;
/** @type {__VLS_StyleScopedClasses['ativos-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ativos-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ativos-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ativos-table']} */ ;
/** @type {__VLS_StyleScopedClasses['ativos-table']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-code-available']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-code-available']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-qr']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-code-available']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-row']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-close']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-close']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['status-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-download']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-download']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-print']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-print']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['info-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cadastrar']} */ ;
/** @type {__VLS_StyleScopedClasses['gestao-ativos-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-container']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "gestao-ativos-page" },
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
    value: "ATIVO",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "EM_MANUTENCAO",
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.filtroAmbiente),
    ...{ class: "filter-select" },
});
// @ts-ignore
[filtroAmbiente,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "todos",
});
for (const [ambiente] of __VLS_getVForSourceType((__VLS_ctx.ambientes))) {
    // @ts-ignore
    [ambientes,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        key: (ambiente.id),
        value: (ambiente.id),
    });
    (ambiente.nome);
}
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "text",
    value: (__VLS_ctx.pesquisa),
    placeholder: "Pesquisar por nome ou descrição",
    ...{ class: "filter-search" },
});
// @ts-ignore
[pesquisa,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.cadastrarAtivo) },
    ...{ class: "btn-cadastrar" },
});
// @ts-ignore
[cadastrarAtivo,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "table-container" },
});
__VLS_asFunctionalElement(__VLS_elements.table, __VLS_elements.table)({
    ...{ class: "ativos-table" },
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
    ...{ class: "col-ambiente" },
});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-status" },
});
__VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({
    ...{ class: "col-qrcode" },
});
__VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
for (const [ativo] of __VLS_getVForSourceType((__VLS_ctx.ativosFiltradosOrdenados))) {
    // @ts-ignore
    [ativosFiltradosOrdenados,];
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.verDetalhesAtivo(ativo.id);
                // @ts-ignore
                [verDetalhesAtivo,];
            } },
        key: (ativo.id),
        ...{ class: "clickable-row" },
    });
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    (ativo.id);
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    (ativo.nome);
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    (ativo.descricao);
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    (ativo.ambiente.nome);
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: (['status', __VLS_ctx.statusClass(ativo.status)]) },
    });
    // @ts-ignore
    [statusClass,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons status-icon" },
    });
    (__VLS_ctx.statusIcon(ativo.status));
    // @ts-ignore
    [statusIcon,];
    (__VLS_ctx.formatarStatus(ativo.status));
    // @ts-ignore
    [formatarStatus,];
    __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.abrirModalQRCode(ativo);
                // @ts-ignore
                [abrirModalQRCode,];
            } },
        ...{ class: "qr-code-available clickable-qr" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
}
if (__VLS_ctx.modalAberto) {
    // @ts-ignore
    [modalAberto,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.fecharModal) },
        ...{ class: "modal-overlay" },
    });
    // @ts-ignore
    [fecharModal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: () => { } },
        ...{ class: "modal-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
        ...{ class: "modal-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.fecharModal) },
        ...{ class: "modal-close" },
    });
    // @ts-ignore
    [fecharModal,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-body" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "info-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-grid" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.ativoSelecionado?.id);
    // @ts-ignore
    [ativoSelecionado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.ativoSelecionado?.nome);
    // @ts-ignore
    [ativoSelecionado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.ativoSelecionado?.descricao);
    // @ts-ignore
    [ativoSelecionado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.ativoSelecionado?.ambiente.nome);
    // @ts-ignore
    [ativoSelecionado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: (['info-value', __VLS_ctx.statusClass(__VLS_ctx.ativoSelecionado?.status || '')]) },
    });
    // @ts-ignore
    [statusClass, ativoSelecionado,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons status-icon" },
    });
    (__VLS_ctx.statusIcon(__VLS_ctx.ativoSelecionado?.status || ''));
    // @ts-ignore
    [statusIcon, ativoSelecionado,];
    (__VLS_ctx.formatarStatus(__VLS_ctx.ativoSelecionado?.status || ''));
    // @ts-ignore
    [formatarStatus, ativoSelecionado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "qr-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "qr-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "qr-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "qr-code-wrapper" },
    });
    const __VLS_5 = {}.QrcodeVue;
    /** @type {[typeof __VLS_components.QrcodeVue, typeof __VLS_components.qrcodeVue, ]} */ ;
    // @ts-ignore
    QrcodeVue;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        value: (__VLS_ctx.qrCodeValue),
        size: (200),
        level: "H",
        renderAs: "canvas",
        ...{ class: "qr-code" },
    }));
    const __VLS_7 = __VLS_6({
        value: (__VLS_ctx.qrCodeValue),
        size: (200),
        level: "H",
        renderAs: "canvas",
        ...{ class: "qr-code" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    // @ts-ignore
    [qrCodeValue,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "qr-subtext" },
    });
    (__VLS_ctx.ativoSelecionado?.id);
    // @ts-ignore
    [ativoSelecionado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "qr-actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.downloadQRCode) },
        ...{ class: "btn-download" },
    });
    // @ts-ignore
    [downloadQRCode,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.imprimirQRCode) },
        ...{ class: "btn-print" },
    });
    // @ts-ignore
    [imprimirQRCode,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
}
/** @type {__VLS_StyleScopedClasses['gestao-ativos-page']} */ ;
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
/** @type {__VLS_StyleScopedClasses['ativos-table']} */ ;
/** @type {__VLS_StyleScopedClasses['col-id']} */ ;
/** @type {__VLS_StyleScopedClasses['col-nome']} */ ;
/** @type {__VLS_StyleScopedClasses['col-descricao']} */ ;
/** @type {__VLS_StyleScopedClasses['col-ambiente']} */ ;
/** @type {__VLS_StyleScopedClasses['col-status']} */ ;
/** @type {__VLS_StyleScopedClasses['col-qrcode']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-row']} */ ;
/** @type {__VLS_StyleScopedClasses['status']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['status-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-code-available']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-qr']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-header']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-title']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-close']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-body']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['status-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-section']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-title']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-container']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-code-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-code']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-subtext']} */ ;
/** @type {__VLS_StyleScopedClasses['qr-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-download']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-print']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
export default {};
//# sourceMappingURL=gestaoAtivos.vue.js.map