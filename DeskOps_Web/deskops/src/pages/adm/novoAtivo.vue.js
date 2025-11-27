import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdmSidebar from '@/components/layouts/admSidebar.vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'NovoAtivo',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const token = auth.access;
        const nome = ref('');
        const descricao = ref('');
        const ambienteSelecionado = ref('');
        const status = ref('');
        const maxDescricaoChars = 400;
        const ambientes = ref([]);
        // Estados para o popup e loading
        const showPopup = ref(false);
        const isLoading = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        // 🔹 Buscar ambientes reais do backend
        const carregarAmbientes = async () => {
            try {
                const response = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data.results || response.data;
                ambientes.value = data.map((a) => ({
                    id: a.id,
                    nome: a.name,
                    localizacao: a.description || 'Sem descrição'
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambientes:', error.response?.data || error);
                showCustomPopup('error', 'Erro', 'Erro ao carregar ambientes.', 'OK');
            }
        };
        onMounted(() => {
            carregarAmbientes();
        });
        const descricaoLimitada = computed(() => {
            if (!descricao.value)
                return 'Nenhuma descrição informada';
            return descricao.value.length > 100
                ? descricao.value.substring(0, 100) + '...'
                : descricao.value;
        });
        const ambienteNome = computed(() => {
            if (!ambienteSelecionado.value)
                return 'Nenhum ambiente selecionado';
            const ambiente = ambientes.value.find(a => a.id === ambienteSelecionado.value);
            return ambiente ? `${ambiente.nome} - ${ambiente.localizacao}` : 'Nenhum ambiente selecionado';
        });
        const statusFormatado = computed(() => {
            switch (status.value) {
                case 'ativo': return 'Ativo';
                case 'manutencao': return 'Em Manutenção';
                default: return 'Nenhum status selecionado';
            }
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
        // ✅ Enviar ativo para o backend
        const submitAtivo = async () => {
            if (!nome.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o nome do ativo', 'OK');
                return;
            }
            if (!descricao.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe a descrição do ativo', 'OK');
                return;
            }
            if (!ambienteSelecionado.value) {
                showCustomPopup('error', 'Campo obrigatório', 'Selecione um ambiente', 'OK');
                return;
            }
            if (!status.value) {
                showCustomPopup('error', 'Campo obrigatório', 'Selecione um status', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar Cadastro', 'Tem certeza que deseja cadastrar este ativo?', 'Cadastrar', confirmCreateAtivo);
        };
        const confirmCreateAtivo = async () => {
            isLoading.value = true;
            // 🔹 Mapeia para o formato aceito pelo backend
            const statusMap = {
                ativo: 'ATIVO',
                manutencao: 'EM_MANUTENCAO'
            };
            const ativoData = {
                name: nome.value.trim(),
                description: descricao.value.trim(),
                environment_FK: Number(ambienteSelecionado.value),
                status: statusMap[status.value] || 'ATIVO'
            };
            console.log('📦 Enviando ativo:', ativoData);
            try {
                const response = await api.post('/ativo/', ativoData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✅ Ativo cadastrado:', response.data);
                showCustomPopup('success', 'Sucesso!', 'Ativo cadastrado com sucesso!', 'OK', () => router.push('/adm/gestao-ativos'));
            }
            catch (error) {
                console.error('❌ Erro ao cadastrar ativo:', error.response?.data || error);
                let errorMessage = 'Erro desconhecido ao cadastrar ativo.';
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
        return {
            nome,
            descricao,
            ambienteSelecionado,
            status,
            ambientes,
            maxDescricaoChars,
            descricaoLimitada,
            ambienteNome,
            statusFormatado,
            showPopup,
            isLoading,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            closeProfileMenu,
            submitAtivo,
            closePopup,
            handlePopupConfirm
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'NovoAtivo',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const token = auth.access;
        const nome = ref('');
        const descricao = ref('');
        const ambienteSelecionado = ref('');
        const status = ref('');
        const maxDescricaoChars = 400;
        const ambientes = ref([]);
        // Estados para o popup e loading
        const showPopup = ref(false);
        const isLoading = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        // 🔹 Buscar ambientes reais do backend
        const carregarAmbientes = async () => {
            try {
                const response = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data.results || response.data;
                ambientes.value = data.map((a) => ({
                    id: a.id,
                    nome: a.name,
                    localizacao: a.description || 'Sem descrição'
                }));
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambientes:', error.response?.data || error);
                showCustomPopup('error', 'Erro', 'Erro ao carregar ambientes.', 'OK');
            }
        };
        onMounted(() => {
            carregarAmbientes();
        });
        const descricaoLimitada = computed(() => {
            if (!descricao.value)
                return 'Nenhuma descrição informada';
            return descricao.value.length > 100
                ? descricao.value.substring(0, 100) + '...'
                : descricao.value;
        });
        const ambienteNome = computed(() => {
            if (!ambienteSelecionado.value)
                return 'Nenhum ambiente selecionado';
            const ambiente = ambientes.value.find(a => a.id === ambienteSelecionado.value);
            return ambiente ? `${ambiente.nome} - ${ambiente.localizacao}` : 'Nenhum ambiente selecionado';
        });
        const statusFormatado = computed(() => {
            switch (status.value) {
                case 'ativo': return 'Ativo';
                case 'manutencao': return 'Em Manutenção';
                default: return 'Nenhum status selecionado';
            }
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
        // ✅ Enviar ativo para o backend
        const submitAtivo = async () => {
            if (!nome.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o nome do ativo', 'OK');
                return;
            }
            if (!descricao.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe a descrição do ativo', 'OK');
                return;
            }
            if (!ambienteSelecionado.value) {
                showCustomPopup('error', 'Campo obrigatório', 'Selecione um ambiente', 'OK');
                return;
            }
            if (!status.value) {
                showCustomPopup('error', 'Campo obrigatório', 'Selecione um status', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar Cadastro', 'Tem certeza que deseja cadastrar este ativo?', 'Cadastrar', confirmCreateAtivo);
        };
        const confirmCreateAtivo = async () => {
            isLoading.value = true;
            // 🔹 Mapeia para o formato aceito pelo backend
            const statusMap = {
                ativo: 'ATIVO',
                manutencao: 'EM_MANUTENCAO'
            };
            const ativoData = {
                name: nome.value.trim(),
                description: descricao.value.trim(),
                environment_FK: Number(ambienteSelecionado.value),
                status: statusMap[status.value] || 'ATIVO'
            };
            console.log('📦 Enviando ativo:', ativoData);
            try {
                const response = await api.post('/ativo/', ativoData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✅ Ativo cadastrado:', response.data);
                showCustomPopup('success', 'Sucesso!', 'Ativo cadastrado com sucesso!', 'OK', () => router.push('/adm/gestao-ativos'));
            }
            catch (error) {
                console.error('❌ Erro ao cadastrar ativo:', error.response?.data || error);
                let errorMessage = 'Erro desconhecido ao cadastrar ativo.';
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
        return {
            nome,
            descricao,
            ambienteSelecionado,
            status,
            ambientes,
            maxDescricaoChars,
            descricaoLimitada,
            ambienteNome,
            statusFormatado,
            showPopup,
            isLoading,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            closeProfileMenu,
            submitAtivo,
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
/** @type {__VLS_StyleScopedClasses['novo-ativo-page']} */ ;
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
    ...{ class: "novo-ativo-page" },
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
            __VLS_ctx.$router.push('/adm/gestao-ativos');
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
    placeholder: "Digite o nome do ativo",
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
    placeholder: "Descreva as características e finalidade do ativo",
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
    value: (__VLS_ctx.ambienteSelecionado),
    ...{ class: "form-select" },
});
// @ts-ignore
[ambienteSelecionado,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "",
    disabled: true,
});
for (const [ambiente] of __VLS_getVForSourceType((__VLS_ctx.ambientes))) {
    // @ts-ignore
    [ambientes,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        key: (ambiente.id),
        value: (ambiente.id),
    });
    (ambiente.nome);
    (ambiente.localizacao);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.status),
    ...{ class: "form-select" },
});
// @ts-ignore
[status,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "",
    disabled: true,
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "ativo",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "manutencao",
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
(__VLS_ctx.ambienteNome || 'Nenhum ambiente selecionado');
// @ts-ignore
[ambienteNome,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "summary-section" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-label" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-value" },
});
(__VLS_ctx.statusFormatado || 'Nenhum status selecionado');
// @ts-ignore
[statusFormatado,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "summary-section" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-label" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-value" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "create-btn-container" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.submitAtivo) },
    ...{ class: "create-btn" },
    disabled: (__VLS_ctx.isLoading),
});
// @ts-ignore
[submitAtivo, isLoading,];
(__VLS_ctx.isLoading ? 'Cadastrando...' : 'Cadastrar Ativo');
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
        });
        // @ts-ignore
        [closePopup,];
    }
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.handlePopupConfirm) },
        ...{ class: "popup-btn popup-btn-confirm" },
        ...{ class: (__VLS_ctx.popupType) },
    });
    // @ts-ignore
    [popupType, handlePopupConfirm,];
    (__VLS_ctx.popupConfirmText);
    // @ts-ignore
    [popupConfirmText,];
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
}
/** @type {__VLS_StyleScopedClasses['novo-ativo-page']} */ ;
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
//# sourceMappingURL=novoAtivo.vue.js.map