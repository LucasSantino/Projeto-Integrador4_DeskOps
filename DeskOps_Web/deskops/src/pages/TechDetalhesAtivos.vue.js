import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'TechDetalhesAtivos',
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const route = useRoute();
        const ativo = ref(null);
        const loading = ref(true);
        const error = ref(null);
        const carregarAtivo = async () => {
            loading.value = true;
            error.value = null;
            try {
                // Usar o ID da prop ou da rota
                const ativoId = props.id || route.params.id;
                console.log('Buscando ativo ID:', ativoId);
                const response = await api.get(`/ativo/${ativoId}/`);
                console.log('Resposta da API:', response.data);
                // Mapear os dados da API para nossa interface
                const dados = response.data;
                ativo.value = {
                    id: dados.id,
                    nome: dados.name,
                    descricao: dados.description || 'Sem descrição',
                    status: dados.status || 'ATIVO',
                    ambiente: {
                        id: dados.environment_FK || 0,
                        nome: dados.environment_name || `Ambiente ${dados.environment_FK || 'N/D'}`,
                        localizacao: dados.environment_location || 'Localização não informada'
                    },
                    criadoEm: dados.created_at || new Date().toISOString(),
                    atualizadoEm: dados.updated_at || new Date().toISOString()
                };
            }
            catch (err) {
                console.error('Erro ao carregar ativo:', err);
                error.value = err.response?.data?.message ||
                    err.response?.data?.detail ||
                    'Erro ao carregar informações do ativo';
            }
            finally {
                loading.value = false;
            }
        };
        const formatarData = (dataString) => {
            if (!dataString)
                return 'Data não disponível';
            try {
                const data = new Date(dataString);
                return data.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            catch {
                return dataString;
            }
        };
        const statusClass = (status) => {
            switch (status?.toUpperCase()) {
                case 'ATIVO':
                case 'ACTIVE':
                    return 'status-ativo';
                case 'EM_MANUTENCAO':
                case 'MANUTENCAO':
                case 'MAINTENANCE':
                    return 'status-manutencao';
                default:
                    return 'status-desconhecido';
            }
        };
        const statusIcon = (status) => {
            switch (status?.toUpperCase()) {
                case 'ATIVO':
                case 'ACTIVE':
                    return 'check_circle';
                case 'EM_MANUTENCAO':
                case 'MANUTENCAO':
                case 'MAINTENANCE':
                    return 'build';
                default:
                    return 'help';
            }
        };
        const formatarStatus = (status) => {
            switch (status?.toUpperCase()) {
                case 'ATIVO':
                case 'ACTIVE':
                    return 'Ativo';
                case 'EM_MANUTENCAO':
                case 'MANUTENCAO':
                case 'MAINTENANCE':
                    return 'Em Manutenção';
                default:
                    return status || 'Status Desconhecido';
            }
        };
        const fecharPagina = () => {
            if (window.history.length > 1) {
                window.history.back();
            }
            else {
                window.close();
            }
        };
        onMounted(() => {
            console.log('ID recebido:', props.id);
            console.log('Route params:', route.params);
            carregarAtivo();
        });
        return {
            ativo,
            loading,
            error,
            carregarAtivo,
            statusClass,
            statusIcon,
            formatarStatus,
            formatarData,
            fecharPagina
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'TechDetalhesAtivos',
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const route = useRoute();
        const ativo = ref(null);
        const loading = ref(true);
        const error = ref(null);
        const carregarAtivo = async () => {
            loading.value = true;
            error.value = null;
            try {
                // Usar o ID da prop ou da rota
                const ativoId = props.id || route.params.id;
                console.log('Buscando ativo ID:', ativoId);
                const response = await api.get(`/ativo/${ativoId}/`);
                console.log('Resposta da API:', response.data);
                // Mapear os dados da API para nossa interface
                const dados = response.data;
                ativo.value = {
                    id: dados.id,
                    nome: dados.name,
                    descricao: dados.description || 'Sem descrição',
                    status: dados.status || 'ATIVO',
                    ambiente: {
                        id: dados.environment_FK || 0,
                        nome: dados.environment_name || `Ambiente ${dados.environment_FK || 'N/D'}`,
                        localizacao: dados.environment_location || 'Localização não informada'
                    },
                    criadoEm: dados.created_at || new Date().toISOString(),
                    atualizadoEm: dados.updated_at || new Date().toISOString()
                };
            }
            catch (err) {
                console.error('Erro ao carregar ativo:', err);
                error.value = err.response?.data?.message ||
                    err.response?.data?.detail ||
                    'Erro ao carregar informações do ativo';
            }
            finally {
                loading.value = false;
            }
        };
        const formatarData = (dataString) => {
            if (!dataString)
                return 'Data não disponível';
            try {
                const data = new Date(dataString);
                return data.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
            catch {
                return dataString;
            }
        };
        const statusClass = (status) => {
            switch (status?.toUpperCase()) {
                case 'ATIVO':
                case 'ACTIVE':
                    return 'status-ativo';
                case 'EM_MANUTENCAO':
                case 'MANUTENCAO':
                case 'MAINTENANCE':
                    return 'status-manutencao';
                default:
                    return 'status-desconhecido';
            }
        };
        const statusIcon = (status) => {
            switch (status?.toUpperCase()) {
                case 'ATIVO':
                case 'ACTIVE':
                    return 'check_circle';
                case 'EM_MANUTENCAO':
                case 'MANUTENCAO':
                case 'MAINTENANCE':
                    return 'build';
                default:
                    return 'help';
            }
        };
        const formatarStatus = (status) => {
            switch (status?.toUpperCase()) {
                case 'ATIVO':
                case 'ACTIVE':
                    return 'Ativo';
                case 'EM_MANUTENCAO':
                case 'MANUTENCAO':
                case 'MAINTENANCE':
                    return 'Em Manutenção';
                default:
                    return status || 'Status Desconhecido';
            }
        };
        const fecharPagina = () => {
            if (window.history.length > 1) {
                window.history.back();
            }
            else {
                window.close();
            }
        };
        onMounted(() => {
            console.log('ID recebido:', props.id);
            console.log('Route params:', route.params);
            carregarAtivo();
        });
        return {
            ativo,
            loading,
            error,
            carregarAtivo,
            statusClass,
            statusIcon,
            formatarStatus,
            formatarData,
            fecharPagina
        };
    },
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['btn-fechar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-fechar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-retry']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['info-rapida']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['detalhes-ativo-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['full-width']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['tech-header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['date-info']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['tech-header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-text']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "detalhes-ativo-page" },
});
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)({
    ...{ class: "main-content full-width" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "content-area" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tech-header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "logo-section" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "logo" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "@/assets/images/iconedeskops.png",
    alt: "Logo DeskOps",
    ...{ class: "logo-image" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "logo-text" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "system-label" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.fecharPagina) },
    ...{ class: "btn-fechar" },
});
// @ts-ignore
[fecharPagina,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "title-container" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "page-title" },
});
if (__VLS_ctx.loading) {
    // @ts-ignore
    [loading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-spinner" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: "@/assets/images/iconedeskops.png",
        alt: "Loading",
        ...{ class: "spinner-image rotating" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "loading-text" },
    });
}
else if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "error-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons error-icon" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "error-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.carregarAtivo) },
        ...{ class: "btn-retry" },
    });
    // @ts-ignore
    [carregarAtivo,];
}
else if (__VLS_ctx.ativo) {
    // @ts-ignore
    [ativo,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "cards-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card-form full-card" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "header-info" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "ativo-id" },
    });
    (__VLS_ctx.ativo.id);
    // @ts-ignore
    [ativo,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: (['status-badge', __VLS_ctx.statusClass(__VLS_ctx.ativo.status)]) },
    });
    // @ts-ignore
    [ativo, statusClass,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons status-icon" },
    });
    (__VLS_ctx.statusIcon(__VLS_ctx.ativo.status));
    // @ts-ignore
    [ativo, statusIcon,];
    (__VLS_ctx.formatarStatus(__VLS_ctx.ativo.status));
    // @ts-ignore
    [ativo, formatarStatus,];
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
        ...{ class: "ativo-nome" },
    });
    (__VLS_ctx.ativo.nome);
    // @ts-ignore
    [ativo,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.ativo.descricao || 'Sem descrição');
    // @ts-ignore
    [ativo,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.ativo.ambiente.nome);
    // @ts-ignore
    [ativo,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.ativo.ambiente.localizacao || 'Localização não informada');
    // @ts-ignore
    [ativo,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "date-info" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "date-container left" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "date-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text date-text" },
    });
    (__VLS_ctx.formatarData(__VLS_ctx.ativo.criadoEm));
    // @ts-ignore
    [ativo, formatarData,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "date-container right" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "date-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text date-text" },
    });
    (__VLS_ctx.formatarData(__VLS_ctx.ativo.atualizadoEm));
    // @ts-ignore
    [ativo, formatarData,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card-summary" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
        ...{ class: "card-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-rapida" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: (['info-value', __VLS_ctx.statusClass(__VLS_ctx.ativo.status)]) },
    });
    // @ts-ignore
    [ativo, statusClass,];
    (__VLS_ctx.formatarStatus(__VLS_ctx.ativo.status));
    // @ts-ignore
    [ativo, formatarStatus,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.ativo.ambiente.nome);
    // @ts-ignore
    [ativo,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.ativo.ambiente.localizacao || 'N/D');
    // @ts-ignore
    [ativo,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.ativo.id);
    // @ts-ignore
    [ativo,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "not-found-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons not-found-icon" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "not-found-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "not-found-message" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.fecharPagina) },
        ...{ class: "btn-fechar" },
    });
    // @ts-ignore
    [fecharPagina,];
}
/** @type {__VLS_StyleScopedClasses['detalhes-ativo-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['full-width']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['tech-header']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-section']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-text']} */ ;
/** @type {__VLS_StyleScopedClasses['system-label']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-fechar']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['title-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-container']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-image']} */ ;
/** @type {__VLS_StyleScopedClasses['rotating']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-text']} */ ;
/** @type {__VLS_StyleScopedClasses['error-container']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['error-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['error-title']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-retry']} */ ;
/** @type {__VLS_StyleScopedClasses['cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['full-card']} */ ;
/** @type {__VLS_StyleScopedClasses['header-info']} */ ;
/** @type {__VLS_StyleScopedClasses['ativo-id']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['status-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['ativo-nome']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['date-info']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['left']} */ ;
/** @type {__VLS_StyleScopedClasses['date-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['date-text']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['date-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['date-text']} */ ;
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-rapida']} */ ;
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
/** @type {__VLS_StyleScopedClasses['not-found-container']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['not-found-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['not-found-title']} */ ;
/** @type {__VLS_StyleScopedClasses['not-found-message']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-fechar']} */ ;
export default {};
//# sourceMappingURL=TechDetalhesAtivos.vue.js.map