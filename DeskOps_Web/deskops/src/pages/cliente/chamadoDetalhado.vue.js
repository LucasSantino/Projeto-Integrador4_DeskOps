import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ClienteSidebar from '@/components/layouts/clienteSidebar.vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'ChamadoDetalhado',
    components: { ClienteSidebar },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const auth = useAuthStore();
        const chamado = ref(null);
        const tecnico = ref(null);
        const isLoading = ref(false);
        const loadingText = ref('Processando...');
        // 🔹 Estados para o popup
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        // ✅ Função para mostrar popup personalizado
        const showCustomPopup = (type, title, message, confirmText, action) => {
            popupType.value = type;
            popupTitle.value = title;
            popupMessage.value = message;
            popupConfirmText.value = confirmText;
            popupAction.value = action || null;
            showPopup.value = true;
        };
        const closePopup = () => {
            showPopup.value = false;
            popupAction.value = null;
        };
        const handlePopupConfirm = () => {
            if (popupAction.value) {
                popupAction.value();
            }
            closePopup();
        };
        const popupIcon = computed(() => {
            switch (popupType.value) {
                case 'success': return 'check_circle';
                case 'error': return 'error';
                case 'confirm': return 'help';
                default: return 'info';
            }
        });
        // ✅ Função para buscar os detalhes do chamado
        const carregarChamado = async () => {
            try {
                const id = route.params.id;
                const token = auth.access;
                if (!token) {
                    alert('Sessão expirada. Faça login novamente.');
                    router.push('/');
                    return;
                }
                const response = await api.get(`/chamados/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;
                chamado.value = {
                    id: data.id,
                    titulo: data.title,
                    descricao: data.description,
                    ambiente: data.environment?.name || '---',
                    imagem: data.photo || null,
                    status: data.status,
                    prioridade: data.prioridade,
                    criadoEm: new Date(data.dt_criacao).toLocaleString('pt-BR'),
                    atualizadoEm: new Date(data.update_date).toLocaleString('pt-BR'),
                    criadoPor: {
                        nome: data.creator?.name || '---',
                        email: data.creator?.email || '---',
                    },
                };
                // ✅ Técnico responsável (ajustado para os dois possíveis campos)
                if (data.employee) {
                    tecnico.value = {
                        name: data.employee.name || '---',
                        email: data.employee.email || '---'
                    };
                }
                else if (data.assigned_to) {
                    tecnico.value = {
                        name: data.assigned_to.name || '---',
                        email: data.assigned_to.email || '---'
                    };
                }
                else {
                    tecnico.value = {
                        name: 'Não atribuído',
                        email: 'Não atribuído'
                    };
                }
                console.log('📋 Chamado carregado:', chamado.value);
            }
            catch (error) {
                console.error('❌ Erro ao carregar chamado:', error.response?.data || error);
                showCustomPopup('error', 'Erro', 'Erro ao carregar detalhes do chamado.', 'OK');
            }
        };
        // ✅ Funções auxiliares para exibição de status e prioridade
        const statusClass = (status) => {
            const s = status?.toLowerCase() || '';
            if (s.includes('concl'))
                return 'status-concluido';
            if (s.includes('aberto'))
                return 'status-aberto';
            if (s.includes('aguard'))
                return 'status-aguardando';
            if (s.includes('andamento'))
                return 'status-andamento';
            if (s.includes('cancel'))
                return 'status-cancelado';
            return '';
        };
        const statusIcon = (status) => {
            const s = status?.toLowerCase() || '';
            if (s.includes('concl'))
                return 'check_circle';
            if (s.includes('aberto'))
                return 'radio_button_unchecked';
            if (s.includes('aguard'))
                return 'hourglass_top';
            if (s.includes('andamento'))
                return 'autorenew';
            if (s.includes('cancel'))
                return 'cancel';
            return 'info';
        };
        const prioridadeClass = (p) => {
            switch (p?.toLowerCase()) {
                case 'alta': return 'prioridade-alta';
                case 'media': return 'prioridade-media';
                case 'baixa': return 'prioridade-baixa';
                default: return '';
            }
        };
        const prioridadeIcon = (p) => {
            switch (p?.toLowerCase()) {
                case 'alta': return 'arrow_upward';
                case 'media': return 'remove';
                case 'baixa': return 'arrow_downward';
                default: return '';
            }
        };
        const formatarPrioridade = (p) => {
            switch (p?.toLowerCase()) {
                case 'alta': return 'Alta';
                case 'media': return 'Média';
                case 'baixa': return 'Baixa';
                default: return p;
            }
        };
        // ✅ Confirmar encerramento do chamado
        const confirmarEncerramento = () => {
            showCustomPopup('confirm', 'Encerrar Chamado', 'Tem certeza que deseja encerrar este chamado? Esta ação não pode ser desfeita.', 'Encerrar', encerrarChamado);
        };
        // ✅ Função para encerrar o chamado
        const encerrarChamado = async () => {
            try {
                isLoading.value = true;
                loadingText.value = 'Encerrando chamado...';
                const id = route.params.id;
                const token = auth.access;
                if (!token) {
                    showCustomPopup('error', 'Erro de Sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                    return;
                }
                await api.patch(`/chamados/${id}/encerrar/`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                showCustomPopup('success', 'Sucesso!', 'Chamado encerrado com sucesso! Você será redirecionado para a lista de chamados.', 'OK', () => {
                    router.push('/cliente/meus-chamados');
                });
            }
            catch (error) {
                console.error('❌ Erro ao encerrar chamado:', error.response?.data || error);
                let errorMessage = 'Erro ao encerrar chamado. Tente novamente.';
                if (error.response?.data) {
                    if (typeof error.response.data === 'object') {
                        errorMessage = Object.values(error.response.data).flat().join('\n');
                    }
                    else {
                        errorMessage = error.response.data;
                    }
                }
                showCustomPopup('error', 'Erro', errorMessage, 'OK');
            }
            finally {
                isLoading.value = false;
            }
        };
        const closeProfileMenu = () => {
            // Fecha o menu de perfil
        };
        onMounted(() => {
            carregarChamado();
        });
        return {
            chamado,
            tecnico,
            isLoading,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            loadingText,
            statusClass,
            statusIcon,
            prioridadeClass,
            prioridadeIcon,
            formatarPrioridade,
            confirmarEncerramento,
            encerrarChamado,
            closePopup,
            handlePopupConfirm,
            closeProfileMenu
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'ChamadoDetalhado',
    components: { ClienteSidebar },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const auth = useAuthStore();
        const chamado = ref(null);
        const tecnico = ref(null);
        const isLoading = ref(false);
        const loadingText = ref('Processando...');
        // 🔹 Estados para o popup
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        // ✅ Função para mostrar popup personalizado
        const showCustomPopup = (type, title, message, confirmText, action) => {
            popupType.value = type;
            popupTitle.value = title;
            popupMessage.value = message;
            popupConfirmText.value = confirmText;
            popupAction.value = action || null;
            showPopup.value = true;
        };
        const closePopup = () => {
            showPopup.value = false;
            popupAction.value = null;
        };
        const handlePopupConfirm = () => {
            if (popupAction.value) {
                popupAction.value();
            }
            closePopup();
        };
        const popupIcon = computed(() => {
            switch (popupType.value) {
                case 'success': return 'check_circle';
                case 'error': return 'error';
                case 'confirm': return 'help';
                default: return 'info';
            }
        });
        // ✅ Função para buscar os detalhes do chamado
        const carregarChamado = async () => {
            try {
                const id = route.params.id;
                const token = auth.access;
                if (!token) {
                    alert('Sessão expirada. Faça login novamente.');
                    router.push('/');
                    return;
                }
                const response = await api.get(`/chamados/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;
                chamado.value = {
                    id: data.id,
                    titulo: data.title,
                    descricao: data.description,
                    ambiente: data.environment?.name || '---',
                    imagem: data.photo || null,
                    status: data.status,
                    prioridade: data.prioridade,
                    criadoEm: new Date(data.dt_criacao).toLocaleString('pt-BR'),
                    atualizadoEm: new Date(data.update_date).toLocaleString('pt-BR'),
                    criadoPor: {
                        nome: data.creator?.name || '---',
                        email: data.creator?.email || '---',
                    },
                };
                // ✅ Técnico responsável (ajustado para os dois possíveis campos)
                if (data.employee) {
                    tecnico.value = {
                        name: data.employee.name || '---',
                        email: data.employee.email || '---'
                    };
                }
                else if (data.assigned_to) {
                    tecnico.value = {
                        name: data.assigned_to.name || '---',
                        email: data.assigned_to.email || '---'
                    };
                }
                else {
                    tecnico.value = {
                        name: 'Não atribuído',
                        email: 'Não atribuído'
                    };
                }
                console.log('📋 Chamado carregado:', chamado.value);
            }
            catch (error) {
                console.error('❌ Erro ao carregar chamado:', error.response?.data || error);
                showCustomPopup('error', 'Erro', 'Erro ao carregar detalhes do chamado.', 'OK');
            }
        };
        // ✅ Funções auxiliares para exibição de status e prioridade
        const statusClass = (status) => {
            const s = status?.toLowerCase() || '';
            if (s.includes('concl'))
                return 'status-concluido';
            if (s.includes('aberto'))
                return 'status-aberto';
            if (s.includes('aguard'))
                return 'status-aguardando';
            if (s.includes('andamento'))
                return 'status-andamento';
            if (s.includes('cancel'))
                return 'status-cancelado';
            return '';
        };
        const statusIcon = (status) => {
            const s = status?.toLowerCase() || '';
            if (s.includes('concl'))
                return 'check_circle';
            if (s.includes('aberto'))
                return 'radio_button_unchecked';
            if (s.includes('aguard'))
                return 'hourglass_top';
            if (s.includes('andamento'))
                return 'autorenew';
            if (s.includes('cancel'))
                return 'cancel';
            return 'info';
        };
        const prioridadeClass = (p) => {
            switch (p?.toLowerCase()) {
                case 'alta': return 'prioridade-alta';
                case 'media': return 'prioridade-media';
                case 'baixa': return 'prioridade-baixa';
                default: return '';
            }
        };
        const prioridadeIcon = (p) => {
            switch (p?.toLowerCase()) {
                case 'alta': return 'arrow_upward';
                case 'media': return 'remove';
                case 'baixa': return 'arrow_downward';
                default: return '';
            }
        };
        const formatarPrioridade = (p) => {
            switch (p?.toLowerCase()) {
                case 'alta': return 'Alta';
                case 'media': return 'Média';
                case 'baixa': return 'Baixa';
                default: return p;
            }
        };
        // ✅ Confirmar encerramento do chamado
        const confirmarEncerramento = () => {
            showCustomPopup('confirm', 'Encerrar Chamado', 'Tem certeza que deseja encerrar este chamado? Esta ação não pode ser desfeita.', 'Encerrar', encerrarChamado);
        };
        // ✅ Função para encerrar o chamado
        const encerrarChamado = async () => {
            try {
                isLoading.value = true;
                loadingText.value = 'Encerrando chamado...';
                const id = route.params.id;
                const token = auth.access;
                if (!token) {
                    showCustomPopup('error', 'Erro de Sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                    return;
                }
                await api.patch(`/chamados/${id}/encerrar/`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                showCustomPopup('success', 'Sucesso!', 'Chamado encerrado com sucesso! Você será redirecionado para a lista de chamados.', 'OK', () => {
                    router.push('/cliente/meus-chamados');
                });
            }
            catch (error) {
                console.error('❌ Erro ao encerrar chamado:', error.response?.data || error);
                let errorMessage = 'Erro ao encerrar chamado. Tente novamente.';
                if (error.response?.data) {
                    if (typeof error.response.data === 'object') {
                        errorMessage = Object.values(error.response.data).flat().join('\n');
                    }
                    else {
                        errorMessage = error.response.data;
                    }
                }
                showCustomPopup('error', 'Erro', errorMessage, 'OK');
            }
            finally {
                isLoading.value = false;
            }
        };
        const closeProfileMenu = () => {
            // Fecha o menu de perfil
        };
        onMounted(() => {
            carregarChamado();
        });
        return {
            chamado,
            tecnico,
            isLoading,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            loadingText,
            statusClass,
            statusIcon,
            prioridadeClass,
            prioridadeIcon,
            formatarPrioridade,
            confirmarEncerramento,
            encerrarChamado,
            closePopup,
            handlePopupConfirm,
            closeProfileMenu
        };
    },
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { ClienteSidebar };
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-editar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-editar']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-encerrar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-encerrar']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['success']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['error']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['chamado-detalhado-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['title-edit-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['date-info']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "chamado-detalhado-page" },
});
// @ts-ignore
[closeProfileMenu,];
const __VLS_0 = {}.ClienteSidebar;
/** @type {[typeof __VLS_components.ClienteSidebar, typeof __VLS_components.clienteSidebar, ]} */ ;
// @ts-ignore
ClienteSidebar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)({
    ...{ class: "main-content" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "content-area" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$router.push('/cliente/meus-chamados');
            // @ts-ignore
            [$router,];
        } },
    ...{ class: "back-container" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons back-icon" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "back-text" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "title-edit-container" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "page-title" },
});
if (__VLS_ctx.chamado) {
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.chamado))
                    return;
                __VLS_ctx.$router.push(`/cliente/editar-chamado/${__VLS_ctx.chamado.id}`);
                // @ts-ignore
                [$router, chamado,];
            } },
        ...{ class: "btn-editar" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
}
if (__VLS_ctx.chamado) {
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "cards-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card-form" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "header-info" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "chamado-id" },
    });
    (__VLS_ctx.chamado.id);
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: (['status-badge', __VLS_ctx.statusClass(__VLS_ctx.chamado.status)]) },
    });
    // @ts-ignore
    [chamado, statusClass,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons status-icon" },
    });
    (__VLS_ctx.statusIcon(__VLS_ctx.chamado.status));
    // @ts-ignore
    [chamado, statusIcon,];
    (__VLS_ctx.chamado.status);
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
        ...{ class: "chamado-titulo" },
    });
    (__VLS_ctx.chamado.titulo);
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.chamado.descricao);
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.chamado.ambiente || '---');
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: (['prioridade-badge', __VLS_ctx.prioridadeClass(__VLS_ctx.chamado.prioridade)]) },
    });
    // @ts-ignore
    [chamado, prioridadeClass,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons prioridade-icon" },
    });
    (__VLS_ctx.prioridadeIcon(__VLS_ctx.chamado.prioridade));
    // @ts-ignore
    [chamado, prioridadeIcon,];
    (__VLS_ctx.formatarPrioridade(__VLS_ctx.chamado.prioridade));
    // @ts-ignore
    [chamado, formatarPrioridade,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    if (__VLS_ctx.chamado.imagem) {
        // @ts-ignore
        [chamado,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
        __VLS_asFunctionalElement(__VLS_elements.img)({
            src: (__VLS_ctx.chamado.imagem),
            alt: "Imagem do chamado",
            ...{ class: "chamado-imagem" },
        });
        // @ts-ignore
        [chamado,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "info-text" },
        });
    }
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
    (__VLS_ctx.chamado.criadoEm);
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "date-container right" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "date-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text date-text" },
    });
    (__VLS_ctx.chamado.atualizadoEm);
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.chamado.criadoPor.nome);
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.chamado.criadoPor.email);
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card-summary" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
        ...{ class: "card-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "summary-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.br)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "summary-text tecnico-text" },
    });
    (__VLS_ctx.tecnico?.name || '---');
    // @ts-ignore
    [tecnico,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "summary-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.br)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "summary-text tecnico-text" },
    });
    (__VLS_ctx.tecnico?.email || '---');
    // @ts-ignore
    [tecnico,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.confirmarEncerramento) },
        ...{ class: "btn-encerrar" },
    });
    // @ts-ignore
    [confirmarEncerramento,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
if (__VLS_ctx.showPopup) {
    // @ts-ignore
    [showPopup,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.closePopup) },
        ...{ class: "popup-overlay" },
    });
    // @ts-ignore
    [closePopup,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "popup-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "popup-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons popup-icon" },
        ...{ class: (__VLS_ctx.popupType) },
    });
    // @ts-ignore
    [popupType,];
    (__VLS_ctx.popupIcon);
    // @ts-ignore
    [popupIcon,];
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "popup-title" },
    });
    (__VLS_ctx.popupTitle);
    // @ts-ignore
    [popupTitle,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "popup-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "popup-message" },
    });
    (__VLS_ctx.popupMessage);
    // @ts-ignore
    [popupMessage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "popup-actions" },
    });
    if (__VLS_ctx.popupType === 'confirm') {
        // @ts-ignore
        [popupType,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.closePopup) },
            ...{ class: "popup-btn popup-btn-cancel" },
            disabled: (__VLS_ctx.isLoading),
        });
        // @ts-ignore
        [closePopup, isLoading,];
    }
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.handlePopupConfirm) },
        ...{ class: "popup-btn popup-btn-confirm" },
        ...{ class: (__VLS_ctx.popupType) },
        disabled: (__VLS_ctx.isLoading),
    });
    // @ts-ignore
    [popupType, isLoading, handlePopupConfirm,];
    (__VLS_ctx.isLoading ? 'Processando...' : __VLS_ctx.popupConfirmText);
    // @ts-ignore
    [isLoading, popupConfirmText,];
}
if (__VLS_ctx.isLoading) {
    // @ts-ignore
    [isLoading,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-overlay" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-spinner" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "loading-text" },
    });
    (__VLS_ctx.loadingText);
    // @ts-ignore
    [loadingText,];
}
/** @type {__VLS_StyleScopedClasses['chamado-detalhado-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['back-text']} */ ;
/** @type {__VLS_StyleScopedClasses['title-edit-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-editar']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['header-info']} */ ;
/** @type {__VLS_StyleScopedClasses['chamado-id']} */ ;
/** @type {__VLS_StyleScopedClasses['status-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['status-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['chamado-titulo']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['prioridade-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['prioridade-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['chamado-imagem']} */ ;
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
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-item']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['tecnico-text']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-item']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['tecnico-text']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-encerrar']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-title']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-content']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-message']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-text']} */ ;
export default {};
//# sourceMappingURL=chamadoDetalhado.vue.js.map