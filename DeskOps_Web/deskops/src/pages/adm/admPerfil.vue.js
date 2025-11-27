import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import AdmSidebar from '@/components/layouts/admSidebar.vue';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'AdmPerfil',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const editMode = ref(false);
        const isLoading = ref(false);
        const loadingText = ref('Processando...');
        // Estados para o popup
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        const novaSenha = ref('');
        const confirmarSenha = ref('');
        const usuario = ref({
            nome: '',
            email: '',
            cpf: '',
            dataNascimento: '',
            endereco: '',
            tipoUsuario: '',
            foto: '',
        });
        const usuarioEditado = ref({ ...usuario.value });
        const defaultFoto = new URL('../../assets/images/default-avatar.png', import.meta.url).href;
        const selectedPhotoFile = ref(null);
        // ✅ Carregar dados do administrador logado
        const carregarDadosUsuario = async () => {
            try {
                const token = auth.access;
                if (!token) {
                    console.warn('⚠️ Nenhum token encontrado. Redirecionando para login...');
                    router.push('/');
                    return;
                }
                const response = await api.get('/me/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;
                usuario.value = {
                    nome: data.name,
                    email: data.email,
                    cpf: data.cpf || '---',
                    dataNascimento: data.dt_nascimento || '---',
                    endereco: data.endereco || '---',
                    tipoUsuario: data.is_staff ? 'Administrador' : 'Usuário',
                    foto: data.foto_user || '',
                };
                usuarioEditado.value = { ...usuario.value };
                console.log('👤 Dados do administrador carregados:', usuario.value);
            }
            catch (error) {
                console.error('❌ Erro ao carregar dados do administrador:', error.response?.data || error);
                if (error.response?.status === 401) {
                    showCustomPopup('error', 'Sessão Expirada', 'Sua sessão expirou. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                }
            }
        };
        // 🚀 Carregar ao montar componente
        onMounted(() => {
            carregarDadosUsuario();
        });
        // Função para mostrar popup personalizado
        const showCustomPopup = (type, title, message, confirmText, action) => {
            popupType.value = type;
            popupTitle.value = title;
            popupMessage.value = message;
            popupConfirmText.value = confirmText;
            popupAction.value = action || null;
            // Resetar campos de senha quando abrir popup de senha
            if (type === 'password') {
                novaSenha.value = '';
                confirmarSenha.value = '';
            }
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
                case 'password': return 'lock';
                default: return 'info';
            }
        });
        // 🟢 Entrar no modo de edição
        const enterEditMode = () => {
            usuarioEditado.value = { ...usuario.value };
            editMode.value = true;
        };
        // 🟢 Cancelar edição
        const cancelEdit = () => {
            showCustomPopup('confirm', 'Cancelar Edição', 'Tem certeza que deseja cancelar as alterações? Todas as modificações serão perdidas.', 'Confirmar', () => {
                usuarioEditado.value = { ...usuario.value };
                editMode.value = false;
            });
        };
        // 🟢 Confirmar salvamento
        const confirmSaveChanges = () => {
            // Validações básicas
            if (!usuarioEditado.value.nome.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o nome completo.', 'OK');
                return;
            }
            if (!usuarioEditado.value.email.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o email.', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar Alterações', 'Tem certeza que deseja salvar as alterações do perfil?', 'Salvar', saveChanges);
        };
        const saveChanges = async () => {
            try {
                const token = auth.access;
                if (!token) {
                    showCustomPopup('error', 'Erro de Sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                    return;
                }
                isLoading.value = true;
                loadingText.value = 'Salvando alterações...';
                // 🔹 Criar o FormData para enviar texto + arquivo
                const formData = new FormData();
                formData.append('name', usuarioEditado.value.nome);
                formData.append('email', usuarioEditado.value.email);
                formData.append('cpf', usuarioEditado.value.cpf);
                formData.append('dt_nascimento', usuarioEditado.value.dataNascimento);
                formData.append('endereco', usuarioEditado.value.endereco);
                if (selectedPhotoFile.value) {
                    formData.append('foto_user', selectedPhotoFile.value);
                }
                const response = await api.patch('/me/', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                // Atualiza dados na tela
                usuario.value = {
                    ...usuario.value,
                    nome: response.data.name,
                    email: response.data.email,
                    cpf: response.data.cpf,
                    dataNascimento: response.data.dt_nascimento,
                    endereco: response.data.endereco,
                    foto: response.data.foto_user || usuarioEditado.value.foto,
                };
                editMode.value = false;
                selectedPhotoFile.value = null;
                showCustomPopup('success', 'Sucesso!', 'Alterações salvas com sucesso!', 'OK');
            }
            catch (error) {
                console.error('❌ Erro ao salvar alterações:', error.response?.data || error);
                let errorMessage = 'Erro ao salvar alterações. Verifique os campos e tente novamente.';
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
        const changePhoto = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const target = e.target;
                if (target.files && target.files[0]) {
                    const file = target.files[0];
                    selectedPhotoFile.value = file;
                    // Exibe prévia da imagem
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        usuarioEditado.value.foto = e.target?.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };
        // 🟢 Alterar senha
        const changePassword = () => {
            showCustomPopup('password', 'Alterar Senha', 'Digite sua nova senha:', 'Alterar Senha', performPasswordChange);
        };
        const performPasswordChange = async () => {
            if (!novaSenha.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe a nova senha.', 'OK');
                return;
            }
            if (!confirmarSenha.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Confirme a nova senha.', 'OK');
                return;
            }
            if (novaSenha.value !== confirmarSenha.value) {
                showCustomPopup('error', 'Senhas não conferem', 'As senhas digitadas não são iguais.', 'OK');
                return;
            }
            if (novaSenha.value.length < 6) {
                showCustomPopup('error', 'Senha muito curta', 'A senha deve ter pelo menos 6 caracteres.', 'OK');
                return;
            }
            isLoading.value = true;
            loadingText.value = 'Alterando senha...';
            try {
                const token = auth.access;
                if (!token) {
                    showCustomPopup('error', 'Erro de Sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                    return;
                }
                // Simulação de alteração de senha - substitua pela sua API real
                await new Promise(resolve => setTimeout(resolve, 1500));
                showCustomPopup('success', 'Sucesso!', 'Senha alterada com sucesso!', 'OK');
            }
            catch (error) {
                console.error('❌ Erro ao alterar senha:', error);
                showCustomPopup('error', 'Erro', 'Erro ao alterar senha. Tente novamente.', 'OK');
            }
            finally {
                isLoading.value = false;
            }
        };
        return {
            usuario,
            usuarioEditado,
            editMode,
            defaultFoto,
            isLoading,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            loadingText,
            novaSenha,
            confirmarSenha,
            enterEditMode,
            cancelEdit,
            confirmSaveChanges,
            saveChanges,
            changePhoto,
            changePassword,
            closePopup,
            handlePopupConfirm,
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'AdmPerfil',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const editMode = ref(false);
        const isLoading = ref(false);
        const loadingText = ref('Processando...');
        // Estados para o popup
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        const novaSenha = ref('');
        const confirmarSenha = ref('');
        const usuario = ref({
            nome: '',
            email: '',
            cpf: '',
            dataNascimento: '',
            endereco: '',
            tipoUsuario: '',
            foto: '',
        });
        const usuarioEditado = ref({ ...usuario.value });
        const defaultFoto = new URL('../../assets/images/default-avatar.png', import.meta.url).href;
        const selectedPhotoFile = ref(null);
        // ✅ Carregar dados do administrador logado
        const carregarDadosUsuario = async () => {
            try {
                const token = auth.access;
                if (!token) {
                    console.warn('⚠️ Nenhum token encontrado. Redirecionando para login...');
                    router.push('/');
                    return;
                }
                const response = await api.get('/me/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;
                usuario.value = {
                    nome: data.name,
                    email: data.email,
                    cpf: data.cpf || '---',
                    dataNascimento: data.dt_nascimento || '---',
                    endereco: data.endereco || '---',
                    tipoUsuario: data.is_staff ? 'Administrador' : 'Usuário',
                    foto: data.foto_user || '',
                };
                usuarioEditado.value = { ...usuario.value };
                console.log('👤 Dados do administrador carregados:', usuario.value);
            }
            catch (error) {
                console.error('❌ Erro ao carregar dados do administrador:', error.response?.data || error);
                if (error.response?.status === 401) {
                    showCustomPopup('error', 'Sessão Expirada', 'Sua sessão expirou. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                }
            }
        };
        // 🚀 Carregar ao montar componente
        onMounted(() => {
            carregarDadosUsuario();
        });
        // Função para mostrar popup personalizado
        const showCustomPopup = (type, title, message, confirmText, action) => {
            popupType.value = type;
            popupTitle.value = title;
            popupMessage.value = message;
            popupConfirmText.value = confirmText;
            popupAction.value = action || null;
            // Resetar campos de senha quando abrir popup de senha
            if (type === 'password') {
                novaSenha.value = '';
                confirmarSenha.value = '';
            }
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
                case 'password': return 'lock';
                default: return 'info';
            }
        });
        // 🟢 Entrar no modo de edição
        const enterEditMode = () => {
            usuarioEditado.value = { ...usuario.value };
            editMode.value = true;
        };
        // 🟢 Cancelar edição
        const cancelEdit = () => {
            showCustomPopup('confirm', 'Cancelar Edição', 'Tem certeza que deseja cancelar as alterações? Todas as modificações serão perdidas.', 'Confirmar', () => {
                usuarioEditado.value = { ...usuario.value };
                editMode.value = false;
            });
        };
        // 🟢 Confirmar salvamento
        const confirmSaveChanges = () => {
            // Validações básicas
            if (!usuarioEditado.value.nome.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o nome completo.', 'OK');
                return;
            }
            if (!usuarioEditado.value.email.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o email.', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar Alterações', 'Tem certeza que deseja salvar as alterações do perfil?', 'Salvar', saveChanges);
        };
        const saveChanges = async () => {
            try {
                const token = auth.access;
                if (!token) {
                    showCustomPopup('error', 'Erro de Sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                    return;
                }
                isLoading.value = true;
                loadingText.value = 'Salvando alterações...';
                // 🔹 Criar o FormData para enviar texto + arquivo
                const formData = new FormData();
                formData.append('name', usuarioEditado.value.nome);
                formData.append('email', usuarioEditado.value.email);
                formData.append('cpf', usuarioEditado.value.cpf);
                formData.append('dt_nascimento', usuarioEditado.value.dataNascimento);
                formData.append('endereco', usuarioEditado.value.endereco);
                if (selectedPhotoFile.value) {
                    formData.append('foto_user', selectedPhotoFile.value);
                }
                const response = await api.patch('/me/', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                // Atualiza dados na tela
                usuario.value = {
                    ...usuario.value,
                    nome: response.data.name,
                    email: response.data.email,
                    cpf: response.data.cpf,
                    dataNascimento: response.data.dt_nascimento,
                    endereco: response.data.endereco,
                    foto: response.data.foto_user || usuarioEditado.value.foto,
                };
                editMode.value = false;
                selectedPhotoFile.value = null;
                showCustomPopup('success', 'Sucesso!', 'Alterações salvas com sucesso!', 'OK');
            }
            catch (error) {
                console.error('❌ Erro ao salvar alterações:', error.response?.data || error);
                let errorMessage = 'Erro ao salvar alterações. Verifique os campos e tente novamente.';
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
        const changePhoto = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const target = e.target;
                if (target.files && target.files[0]) {
                    const file = target.files[0];
                    selectedPhotoFile.value = file;
                    // Exibe prévia da imagem
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        usuarioEditado.value.foto = e.target?.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };
        // 🟢 Alterar senha
        const changePassword = () => {
            showCustomPopup('password', 'Alterar Senha', 'Digite sua nova senha:', 'Alterar Senha', performPasswordChange);
        };
        const performPasswordChange = async () => {
            if (!novaSenha.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe a nova senha.', 'OK');
                return;
            }
            if (!confirmarSenha.value.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Confirme a nova senha.', 'OK');
                return;
            }
            if (novaSenha.value !== confirmarSenha.value) {
                showCustomPopup('error', 'Senhas não conferem', 'As senhas digitadas não são iguais.', 'OK');
                return;
            }
            if (novaSenha.value.length < 6) {
                showCustomPopup('error', 'Senha muito curta', 'A senha deve ter pelo menos 6 caracteres.', 'OK');
                return;
            }
            isLoading.value = true;
            loadingText.value = 'Alterando senha...';
            try {
                const token = auth.access;
                if (!token) {
                    showCustomPopup('error', 'Erro de Sessão', 'Sessão expirada. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                    return;
                }
                // Simulação de alteração de senha - substitua pela sua API real
                await new Promise(resolve => setTimeout(resolve, 1500));
                showCustomPopup('success', 'Sucesso!', 'Senha alterada com sucesso!', 'OK');
            }
            catch (error) {
                console.error('❌ Erro ao alterar senha:', error);
                showCustomPopup('error', 'Erro', 'Erro ao alterar senha. Tente novamente.', 'OK');
            }
            finally {
                isLoading.value = false;
            }
        };
        return {
            usuario,
            usuarioEditado,
            editMode,
            defaultFoto,
            isLoading,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            loadingText,
            novaSenha,
            confirmarSenha,
            enterEditMode,
            cancelEdit,
            confirmSaveChanges,
            saveChanges,
            changePhoto,
            changePassword,
            closePopup,
            handlePopupConfirm,
        };
    },
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { AdmSidebar };
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['change-photo-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['change-password-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-input']} */ ;
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
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['password']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['password']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['name-container']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['password-section']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-section']} */ ;
/** @type {__VLS_StyleScopedClasses['divider-line']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-section']} */ ;
/** @type {__VLS_StyleScopedClasses['divider-line']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "perfil-page" },
});
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
            __VLS_ctx.$router.push('/adm/dashboard');
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
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "header-actions" },
});
if (!__VLS_ctx.editMode) {
    // @ts-ignore
    [editMode,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.enterEditMode) },
        ...{ class: "edit-btn" },
    });
    // @ts-ignore
    [enterEditMode,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "action-buttons" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.cancelEdit) },
        ...{ class: "cancel-btn" },
    });
    // @ts-ignore
    [cancelEdit,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.confirmSaveChanges) },
        ...{ class: "save-btn" },
        disabled: (__VLS_ctx.isLoading),
    });
    // @ts-ignore
    [confirmSaveChanges, isLoading,];
    (__VLS_ctx.isLoading ? 'Salvando...' : 'Salvar Alterações');
    // @ts-ignore
    [isLoading,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-content" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section profile-section" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile-header" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "foto-container" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: ((__VLS_ctx.editMode ? __VLS_ctx.usuarioEditado.foto : __VLS_ctx.usuario.foto) || __VLS_ctx.defaultFoto),
    alt: "Foto do administrador",
    ...{ class: "perfil-foto" },
});
// @ts-ignore
[editMode, usuarioEditado, usuario, defaultFoto,];
if (__VLS_ctx.editMode) {
    // @ts-ignore
    [editMode,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.changePhoto) },
        ...{ class: "change-photo-btn" },
    });
    // @ts-ignore
    [changePhoto,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "name-container" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
if (!__VLS_ctx.editMode) {
    // @ts-ignore
    [editMode,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.usuario.nome);
    // @ts-ignore
    [usuario,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.input)({
        value: (__VLS_ctx.usuarioEditado.nome),
        type: "text",
        ...{ class: "form-input" },
        placeholder: "Digite seu nome completo",
    });
    // @ts-ignore
    [usuarioEditado,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "divider-line" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
if (!__VLS_ctx.editMode) {
    // @ts-ignore
    [editMode,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.usuario.email);
    // @ts-ignore
    [usuario,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.input)({
        type: "email",
        ...{ class: "form-input" },
        placeholder: "Digite seu email",
    });
    (__VLS_ctx.usuarioEditado.email);
    // @ts-ignore
    [usuarioEditado,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
if (!__VLS_ctx.editMode) {
    // @ts-ignore
    [editMode,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.usuario.dataNascimento);
    // @ts-ignore
    [usuario,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.input)({
        value: (__VLS_ctx.usuarioEditado.dataNascimento),
        type: "text",
        ...{ class: "form-input" },
        placeholder: "DD/MM/AAAA",
    });
    // @ts-ignore
    [usuarioEditado,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
if (!__VLS_ctx.editMode) {
    // @ts-ignore
    [editMode,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.usuario.cpf);
    // @ts-ignore
    [usuario,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.input)({
        value: (__VLS_ctx.usuarioEditado.cpf),
        type: "text",
        ...{ class: "form-input" },
        placeholder: "000.000.000-00",
    });
    // @ts-ignore
    [usuarioEditado,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
if (!__VLS_ctx.editMode) {
    // @ts-ignore
    [editMode,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "info-text" },
    });
    (__VLS_ctx.usuario.endereco);
    // @ts-ignore
    [usuario,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.textarea, __VLS_elements.textarea)({
        value: (__VLS_ctx.usuarioEditado.endereco),
        ...{ class: "form-textarea" },
        placeholder: "Digite seu endereço completo",
        rows: "2",
    });
    // @ts-ignore
    [usuarioEditado,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "info-text" },
});
(__VLS_ctx.usuario.tipoUsuario);
// @ts-ignore
[usuario,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
    ...{ class: "section-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "password-section" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "info-text" },
});
if (__VLS_ctx.editMode) {
    // @ts-ignore
    [editMode,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.changePassword) },
        ...{ class: "change-password-btn" },
    });
    // @ts-ignore
    [changePassword,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
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
    if (__VLS_ctx.popupType === 'password') {
        // @ts-ignore
        [popupType,];
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "popup-input-container" },
        });
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "password",
            placeholder: "Digite a nova senha",
            ...{ class: "popup-input" },
        });
        (__VLS_ctx.novaSenha);
        // @ts-ignore
        [novaSenha,];
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "password",
            placeholder: "Confirme a nova senha",
            ...{ class: "popup-input" },
        });
        (__VLS_ctx.confirmarSenha);
        // @ts-ignore
        [confirmarSenha,];
    }
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "popup-actions" },
    });
    if (__VLS_ctx.popupType === 'confirm' || __VLS_ctx.popupType === 'password') {
        // @ts-ignore
        [popupType, popupType,];
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
/** @type {__VLS_StyleScopedClasses['perfil-page']} */ ;
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
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['edit-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['cancel-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['save-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['form-content']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-section']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-header']} */ ;
/** @type {__VLS_StyleScopedClasses['foto-container']} */ ;
/** @type {__VLS_StyleScopedClasses['perfil-foto']} */ ;
/** @type {__VLS_StyleScopedClasses['change-photo-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['name-container']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['divider-line']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['password-section']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['change-password-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-title']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-content']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-message']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-input-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-input']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-input']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-text']} */ ;
export default {};
//# sourceMappingURL=admPerfil.vue.js.map