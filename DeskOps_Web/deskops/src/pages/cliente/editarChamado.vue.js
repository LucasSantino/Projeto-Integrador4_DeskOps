import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import ClienteSidebar from '@/components/layouts/clienteSidebar.vue';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'EditarChamado',
    components: { ClienteSidebar },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const auth = useAuthStore();
        const titulo = ref('');
        const descricao = ref('');
        const prioridade = ref('');
        const imagem = ref(null);
        const imagemURL = ref(null);
        const ambientes = ref([]);
        const ambienteSelecionado = ref('');
        const isLoading = ref(false);
        const loadingText = ref('Carregando...');
        const maxDescricaoChars = 2830;
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        const prioridades = ref([
            { value: 'alta', label: 'Alta' },
            { value: 'media', label: 'Média' },
            { value: 'baixa', label: 'Baixa' },
        ]);
        const carregarAmbientes = async () => {
            try {
                const token = auth.access;
                const response = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                ambientes.value = response.data.results || response.data;
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambientes:', error.response?.data || error);
            }
        };
        const obterNomeAmbiente = (ambienteId) => {
            const ambiente = ambientes.value.find((a) => a.id === ambienteId);
            return ambiente ? (ambiente.nome || ambiente.name || `Ambiente #${ambiente.id}`) : '';
        };
        const carregarChamado = async () => {
            try {
                const id = route.params.id;
                const token = auth.access;
                const response = await api.get(`/chamados/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const chamado = response.data;
                titulo.value = chamado.title;
                descricao.value = chamado.description;
                prioridade.value = chamado.prioridade?.toLowerCase() || '';
                ambienteSelecionado.value = chamado.environment?.id || chamado.environment_id || '';
                if (chamado.photo)
                    imagemURL.value = chamado.photo;
            }
            catch (error) {
                console.error('Erro ao carregar chamado:', error);
            }
        };
        const confirmarSalvamento = () => {
            if (!titulo.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o título do chamado.', 'OK');
                return;
            }
            if (!descricao.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe a descrição do problema.', 'OK');
                return;
            }
            if (!ambienteSelecionado.value) {
                showCustomPopup('error', 'Campo obrigatório', 'Selecione um ambiente.', 'OK');
                return;
            }
            if (!prioridade.value) {
                showCustomPopup('error', 'Campo obrigatório', 'Selecione a prioridade.', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar alterações', 'Deseja salvar as alterações neste chamado?', 'Salvar', salvarChamado);
        };
        const salvarChamado = async () => {
            try {
                isLoading.value = true;
                loadingText.value = 'Salvando alterações...';
                const id = route.params.id;
                const token = auth.access;
                const formData = new FormData();
                formData.append('title', titulo.value);
                formData.append('description', descricao.value);
                formData.append('prioridade', prioridade.value.toUpperCase());
                formData.append('environment_id', ambienteSelecionado.value);
                if (imagem.value)
                    formData.append('photo', imagem.value);
                await api.patch(`/chamados/${id}/`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                showCustomPopup('success', 'Sucesso!', 'Chamado atualizado com sucesso!', 'OK', () => router.push('/cliente/meus-chamados'));
            }
            catch (error) {
                console.error('Erro ao salvar chamado:', error.response?.data || error);
                showCustomPopup('error', 'Erro', 'Falha ao salvar o chamado.', 'OK');
            }
            finally {
                isLoading.value = false;
            }
        };
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
            if (popupAction.value)
                popupAction.value();
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
        const prioridadeClass = (p) => {
            switch (p.toLowerCase()) {
                case 'alta': return 'prioridade-alta';
                case 'media': return 'prioridade-media';
                case 'baixa': return 'prioridade-baixa';
                default: return '';
            }
        };
        const prioridadeIcon = (p) => {
            switch (p.toLowerCase()) {
                case 'alta': return 'arrow_upward';
                case 'media': return 'remove';
                case 'baixa': return 'arrow_downward';
                default: return '';
            }
        };
        const formatarPrioridade = (p) => {
            switch (p.toLowerCase()) {
                case 'alta': return 'Alta';
                case 'media': return 'Média';
                case 'baixa': return 'Baixa';
                default: return p;
            }
        };
        const onFileChange = (event) => {
            const target = event.target;
            if (target.files && target.files[0]) {
                imagem.value = target.files[0];
                imagemURL.value = URL.createObjectURL(target.files[0]);
            }
        };
        const closeProfileMenu = () => {
            // Fecha o menu de perfil
        };
        onMounted(() => {
            carregarAmbientes();
            carregarChamado();
        });
        return {
            titulo,
            descricao,
            prioridade,
            ambientes,
            ambienteSelecionado,
            prioridades,
            imagem,
            imagemURL,
            isLoading,
            loadingText,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            confirmarSalvamento,
            salvarChamado,
            closePopup,
            handlePopupConfirm,
            onFileChange,
            prioridadeClass,
            prioridadeIcon,
            formatarPrioridade,
            obterNomeAmbiente,
            maxDescricaoChars,
            closeProfileMenu
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'EditarChamado',
    components: { ClienteSidebar },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const auth = useAuthStore();
        const titulo = ref('');
        const descricao = ref('');
        const prioridade = ref('');
        const imagem = ref(null);
        const imagemURL = ref(null);
        const ambientes = ref([]);
        const ambienteSelecionado = ref('');
        const isLoading = ref(false);
        const loadingText = ref('Carregando...');
        const maxDescricaoChars = 2830;
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        const prioridades = ref([
            { value: 'alta', label: 'Alta' },
            { value: 'media', label: 'Média' },
            { value: 'baixa', label: 'Baixa' },
        ]);
        const carregarAmbientes = async () => {
            try {
                const token = auth.access;
                const response = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                ambientes.value = response.data.results || response.data;
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambientes:', error.response?.data || error);
            }
        };
        const obterNomeAmbiente = (ambienteId) => {
            const ambiente = ambientes.value.find((a) => a.id === ambienteId);
            return ambiente ? (ambiente.nome || ambiente.name || `Ambiente #${ambiente.id}`) : '';
        };
        const carregarChamado = async () => {
            try {
                const id = route.params.id;
                const token = auth.access;
                const response = await api.get(`/chamados/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const chamado = response.data;
                titulo.value = chamado.title;
                descricao.value = chamado.description;
                prioridade.value = chamado.prioridade?.toLowerCase() || '';
                ambienteSelecionado.value = chamado.environment?.id || chamado.environment_id || '';
                if (chamado.photo)
                    imagemURL.value = chamado.photo;
            }
            catch (error) {
                console.error('Erro ao carregar chamado:', error);
            }
        };
        const confirmarSalvamento = () => {
            if (!titulo.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o título do chamado.', 'OK');
                return;
            }
            if (!descricao.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe a descrição do problema.', 'OK');
                return;
            }
            if (!ambienteSelecionado.value) {
                showCustomPopup('error', 'Campo obrigatório', 'Selecione um ambiente.', 'OK');
                return;
            }
            if (!prioridade.value) {
                showCustomPopup('error', 'Campo obrigatório', 'Selecione a prioridade.', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar alterações', 'Deseja salvar as alterações neste chamado?', 'Salvar', salvarChamado);
        };
        const salvarChamado = async () => {
            try {
                isLoading.value = true;
                loadingText.value = 'Salvando alterações...';
                const id = route.params.id;
                const token = auth.access;
                const formData = new FormData();
                formData.append('title', titulo.value);
                formData.append('description', descricao.value);
                formData.append('prioridade', prioridade.value.toUpperCase());
                formData.append('environment_id', ambienteSelecionado.value);
                if (imagem.value)
                    formData.append('photo', imagem.value);
                await api.patch(`/chamados/${id}/`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                showCustomPopup('success', 'Sucesso!', 'Chamado atualizado com sucesso!', 'OK', () => router.push('/cliente/meus-chamados'));
            }
            catch (error) {
                console.error('Erro ao salvar chamado:', error.response?.data || error);
                showCustomPopup('error', 'Erro', 'Falha ao salvar o chamado.', 'OK');
            }
            finally {
                isLoading.value = false;
            }
        };
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
            if (popupAction.value)
                popupAction.value();
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
        const prioridadeClass = (p) => {
            switch (p.toLowerCase()) {
                case 'alta': return 'prioridade-alta';
                case 'media': return 'prioridade-media';
                case 'baixa': return 'prioridade-baixa';
                default: return '';
            }
        };
        const prioridadeIcon = (p) => {
            switch (p.toLowerCase()) {
                case 'alta': return 'arrow_upward';
                case 'media': return 'remove';
                case 'baixa': return 'arrow_downward';
                default: return '';
            }
        };
        const formatarPrioridade = (p) => {
            switch (p.toLowerCase()) {
                case 'alta': return 'Alta';
                case 'media': return 'Média';
                case 'baixa': return 'Baixa';
                default: return p;
            }
        };
        const onFileChange = (event) => {
            const target = event.target;
            if (target.files && target.files[0]) {
                imagem.value = target.files[0];
                imagemURL.value = URL.createObjectURL(target.files[0]);
            }
        };
        const closeProfileMenu = () => {
            // Fecha o menu de perfil
        };
        onMounted(() => {
            carregarAmbientes();
            carregarChamado();
        });
        return {
            titulo,
            descricao,
            prioridade,
            ambientes,
            ambienteSelecionado,
            prioridades,
            imagem,
            imagemURL,
            isLoading,
            loadingText,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            confirmarSalvamento,
            salvarChamado,
            closePopup,
            handlePopupConfirm,
            onFileChange,
            prioridadeClass,
            prioridadeIcon,
            formatarPrioridade,
            obterNomeAmbiente,
            maxDescricaoChars,
            closeProfileMenu
        };
    }
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
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['file-button']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-section']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
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
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['editar-chamado-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "editar-chamado-page" },
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
    value: (__VLS_ctx.titulo),
    placeholder: "Digite o título do chamado",
    ...{ class: "form-input" },
});
// @ts-ignore
[titulo,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
    value: (__VLS_ctx.descricao),
    placeholder: "Descreva o problema",
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
for (const [amb] of __VLS_getVForSourceType((__VLS_ctx.ambientes))) {
    // @ts-ignore
    [ambientes,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        key: (amb.id),
        value: (amb.id),
    });
    (amb.nome || amb.name || `Ambiente #${amb.id}`);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
    value: (__VLS_ctx.prioridade),
    ...{ class: "form-select" },
});
// @ts-ignore
[prioridade,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "",
    disabled: true,
});
for (const [p] of __VLS_getVForSourceType((__VLS_ctx.prioridades))) {
    // @ts-ignore
    [prioridades,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        key: (p.value),
        value: (p.value),
    });
    (p.label);
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "file-upload" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    ...{ class: "file-label" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    ...{ onChange: (__VLS_ctx.onFileChange) },
    type: "file",
    ...{ class: "file-input" },
});
// @ts-ignore
[onFileChange,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "file-button" },
});
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "file-text" },
});
(__VLS_ctx.imagem ? __VLS_ctx.imagem.name : (__VLS_ctx.imagemURL ? 'Imagem atual carregada' : 'Nenhum arquivo escolhido'));
// @ts-ignore
[imagem, imagem, imagemURL,];
if (__VLS_ctx.imagemURL) {
    // @ts-ignore
    [imagemURL,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (__VLS_ctx.imagemURL),
        alt: "Imagem",
        ...{ style: {} },
    });
    // @ts-ignore
    [imagemURL,];
}
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
(__VLS_ctx.titulo || 'Nenhum título');
// @ts-ignore
[titulo,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "summary-section" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-label" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-value" },
});
(__VLS_ctx.descricao || 'Nenhuma descrição');
// @ts-ignore
[descricao,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "summary-section" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-label" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-value" },
});
(__VLS_ctx.obterNomeAmbiente(__VLS_ctx.ambienteSelecionado) || 'Nenhum selecionado');
// @ts-ignore
[ambienteSelecionado, obterNomeAmbiente,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "summary-section" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-label" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-value" },
});
if (__VLS_ctx.prioridade) {
    // @ts-ignore
    [prioridade,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: (['prioridade-badge', __VLS_ctx.prioridadeClass(__VLS_ctx.prioridade)]) },
    });
    // @ts-ignore
    [prioridade, prioridadeClass,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons prioridade-icon" },
    });
    (__VLS_ctx.prioridadeIcon(__VLS_ctx.prioridade));
    // @ts-ignore
    [prioridade, prioridadeIcon,];
    (__VLS_ctx.formatarPrioridade(__VLS_ctx.prioridade));
    // @ts-ignore
    [prioridade, formatarPrioridade,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "summary-section" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-label" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-value" },
});
if (__VLS_ctx.imagemURL) {
    // @ts-ignore
    [imagemURL,];
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (__VLS_ctx.imagemURL),
        alt: "Imagem selecionada",
        ...{ style: {} },
    });
    // @ts-ignore
    [imagemURL,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({});
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "save-btn-container" },
});
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.salvarChamado) },
    ...{ class: "save-btn" },
});
// @ts-ignore
[salvarChamado,];
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
    (__VLS_ctx.loadingText);
    // @ts-ignore
    [loadingText,];
}
/** @type {__VLS_StyleScopedClasses['editar-chamado-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
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
/** @type {__VLS_StyleScopedClasses['file-upload']} */ ;
/** @type {__VLS_StyleScopedClasses['file-label']} */ ;
/** @type {__VLS_StyleScopedClasses['file-input']} */ ;
/** @type {__VLS_StyleScopedClasses['file-button']} */ ;
/** @type {__VLS_StyleScopedClasses['file-text']} */ ;
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
/** @type {__VLS_StyleScopedClasses['prioridade-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['prioridade-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-section']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-label']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-value']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn-container']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
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
//# sourceMappingURL=editarChamado.vue.js.map