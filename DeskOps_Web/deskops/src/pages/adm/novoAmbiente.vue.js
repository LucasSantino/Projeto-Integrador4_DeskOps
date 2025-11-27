import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdmSidebar from '@/components/layouts/admSidebar.vue';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'NovoAmbiente',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const nome = ref('');
        const descricao = ref('');
        const funcionarioResponsavel = ref('');
        const funcionarios = ref([]);
        const maxDescricaoChars = 400;
        const isLoading = ref(false);
        const loadingText = ref('Processando...');
        // Estados para o popup
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        // ✅ Buscar lista de funcionários do backend
        const carregarFuncionarios = async () => {
            try {
                const token = auth.access;
                const response = await api.get('/usuarios/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Adapta o formato para seu front
                funcionarios.value = response.data.map((f) => ({
                    id: f.id,
                    nome: f.name,
                    email: f.email
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar funcionários:', error);
                showCustomPopup('error', 'Erro', 'Erro ao carregar lista de funcionários.', 'OK');
            }
        };
        // Computeds para resumo
        const descricaoLimitada = computed(() => {
            if (!descricao.value)
                return 'Nenhuma descrição informada';
            return descricao.value.length > 100
                ? descricao.value.substring(0, 100) + '...'
                : descricao.value;
        });
        const funcionarioResponsavelNome = computed(() => {
            if (!funcionarioResponsavel.value)
                return 'Nenhum responsável';
            const f = funcionarios.value.find(f => f.id === funcionarioResponsavel.value);
            return f ? `${f.nome} - ${f.email}` : 'Nenhum responsável';
        });
        const popupIcon = computed(() => {
            switch (popupType.value) {
                case 'success': return 'check_circle';
                case 'error': return 'error';
                case 'confirm': return 'help';
                default: return 'info';
            }
        });
        const closeProfileMenu = () => { };
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
        // ✅ Enviar dados reais para a API
        const submitAmbiente = async () => {
            if (!nome.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Por favor, informe o nome do ambiente.', 'OK');
                return;
            }
            if (!descricao.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Por favor, informe a descrição do ambiente.', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar Cadastro', 'Tem certeza que deseja cadastrar este ambiente?', 'Cadastrar', confirmarCadastro);
        };
        const confirmarCadastro = async () => {
            const token = auth.access;
            if (!token) {
                showCustomPopup('error', 'Erro de sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
                    router.push('/');
                });
                return;
            }
            isLoading.value = true;
            loadingText.value = 'Cadastrando ambiente...';
            const ambienteData = {
                name: nome.value.trim(),
                description: descricao.value.trim(),
                employee: funcionarioResponsavel.value || null
            };
            try {
                const response = await api.post('/environment/', ambienteData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✅ Ambiente cadastrado:', response.data);
                showCustomPopup('success', 'Sucesso!', 'Ambiente cadastrado com sucesso!', 'OK', () => {
                    // Limpa os campos
                    nome.value = '';
                    descricao.value = '';
                    funcionarioResponsavel.value = '';
                    // Redireciona de volta
                    router.push('/adm/gestao-ambiente');
                });
            }
            catch (error) {
                console.error('❌ Erro ao cadastrar ambiente:', error.response?.data || error);
                let errorMessage = 'Erro ao cadastrar ambiente. Verifique os dados e tente novamente.';
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
        // Carrega a lista de funcionários ao montar
        onMounted(() => {
            carregarFuncionarios();
        });
        return {
            nome,
            descricao,
            funcionarioResponsavel,
            funcionarios,
            descricaoLimitada,
            funcionarioResponsavelNome,
            maxDescricaoChars,
            isLoading,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            loadingText,
            closeProfileMenu,
            submitAmbiente,
            closePopup,
            handlePopupConfirm
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'NovoAmbiente',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const nome = ref('');
        const descricao = ref('');
        const funcionarioResponsavel = ref('');
        const funcionarios = ref([]);
        const maxDescricaoChars = 400;
        const isLoading = ref(false);
        const loadingText = ref('Processando...');
        // Estados para o popup
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        // ✅ Buscar lista de funcionários do backend
        const carregarFuncionarios = async () => {
            try {
                const token = auth.access;
                const response = await api.get('/usuarios/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Adapta o formato para seu front
                funcionarios.value = response.data.map((f) => ({
                    id: f.id,
                    nome: f.name,
                    email: f.email
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar funcionários:', error);
                showCustomPopup('error', 'Erro', 'Erro ao carregar lista de funcionários.', 'OK');
            }
        };
        // Computeds para resumo
        const descricaoLimitada = computed(() => {
            if (!descricao.value)
                return 'Nenhuma descrição informada';
            return descricao.value.length > 100
                ? descricao.value.substring(0, 100) + '...'
                : descricao.value;
        });
        const funcionarioResponsavelNome = computed(() => {
            if (!funcionarioResponsavel.value)
                return 'Nenhum responsável';
            const f = funcionarios.value.find(f => f.id === funcionarioResponsavel.value);
            return f ? `${f.nome} - ${f.email}` : 'Nenhum responsável';
        });
        const popupIcon = computed(() => {
            switch (popupType.value) {
                case 'success': return 'check_circle';
                case 'error': return 'error';
                case 'confirm': return 'help';
                default: return 'info';
            }
        });
        const closeProfileMenu = () => { };
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
        // ✅ Enviar dados reais para a API
        const submitAmbiente = async () => {
            if (!nome.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Por favor, informe o nome do ambiente.', 'OK');
                return;
            }
            if (!descricao.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Por favor, informe a descrição do ambiente.', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar Cadastro', 'Tem certeza que deseja cadastrar este ambiente?', 'Cadastrar', confirmarCadastro);
        };
        const confirmarCadastro = async () => {
            const token = auth.access;
            if (!token) {
                showCustomPopup('error', 'Erro de sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
                    router.push('/');
                });
                return;
            }
            isLoading.value = true;
            loadingText.value = 'Cadastrando ambiente...';
            const ambienteData = {
                name: nome.value.trim(),
                description: descricao.value.trim(),
                employee: funcionarioResponsavel.value || null
            };
            try {
                const response = await api.post('/environment/', ambienteData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✅ Ambiente cadastrado:', response.data);
                showCustomPopup('success', 'Sucesso!', 'Ambiente cadastrado com sucesso!', 'OK', () => {
                    // Limpa os campos
                    nome.value = '';
                    descricao.value = '';
                    funcionarioResponsavel.value = '';
                    // Redireciona de volta
                    router.push('/adm/gestao-ambiente');
                });
            }
            catch (error) {
                console.error('❌ Erro ao cadastrar ambiente:', error.response?.data || error);
                let errorMessage = 'Erro ao cadastrar ambiente. Verifique os dados e tente novamente.';
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
        // Carrega a lista de funcionários ao montar
        onMounted(() => {
            carregarFuncionarios();
        });
        return {
            nome,
            descricao,
            funcionarioResponsavel,
            funcionarios,
            descricaoLimitada,
            funcionarioResponsavelNome,
            maxDescricaoChars,
            isLoading,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            loadingText,
            closeProfileMenu,
            submitAmbiente,
            closePopup,
            handlePopupConfirm
        };
    },
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { AdmSidebar };
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-section']} */ ;
/** @type {__VLS_StyleScopedClasses['create-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['create-btn']} */ ;
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
/** @type {__VLS_StyleScopedClasses['novo-ambiente-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "novo-ambiente-page" },
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
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
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
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "cards-container" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card-form" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card-header" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "card-title" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "card-subtitle" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "text",
    value: (__VLS_ctx.nome),
    placeholder: "Digite o nome do ambiente",
    ...{ class: "form-input" },
    maxlength: "250",
});
// @ts-ignore
[nome,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "char-counter" },
});
(__VLS_ctx.nome.length);
// @ts-ignore
[nome,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
    value: (__VLS_ctx.descricao),
    placeholder: "Descreva as características e finalidade do ambiente",
    maxlength: (__VLS_ctx.maxDescricaoChars),
    ...{ class: "form-textarea" },
});
// @ts-ignore
[descricao, maxDescricaoChars,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "char-counter" },
});
(__VLS_ctx.descricao.length);
(__VLS_ctx.maxDescricaoChars);
// @ts-ignore
[descricao, maxDescricaoChars,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.funcionarioResponsavel),
    ...{ class: "form-select" },
});
// @ts-ignore
[funcionarioResponsavel,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "",
    disabled: true,
});
for (const [funcionario] of __VLS_getVForSourceType((__VLS_ctx.funcionarios))) {
    // @ts-ignore
    [funcionarios,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        key: (funcionario.id),
        value: (funcionario.id),
    });
    (funcionario.nome);
    (funcionario.email);
}
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "card-summary" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({
    ...{ class: "summary-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "summary-section" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-label" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-value" },
});
(__VLS_ctx.nome || 'Nenhum nome informado');
// @ts-ignore
[nome,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "summary-section" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-label" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-value" },
});
(__VLS_ctx.descricaoLimitada);
// @ts-ignore
[descricaoLimitada,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "summary-section" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-label" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-value" },
});
(__VLS_ctx.funcionarioResponsavelNome || 'Nenhum responsável');
// @ts-ignore
[funcionarioResponsavelNome,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "create-btn-container" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.submitAmbiente) },
    ...{ class: "create-btn" },
    disabled: (__VLS_ctx.isLoading),
});
// @ts-ignore
[submitAmbiente, isLoading,];
(__VLS_ctx.isLoading ? 'Cadastrando...' : 'Cadastrar Ambiente');
// @ts-ignore
[isLoading,];
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
/** @type {__VLS_StyleScopedClasses['novo-ambiente-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['back-text']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['char-counter']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['char-counter']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-title']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-section']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-label']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-value']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-section']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-label']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-value']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-section']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-label']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-value']} */ ;
/** @type {__VLS_StyleScopedClasses['create-btn-container']} */ ;
/** @type {__VLS_StyleScopedClasses['create-btn']} */ ;
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
//# sourceMappingURL=novoAmbiente.vue.js.map