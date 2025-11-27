import { defineComponent, ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdmSidebar from '@/components/layouts/admSidebar.vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'DetalhesAmbiente',
    components: { AdmSidebar },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const auth = useAuthStore();
        const ambiente = ref(null);
        const editando = ref(false);
        const isLoading = ref(false);
        const loadingText = ref('Processando...');
        // Estados para o popup
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        const formEdit = reactive({
            nome: '',
            descricao: '',
            responsavel: { nome: '', email: '' }
        });
        // ✅ Buscar ambiente pelo ID da rota
        const carregarAmbiente = async () => {
            try {
                const id = route.params.id;
                const token = auth.access;
                if (!token) {
                    showCustomPopup('error', 'Erro de sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                    return;
                }
                const response = await api.get(`/environment/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const a = response.data;
                ambiente.value = {
                    id: a.id,
                    nome: a.name,
                    descricao: a.description,
                    responsavel: {
                        nome: a.responsible?.name || '---',
                        email: a.responsible?.email || '---'
                    },
                    criadoEm: new Date(a.created_at).toLocaleString('pt-BR'),
                    atualizadoEm: new Date(a.updated_at).toLocaleString('pt-BR')
                };
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambiente:', error.response?.data || error);
                showCustomPopup('error', 'Erro', 'Erro ao carregar detalhes do ambiente.', 'OK', () => {
                    router.push('/adm/gestao-ambiente');
                });
            }
        };
        // Função para mostrar popup personalizado
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
        const iniciarEdicao = () => {
            if (!ambiente.value)
                return;
            formEdit.nome = ambiente.value.nome;
            formEdit.descricao = ambiente.value.descricao;
            formEdit.responsavel = { ...ambiente.value.responsavel };
            editando.value = true;
        };
        const cancelarEdicao = () => {
            editando.value = false;
        };
        const confirmarEdicao = () => {
            if (!ambiente.value)
                return;
            // Validações básicas
            if (!formEdit.nome.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o nome do ambiente.', 'OK');
                return;
            }
            if (!formEdit.descricao.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe a descrição do ambiente.', 'OK');
                return;
            }
            if (!formEdit.responsavel.nome.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o nome do responsável.', 'OK');
                return;
            }
            if (!formEdit.responsavel.email.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o email do responsável.', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar Edição', 'Tem certeza que deseja salvar as alterações neste ambiente?', 'Salvar', salvarEdicao);
        };
        const salvarEdicao = async () => {
            if (!ambiente.value)
                return;
            isLoading.value = true;
            loadingText.value = 'Salvando alterações...';
            try {
                const token = auth.access;
                await api.patch(`/environment/${ambiente.value.id}/`, {
                    name: formEdit.nome,
                    description: formEdit.descricao,
                    responsible: {
                        name: formEdit.responsavel.nome,
                        email: formEdit.responsavel.email
                    }
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Atualiza o objeto ambiente com os novos dados
                if (ambiente.value) {
                    ambiente.value.nome = formEdit.nome;
                    ambiente.value.descricao = formEdit.descricao;
                    ambiente.value.responsavel = { ...formEdit.responsavel };
                    ambiente.value.atualizadoEm = new Date().toLocaleString('pt-BR');
                }
                editando.value = false;
                showCustomPopup('success', 'Sucesso!', 'Alterações salvas com sucesso!', 'OK');
            }
            catch (error) {
                console.error('❌ Erro ao salvar ambiente:', error.response?.data || error);
                let errorMessage = 'Erro ao salvar alterações.';
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
        const confirmarExclusao = () => {
            if (!ambiente.value)
                return;
            showCustomPopup('confirm', 'Confirmar Exclusão', 'Tem certeza que deseja excluir este ambiente? Esta ação não pode ser desfeita.', 'Excluir', excluirAmbiente);
        };
        const excluirAmbiente = async () => {
            if (!ambiente.value)
                return;
            isLoading.value = true;
            loadingText.value = 'Excluindo ambiente...';
            try {
                const token = auth.access;
                await api.delete(`/environment/${ambiente.value.id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showCustomPopup('success', 'Sucesso!', 'Ambiente excluído com sucesso!', 'OK', () => router.push('/adm/gestao-ambiente'));
            }
            catch (error) {
                console.error('❌ Erro ao excluir ambiente:', error.response?.data || error);
                let errorMessage = 'Erro ao excluir ambiente.';
                if (error.response?.data) {
                    if (typeof error.response.data === 'object') {
                        errorMessage = Object.values(error.response.data).flat().join('\n');
                    }
                    else {
                        errorMessage = error.response.data;
                    }
                }
                if (error.response?.status === 404) {
                    errorMessage = 'Este ambiente não existe mais (foi excluído).';
                    showCustomPopup('error', 'Erro', errorMessage, 'OK', () => {
                        router.push('/adm/gestao-ambiente');
                    });
                    return;
                }
                showCustomPopup('error', 'Erro', errorMessage, 'OK');
            }
            finally {
                isLoading.value = false;
            }
        };
        const closeProfileMenu = () => { };
        onMounted(() => {
            carregarAmbiente();
        });
        return {
            ambiente,
            editando,
            formEdit,
            isLoading,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            loadingText,
            closeProfileMenu,
            confirmarExclusao,
            iniciarEdicao,
            cancelarEdicao,
            confirmarEdicao,
            salvarEdicao,
            closePopup,
            handlePopupConfirm
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'DetalhesAmbiente',
    components: { AdmSidebar },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const auth = useAuthStore();
        const ambiente = ref(null);
        const editando = ref(false);
        const isLoading = ref(false);
        const loadingText = ref('Processando...');
        // Estados para o popup
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        const formEdit = reactive({
            nome: '',
            descricao: '',
            responsavel: { nome: '', email: '' }
        });
        // ✅ Buscar ambiente pelo ID da rota
        const carregarAmbiente = async () => {
            try {
                const id = route.params.id;
                const token = auth.access;
                if (!token) {
                    showCustomPopup('error', 'Erro de sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                    return;
                }
                const response = await api.get(`/environment/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const a = response.data;
                ambiente.value = {
                    id: a.id,
                    nome: a.name,
                    descricao: a.description,
                    responsavel: {
                        nome: a.responsible?.name || '---',
                        email: a.responsible?.email || '---'
                    },
                    criadoEm: new Date(a.created_at).toLocaleString('pt-BR'),
                    atualizadoEm: new Date(a.updated_at).toLocaleString('pt-BR')
                };
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambiente:', error.response?.data || error);
                showCustomPopup('error', 'Erro', 'Erro ao carregar detalhes do ambiente.', 'OK', () => {
                    router.push('/adm/gestao-ambiente');
                });
            }
        };
        // Função para mostrar popup personalizado
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
        const iniciarEdicao = () => {
            if (!ambiente.value)
                return;
            formEdit.nome = ambiente.value.nome;
            formEdit.descricao = ambiente.value.descricao;
            formEdit.responsavel = { ...ambiente.value.responsavel };
            editando.value = true;
        };
        const cancelarEdicao = () => {
            editando.value = false;
        };
        const confirmarEdicao = () => {
            if (!ambiente.value)
                return;
            // Validações básicas
            if (!formEdit.nome.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o nome do ambiente.', 'OK');
                return;
            }
            if (!formEdit.descricao.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe a descrição do ambiente.', 'OK');
                return;
            }
            if (!formEdit.responsavel.nome.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o nome do responsável.', 'OK');
                return;
            }
            if (!formEdit.responsavel.email.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o email do responsável.', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar Edição', 'Tem certeza que deseja salvar as alterações neste ambiente?', 'Salvar', salvarEdicao);
        };
        const salvarEdicao = async () => {
            if (!ambiente.value)
                return;
            isLoading.value = true;
            loadingText.value = 'Salvando alterações...';
            try {
                const token = auth.access;
                await api.patch(`/environment/${ambiente.value.id}/`, {
                    name: formEdit.nome,
                    description: formEdit.descricao,
                    responsible: {
                        name: formEdit.responsavel.nome,
                        email: formEdit.responsavel.email
                    }
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Atualiza o objeto ambiente com os novos dados
                if (ambiente.value) {
                    ambiente.value.nome = formEdit.nome;
                    ambiente.value.descricao = formEdit.descricao;
                    ambiente.value.responsavel = { ...formEdit.responsavel };
                    ambiente.value.atualizadoEm = new Date().toLocaleString('pt-BR');
                }
                editando.value = false;
                showCustomPopup('success', 'Sucesso!', 'Alterações salvas com sucesso!', 'OK');
            }
            catch (error) {
                console.error('❌ Erro ao salvar ambiente:', error.response?.data || error);
                let errorMessage = 'Erro ao salvar alterações.';
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
        const confirmarExclusao = () => {
            if (!ambiente.value)
                return;
            showCustomPopup('confirm', 'Confirmar Exclusão', 'Tem certeza que deseja excluir este ambiente? Esta ação não pode ser desfeita.', 'Excluir', excluirAmbiente);
        };
        const excluirAmbiente = async () => {
            if (!ambiente.value)
                return;
            isLoading.value = true;
            loadingText.value = 'Excluindo ambiente...';
            try {
                const token = auth.access;
                await api.delete(`/environment/${ambiente.value.id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                showCustomPopup('success', 'Sucesso!', 'Ambiente excluído com sucesso!', 'OK', () => router.push('/adm/gestao-ambiente'));
            }
            catch (error) {
                console.error('❌ Erro ao excluir ambiente:', error.response?.data || error);
                let errorMessage = 'Erro ao excluir ambiente.';
                if (error.response?.data) {
                    if (typeof error.response.data === 'object') {
                        errorMessage = Object.values(error.response.data).flat().join('\n');
                    }
                    else {
                        errorMessage = error.response.data;
                    }
                }
                if (error.response?.status === 404) {
                    errorMessage = 'Este ambiente não existe mais (foi excluído).';
                    showCustomPopup('error', 'Erro', errorMessage, 'OK', () => {
                        router.push('/adm/gestao-ambiente');
                    });
                    return;
                }
                showCustomPopup('error', 'Erro', errorMessage, 'OK');
            }
            finally {
                isLoading.value = false;
            }
        };
        const closeProfileMenu = () => { };
        onMounted(() => {
            carregarAmbiente();
        });
        return {
            ambiente,
            editando,
            formEdit,
            isLoading,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            loadingText,
            closeProfileMenu,
            confirmarExclusao,
            iniciarEdicao,
            cancelarEdicao,
            confirmarEdicao,
            salvarEdicao,
            closePopup,
            handlePopupConfirm
        };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { AdmSidebar };
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-editar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-editar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-excluir']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-excluir']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancelar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-salvar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-salvar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancelar']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-salvar']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-rapida']} */ ;
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
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['detalhes-ambiente-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['title-container']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-editar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-excluir']} */ ;
/** @type {__VLS_StyleScopedClasses['date-info']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "detalhes-ambiente-page" },
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
if (__VLS_ctx.ambiente) {
    // @ts-ignore
    [ambiente,];
    __VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)({
        ...{ class: "main-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "content-area" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.ambiente))
                    return;
                __VLS_ctx.$router.push('/adm/gestao-ambiente');
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
        ...{ class: "title-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
        ...{ class: "page-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "action-buttons-header" },
    });
    if (!__VLS_ctx.editando) {
        // @ts-ignore
        [editando,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.iniciarEdicao) },
            ...{ class: "btn-editar" },
        });
        // @ts-ignore
        [iniciarEdicao,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "material-icons" },
        });
    }
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.confirmarExclusao) },
        ...{ class: "btn-excluir" },
    });
    // @ts-ignore
    [confirmarExclusao,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "cards-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card-form" },
    });
    if (!__VLS_ctx.editando) {
        // @ts-ignore
        [editando,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "view-mode" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "header-info" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "ambiente-id" },
        });
        (__VLS_ctx.ambiente.id);
        // @ts-ignore
        [ambiente,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "criado-em" },
        });
        (__VLS_ctx.ambiente.criadoEm);
        // @ts-ignore
        [ambiente,];
        __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
            ...{ class: "ambiente-nome" },
        });
        (__VLS_ctx.ambiente.nome);
        // @ts-ignore
        [ambiente,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "info-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "info-text" },
        });
        (__VLS_ctx.ambiente.descricao);
        // @ts-ignore
        [ambiente,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "info-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "info-text" },
        });
        (__VLS_ctx.ambiente.responsavel.nome);
        // @ts-ignore
        [ambiente,];
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "info-text" },
        });
        (__VLS_ctx.ambiente.responsavel.email);
        // @ts-ignore
        [ambiente,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "edit-mode" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "header-info" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "ambiente-id" },
        });
        (__VLS_ctx.ambiente.id);
        // @ts-ignore
        [ambiente,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "criado-em" },
        });
        (__VLS_ctx.ambiente.criadoEm);
        // @ts-ignore
        [ambiente,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
            ...{ class: "section-title" },
        });
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "text",
            value: (__VLS_ctx.formEdit.nome),
            placeholder: "Digite o nome do ambiente",
            ...{ class: "form-input" },
        });
        // @ts-ignore
        [formEdit,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
            ...{ class: "section-title" },
        });
        __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
            value: (__VLS_ctx.formEdit.descricao),
            placeholder: "Descreva o ambiente",
            ...{ class: "form-textarea" },
            rows: "4",
        });
        // @ts-ignore
        [formEdit,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
            ...{ class: "section-title" },
        });
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "text",
            value: (__VLS_ctx.formEdit.responsavel.nome),
            placeholder: "Digite o nome do responsável",
            ...{ class: "form-input" },
        });
        // @ts-ignore
        [formEdit,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
            ...{ class: "section-title" },
        });
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "email",
            placeholder: "Digite o email do responsável",
            ...{ class: "form-input" },
        });
        (__VLS_ctx.formEdit.responsavel.email);
        // @ts-ignore
        [formEdit,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-actions" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.cancelarEdicao) },
            ...{ class: "btn-cancelar" },
        });
        // @ts-ignore
        [cancelarEdicao,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "material-icons" },
        });
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.confirmarEdicao) },
            ...{ class: "btn-salvar" },
            disabled: (__VLS_ctx.isLoading),
        });
        // @ts-ignore
        [confirmarEdicao, isLoading,];
        __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
            ...{ class: "material-icons" },
        });
        (__VLS_ctx.isLoading ? 'Salvando...' : 'Salvar Alterações');
        // @ts-ignore
        [isLoading,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "card-summary" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
        ...{ class: "card-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-rapida" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.ambiente.id);
    // @ts-ignore
    [ambiente,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.ambiente.nome);
    // @ts-ignore
    [ambiente,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.ambiente.responsavel.nome);
    // @ts-ignore
    [ambiente,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "info-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-label" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "info-value" },
    });
    (__VLS_ctx.ambiente.responsavel.email);
    // @ts-ignore
    [ambiente,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "loading-msg" },
    });
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
        [isLoading, closePopup,];
    }
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.handlePopupConfirm) },
        ...{ class: "popup-btn popup-btn-confirm" },
        ...{ class: (__VLS_ctx.popupType) },
        disabled: (__VLS_ctx.isLoading),
    });
    // @ts-ignore
    [isLoading, popupType, handlePopupConfirm,];
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
/** @type {__VLS_StyleScopedClasses['detalhes-ambiente-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['back-text']} */ ;
/** @type {__VLS_StyleScopedClasses['title-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-editar']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-excluir']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['view-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['header-info']} */ ;
/** @type {__VLS_StyleScopedClasses['ambiente-id']} */ ;
/** @type {__VLS_StyleScopedClasses['criado-em']} */ ;
/** @type {__VLS_StyleScopedClasses['ambiente-nome']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['header-info']} */ ;
/** @type {__VLS_StyleScopedClasses['ambiente-id']} */ ;
/** @type {__VLS_StyleScopedClasses['criado-em']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancelar']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-salvar']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
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
/** @type {__VLS_StyleScopedClasses['loading-msg']} */ ;
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
//# sourceMappingURL=detalhesAmbiente.vue.js.map