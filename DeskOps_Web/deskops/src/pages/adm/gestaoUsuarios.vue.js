import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdmSidebar from '@/components/layouts/admSidebar.vue';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'GestaoUsuarios',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const filtroNivel = ref('todos');
        const filtroStatus = ref('todos');
        const ordemExibicao = ref('recente');
        const pesquisa = ref('');
        const usuarios = ref([]);
        const isLoading = ref(false);
        const loadingText = ref('Processando...');
        // Estados para o popup
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        const usuarioPendente = ref(null);
        const novoValor = ref('');
        const valorOriginal = ref(''); // 🔥 NOVO: Guarda o valor original
        const campoPendente = ref(null);
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
            usuarioPendente.value = null;
            campoPendente.value = null;
            novoValor.value = '';
            valorOriginal.value = '';
        };
        // 🔥 FUNÇÃO: Cancelar ação
        const cancelAction = () => {
            // Não faz nada, apenas fecha o popup (o valor não foi alterado ainda)
            closePopup();
        };
        const handlePopupConfirm = () => {
            if (popupAction.value) {
                popupAction.value();
            }
        };
        const popupIcon = computed(() => {
            switch (popupType.value) {
                case 'success': return 'check_circle';
                case 'error': return 'error';
                case 'confirm': return 'help';
                default: return 'info';
            }
        });
        // ✅ Buscar usuários da API
        const carregarUsuarios = async () => {
            try {
                const token = auth.access;
                if (!token) {
                    showCustomPopup('error', 'Sessão Expirada', 'Sua sessão expirou. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                    return;
                }
                const response = await api.get('/usuarios/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];
                console.log('🔍 Estrutura real dos usuários:', data);
                usuarios.value = data.map((u) => ({
                    id: u.id ?? 0,
                    criadoEm: u.created_at
                        ? new Date(u.created_at).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        : '---',
                    nome: u.name || '---',
                    email: u.email || '---',
                    cpf: u.cpf || '---',
                    nivel: (u.cargo || '').toLowerCase().replace('adm', 'admin') || 'usuario',
                    status: u.is_active ? 'ativo' : 'inativo',
                }));
                console.log('✅ Usuários carregados formatados:', usuarios.value);
            }
            catch (error) {
                console.error('❌ Erro ao carregar usuários:', error);
                if (error.response?.status === 401) {
                    showCustomPopup('error', 'Sessão Expirada', 'Sua sessão expirou. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                }
                else {
                    showCustomPopup('error', 'Erro', 'Erro ao carregar usuários. Tente novamente.', 'OK');
                }
            }
        };
        onMounted(() => {
            carregarUsuarios();
        });
        // ✅ PREPARAR atualização de nível (NÃO atualiza o v-model ainda)
        const prepararAtualizacaoNivel = (usuario, event) => {
            const target = event.target;
            const novoNivel = target.value;
            // 🔥 GUARDA tanto o novo valor quanto o original
            usuarioPendente.value = usuario;
            novoValor.value = novoNivel;
            valorOriginal.value = usuario.nivel; // 🔥 GUARDA O ORIGINAL
            campoPendente.value = 'nivel';
            const nivelTexto = {
                'usuario': 'Usuário',
                'tecnico': 'Técnico',
                'admin': 'Administrador'
            }[novoNivel] || novoNivel;
            showCustomPopup('confirm', 'Alterar Nível de Acesso', `Tem certeza que deseja alterar o nível de acesso de <strong>${usuario.nome}</strong> para <strong>${nivelTexto}</strong>?`, 'Confirmar Alteração', () => confirmarAtualizacaoNivel());
        };
        // ✅ PREPARAR atualização de status (NÃO atualiza o v-model ainda)
        const prepararAtualizacaoStatus = (usuario, event) => {
            const target = event.target;
            const novoStatus = target.value;
            // 🔥 GUARDA tanto o novo valor quanto o original
            usuarioPendente.value = usuario;
            novoValor.value = novoStatus;
            valorOriginal.value = usuario.status; // 🔥 GUARDA O ORIGINAL
            campoPendente.value = 'status';
            const statusTexto = novoStatus === 'ativo' ? 'Ativo' : 'Inativo';
            const acaoTexto = novoStatus === 'ativo' ? 'ativar' : 'desativar';
            showCustomPopup('confirm', novoStatus === 'ativo' ? 'Ativar Usuário' : 'Desativar Usuário', `Tem certeza que deseja ${acaoTexto} o usuário <strong>${usuario.nome}</strong>?`, novoStatus === 'ativo' ? 'Ativar' : 'Desativar', () => confirmarAtualizacaoStatus());
        };
        // ✅ CONFIRMAR atualização de nível (agora sim atualiza o v-model)
        const confirmarAtualizacaoNivel = async () => {
            if (!usuarioPendente.value || !novoValor.value) {
                closePopup();
                return;
            }
            try {
                const token = auth.access;
                if (!token) {
                    closePopup();
                    return;
                }
                isLoading.value = true;
                loadingText.value = 'Atualizando nível de acesso...';
                // 🔥 AGORA SIM: Atualiza o v-model
                usuarioPendente.value.nivel = novoValor.value;
                const payload = { role: novoValor.value };
                const response = await api.patch(`/usuarios/${usuarioPendente.value.id}/`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('✅ Resposta da API:', response.data);
                const nivelTexto = {
                    'usuario': 'Usuário',
                    'tecnico': 'Técnico',
                    'admin': 'Administrador'
                }[novoValor.value] || novoValor.value;
                showCustomPopup('success', 'Sucesso!', `Nível de acesso de <strong>${usuarioPendente.value.nome}</strong> atualizado para <strong>${nivelTexto}</strong> com sucesso!`, 'OK', () => closePopup());
            }
            catch (error) {
                console.error('❌ Erro ao atualizar nível:', error);
                console.error('❌ Detalhes do erro:', error.response?.data || error);
                // 🔥 REVERTE em caso de erro
                if (usuarioPendente.value && valorOriginal.value) {
                    usuarioPendente.value.nivel = valorOriginal.value;
                }
                let errorMessage = 'Erro ao atualizar nível do usuário. Verifique os dados e tente novamente.';
                if (error.response?.data) {
                    if (typeof error.response.data === 'object') {
                        // Tenta extrair mensagens de erro específicas
                        const errorData = error.response.data;
                        if (errorData.detail) {
                            errorMessage = errorData.detail;
                        }
                        else if (errorData.cargo) {
                            errorMessage = `Cargo: ${Array.isArray(errorData.cargo) ? errorData.cargo.join(', ') : errorData.cargo}`;
                        }
                        else {
                            errorMessage = Object.values(errorData).flat().join('\n');
                        }
                    }
                    else {
                        errorMessage = error.response.data;
                    }
                }
                showCustomPopup('error', 'Erro', errorMessage, 'OK', () => closePopup());
            }
            finally {
                isLoading.value = false;
            }
        };
        // ✅ CONFIRMAR atualização de status (agora sim atualiza o v-model)
        const confirmarAtualizacaoStatus = async () => {
            if (!usuarioPendente.value || !novoValor.value) {
                closePopup();
                return;
            }
            try {
                const token = auth.access;
                if (!token) {
                    closePopup();
                    return;
                }
                isLoading.value = true;
                loadingText.value = novoValor.value === 'ativo' ? 'Ativando usuário...' : 'Desativando usuário...';
                // 🔥 AGORA SIM: Atualiza o v-model
                usuarioPendente.value.status = novoValor.value;
                const ativo = novoValor.value === 'ativo';
                const payload = {
                    is_active: ativo,
                    is_staff: ativo
                };
                const response = await api.patch(`/usuarios/${usuarioPendente.value.id}/`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('✅ Resposta da API:', response.data);
                const acaoTexto = novoValor.value === 'ativo' ? 'ativado' : 'desativado';
                showCustomPopup('success', 'Sucesso!', `Usuário <strong>${usuarioPendente.value.nome}</strong> ${acaoTexto} com sucesso!`, 'OK', () => closePopup());
            }
            catch (error) {
                console.error('❌ Erro ao atualizar status:', error);
                console.error('❌ Detalhes do erro:', error.response?.data || error);
                // 🔥 REVERTE em caso de erro
                if (usuarioPendente.value && valorOriginal.value) {
                    usuarioPendente.value.status = valorOriginal.value;
                }
                let errorMessage = 'Erro ao atualizar status do usuário. Verifique os dados e tente novamente.';
                if (error.response?.data) {
                    if (typeof error.response.data === 'object') {
                        // Tenta extrair mensagens de erro específicas
                        const errorData = error.response.data;
                        if (errorData.detail) {
                            errorMessage = errorData.detail;
                        }
                        else if (errorData.is_active) {
                            errorMessage = `Status: ${Array.isArray(errorData.is_active) ? errorData.is_active.join(', ') : errorData.is_active}`;
                        }
                        else {
                            errorMessage = Object.values(errorData).flat().join('\n');
                        }
                    }
                    else {
                        errorMessage = error.response.data;
                    }
                }
                showCustomPopup('error', 'Erro', errorMessage, 'OK', () => closePopup());
            }
            finally {
                isLoading.value = false;
            }
        };
        // ✅ Filtros e ordenação
        const filtrados = computed(() => {
            return usuarios.value.filter((u) => {
                const matchNivel = filtroNivel.value === 'todos' ||
                    u.nivel.toLowerCase() === filtroNivel.value.toLowerCase();
                const matchStatus = filtroStatus.value === 'todos' ||
                    u.status.toLowerCase() === filtroStatus.value.toLowerCase();
                const matchPesquisa = u.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    u.email.toLowerCase().includes(pesquisa.value.toLowerCase());
                return matchNivel && matchStatus && matchPesquisa;
            });
        });
        const usuariosOrdenados = computed(() => {
            const lista = [...filtrados.value];
            if (ordemExibicao.value === 'recente') {
                return lista.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
            }
            else {
                return lista.sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime());
            }
        });
        const statusClass = (status) => {
            switch (status.toLowerCase()) {
                case 'ativo':
                    return 'status-ativo';
                case 'inativo':
                    return 'status-inativo';
                default:
                    return '';
            }
        };
        const closeProfileMenu = () => { };
        return {
            usuariosOrdenados,
            filtroNivel,
            filtroStatus,
            ordemExibicao,
            pesquisa,
            statusClass,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            isLoading,
            loadingText,
            prepararAtualizacaoNivel,
            prepararAtualizacaoStatus,
            cancelAction,
            closePopup,
            handlePopupConfirm,
            closeProfileMenu,
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'GestaoUsuarios',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const filtroNivel = ref('todos');
        const filtroStatus = ref('todos');
        const ordemExibicao = ref('recente');
        const pesquisa = ref('');
        const usuarios = ref([]);
        const isLoading = ref(false);
        const loadingText = ref('Processando...');
        // Estados para o popup
        const showPopup = ref(false);
        const popupType = ref('confirm');
        const popupTitle = ref('');
        const popupMessage = ref('');
        const popupConfirmText = ref('');
        const popupAction = ref(null);
        const usuarioPendente = ref(null);
        const novoValor = ref('');
        const valorOriginal = ref(''); // 🔥 NOVO: Guarda o valor original
        const campoPendente = ref(null);
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
            usuarioPendente.value = null;
            campoPendente.value = null;
            novoValor.value = '';
            valorOriginal.value = '';
        };
        // 🔥 FUNÇÃO: Cancelar ação
        const cancelAction = () => {
            // Não faz nada, apenas fecha o popup (o valor não foi alterado ainda)
            closePopup();
        };
        const handlePopupConfirm = () => {
            if (popupAction.value) {
                popupAction.value();
            }
        };
        const popupIcon = computed(() => {
            switch (popupType.value) {
                case 'success': return 'check_circle';
                case 'error': return 'error';
                case 'confirm': return 'help';
                default: return 'info';
            }
        });
        // ✅ Buscar usuários da API
        const carregarUsuarios = async () => {
            try {
                const token = auth.access;
                if (!token) {
                    showCustomPopup('error', 'Sessão Expirada', 'Sua sessão expirou. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                    return;
                }
                const response = await api.get('/usuarios/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];
                console.log('🔍 Estrutura real dos usuários:', data);
                usuarios.value = data.map((u) => ({
                    id: u.id ?? 0,
                    criadoEm: u.created_at
                        ? new Date(u.created_at).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        : '---',
                    nome: u.name || '---',
                    email: u.email || '---',
                    cpf: u.cpf || '---',
                    nivel: (u.cargo || '').toLowerCase().replace('adm', 'admin') || 'usuario',
                    status: u.is_active ? 'ativo' : 'inativo',
                }));
                console.log('✅ Usuários carregados formatados:', usuarios.value);
            }
            catch (error) {
                console.error('❌ Erro ao carregar usuários:', error);
                if (error.response?.status === 401) {
                    showCustomPopup('error', 'Sessão Expirada', 'Sua sessão expirou. Faça login novamente.', 'OK', () => {
                        router.push('/');
                    });
                }
                else {
                    showCustomPopup('error', 'Erro', 'Erro ao carregar usuários. Tente novamente.', 'OK');
                }
            }
        };
        onMounted(() => {
            carregarUsuarios();
        });
        // ✅ PREPARAR atualização de nível (NÃO atualiza o v-model ainda)
        const prepararAtualizacaoNivel = (usuario, event) => {
            const target = event.target;
            const novoNivel = target.value;
            // 🔥 GUARDA tanto o novo valor quanto o original
            usuarioPendente.value = usuario;
            novoValor.value = novoNivel;
            valorOriginal.value = usuario.nivel; // 🔥 GUARDA O ORIGINAL
            campoPendente.value = 'nivel';
            const nivelTexto = {
                'usuario': 'Usuário',
                'tecnico': 'Técnico',
                'admin': 'Administrador'
            }[novoNivel] || novoNivel;
            showCustomPopup('confirm', 'Alterar Nível de Acesso', `Tem certeza que deseja alterar o nível de acesso de <strong>${usuario.nome}</strong> para <strong>${nivelTexto}</strong>?`, 'Confirmar Alteração', () => confirmarAtualizacaoNivel());
        };
        // ✅ PREPARAR atualização de status (NÃO atualiza o v-model ainda)
        const prepararAtualizacaoStatus = (usuario, event) => {
            const target = event.target;
            const novoStatus = target.value;
            // 🔥 GUARDA tanto o novo valor quanto o original
            usuarioPendente.value = usuario;
            novoValor.value = novoStatus;
            valorOriginal.value = usuario.status; // 🔥 GUARDA O ORIGINAL
            campoPendente.value = 'status';
            const statusTexto = novoStatus === 'ativo' ? 'Ativo' : 'Inativo';
            const acaoTexto = novoStatus === 'ativo' ? 'ativar' : 'desativar';
            showCustomPopup('confirm', novoStatus === 'ativo' ? 'Ativar Usuário' : 'Desativar Usuário', `Tem certeza que deseja ${acaoTexto} o usuário <strong>${usuario.nome}</strong>?`, novoStatus === 'ativo' ? 'Ativar' : 'Desativar', () => confirmarAtualizacaoStatus());
        };
        // ✅ CONFIRMAR atualização de nível (agora sim atualiza o v-model)
        const confirmarAtualizacaoNivel = async () => {
            if (!usuarioPendente.value || !novoValor.value) {
                closePopup();
                return;
            }
            try {
                const token = auth.access;
                if (!token) {
                    closePopup();
                    return;
                }
                isLoading.value = true;
                loadingText.value = 'Atualizando nível de acesso...';
                // 🔥 AGORA SIM: Atualiza o v-model
                usuarioPendente.value.nivel = novoValor.value;
                const payload = { role: novoValor.value };
                const response = await api.patch(`/usuarios/${usuarioPendente.value.id}/`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('✅ Resposta da API:', response.data);
                const nivelTexto = {
                    'usuario': 'Usuário',
                    'tecnico': 'Técnico',
                    'admin': 'Administrador'
                }[novoValor.value] || novoValor.value;
                showCustomPopup('success', 'Sucesso!', `Nível de acesso de <strong>${usuarioPendente.value.nome}</strong> atualizado para <strong>${nivelTexto}</strong> com sucesso!`, 'OK', () => closePopup());
            }
            catch (error) {
                console.error('❌ Erro ao atualizar nível:', error);
                console.error('❌ Detalhes do erro:', error.response?.data || error);
                // 🔥 REVERTE em caso de erro
                if (usuarioPendente.value && valorOriginal.value) {
                    usuarioPendente.value.nivel = valorOriginal.value;
                }
                let errorMessage = 'Erro ao atualizar nível do usuário. Verifique os dados e tente novamente.';
                if (error.response?.data) {
                    if (typeof error.response.data === 'object') {
                        // Tenta extrair mensagens de erro específicas
                        const errorData = error.response.data;
                        if (errorData.detail) {
                            errorMessage = errorData.detail;
                        }
                        else if (errorData.cargo) {
                            errorMessage = `Cargo: ${Array.isArray(errorData.cargo) ? errorData.cargo.join(', ') : errorData.cargo}`;
                        }
                        else {
                            errorMessage = Object.values(errorData).flat().join('\n');
                        }
                    }
                    else {
                        errorMessage = error.response.data;
                    }
                }
                showCustomPopup('error', 'Erro', errorMessage, 'OK', () => closePopup());
            }
            finally {
                isLoading.value = false;
            }
        };
        // ✅ CONFIRMAR atualização de status (agora sim atualiza o v-model)
        const confirmarAtualizacaoStatus = async () => {
            if (!usuarioPendente.value || !novoValor.value) {
                closePopup();
                return;
            }
            try {
                const token = auth.access;
                if (!token) {
                    closePopup();
                    return;
                }
                isLoading.value = true;
                loadingText.value = novoValor.value === 'ativo' ? 'Ativando usuário...' : 'Desativando usuário...';
                // 🔥 AGORA SIM: Atualiza o v-model
                usuarioPendente.value.status = novoValor.value;
                const ativo = novoValor.value === 'ativo';
                const payload = {
                    is_active: ativo,
                    is_staff: ativo
                };
                const response = await api.patch(`/usuarios/${usuarioPendente.value.id}/`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('✅ Resposta da API:', response.data);
                const acaoTexto = novoValor.value === 'ativo' ? 'ativado' : 'desativado';
                showCustomPopup('success', 'Sucesso!', `Usuário <strong>${usuarioPendente.value.nome}</strong> ${acaoTexto} com sucesso!`, 'OK', () => closePopup());
            }
            catch (error) {
                console.error('❌ Erro ao atualizar status:', error);
                console.error('❌ Detalhes do erro:', error.response?.data || error);
                // 🔥 REVERTE em caso de erro
                if (usuarioPendente.value && valorOriginal.value) {
                    usuarioPendente.value.status = valorOriginal.value;
                }
                let errorMessage = 'Erro ao atualizar status do usuário. Verifique os dados e tente novamente.';
                if (error.response?.data) {
                    if (typeof error.response.data === 'object') {
                        // Tenta extrair mensagens de erro específicas
                        const errorData = error.response.data;
                        if (errorData.detail) {
                            errorMessage = errorData.detail;
                        }
                        else if (errorData.is_active) {
                            errorMessage = `Status: ${Array.isArray(errorData.is_active) ? errorData.is_active.join(', ') : errorData.is_active}`;
                        }
                        else {
                            errorMessage = Object.values(errorData).flat().join('\n');
                        }
                    }
                    else {
                        errorMessage = error.response.data;
                    }
                }
                showCustomPopup('error', 'Erro', errorMessage, 'OK', () => closePopup());
            }
            finally {
                isLoading.value = false;
            }
        };
        // ✅ Filtros e ordenação
        const filtrados = computed(() => {
            return usuarios.value.filter((u) => {
                const matchNivel = filtroNivel.value === 'todos' ||
                    u.nivel.toLowerCase() === filtroNivel.value.toLowerCase();
                const matchStatus = filtroStatus.value === 'todos' ||
                    u.status.toLowerCase() === filtroStatus.value.toLowerCase();
                const matchPesquisa = u.nome.toLowerCase().includes(pesquisa.value.toLowerCase()) ||
                    u.email.toLowerCase().includes(pesquisa.value.toLowerCase());
                return matchNivel && matchStatus && matchPesquisa;
            });
        });
        const usuariosOrdenados = computed(() => {
            const lista = [...filtrados.value];
            if (ordemExibicao.value === 'recente') {
                return lista.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
            }
            else {
                return lista.sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime());
            }
        });
        const statusClass = (status) => {
            switch (status.toLowerCase()) {
                case 'ativo':
                    return 'status-ativo';
                case 'inativo':
                    return 'status-inativo';
                default:
                    return '';
            }
        };
        const closeProfileMenu = () => { };
        return {
            usuariosOrdenados,
            filtroNivel,
            filtroStatus,
            ordemExibicao,
            pesquisa,
            statusClass,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            isLoading,
            loadingText,
            prepararAtualizacaoNivel,
            prepararAtualizacaoStatus,
            cancelAction,
            closePopup,
            handlePopupConfirm,
            closeProfileMenu,
        };
    },
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
/** @type {__VLS_StyleScopedClasses['usuarios-table']} */ ;
/** @type {__VLS_StyleScopedClasses['usuarios-table']} */ ;
/** @type {__VLS_StyleScopedClasses['usuarios-table']} */ ;
/** @type {__VLS_StyleScopedClasses['usuarios-table']} */ ;
/** @type {__VLS_StyleScopedClasses['usuarios-table']} */ ;
/** @type {__VLS_StyleScopedClasses['nivel-select']} */ ;
/** @type {__VLS_StyleScopedClasses['status-select']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-row']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-row']} */ ;
/** @type {__VLS_StyleScopedClasses['nivel-select']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-row']} */ ;
/** @type {__VLS_StyleScopedClasses['status-select']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-message']} */ ;
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
/** @type {__VLS_StyleScopedClasses['gestao-usuarios-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "gestao-usuarios-page" },
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
    value: (__VLS_ctx.filtroNivel),
    ...{ class: "filter-select" },
});
// @ts-ignore
[filtroNivel,];
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "todos",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "usuario",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "tecnico",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "admin",
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
    value: "ativo",
});
__VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
    value: "inativo",
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
    placeholder: "Pesquisar por nome ou email",
    ...{ class: "filter-search" },
});
// @ts-ignore
[pesquisa,];
if (__VLS_ctx.usuariosOrdenados.length) {
    // @ts-ignore
    [usuariosOrdenados,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "table-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.table, __VLS_elements.table)({
        ...{ class: "usuarios-table" },
    });
    __VLS_asFunctionalElement(__VLS_elements.thead, __VLS_elements.thead)({});
    __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.th, __VLS_elements.th)({});
    __VLS_asFunctionalElement(__VLS_elements.tbody, __VLS_elements.tbody)({});
    for (const [usuario] of __VLS_getVForSourceType((__VLS_ctx.usuariosOrdenados))) {
        // @ts-ignore
        [usuariosOrdenados,];
        __VLS_asFunctionalElement(__VLS_elements.tr, __VLS_elements.tr)({
            key: (usuario.id),
            ...{ class: "clickable-row" },
        });
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (usuario.criadoEm);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (usuario.id);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "usuario-info" },
        });
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
        (usuario.nome);
        __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
            ...{ class: "usuario-cpf" },
        });
        (usuario.cpf || '---');
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        (usuario.email);
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
            ...{ onChange: ((event) => __VLS_ctx.prepararAtualizacaoNivel(usuario, event)) },
            value: (usuario.nivel),
            ...{ class: "nivel-select" },
        });
        // @ts-ignore
        [prepararAtualizacaoNivel,];
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "usuario",
        });
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "tecnico",
        });
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "admin",
        });
        __VLS_asFunctionalElement(__VLS_elements.td, __VLS_elements.td)({});
        __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
            ...{ onChange: ((event) => __VLS_ctx.prepararAtualizacaoStatus(usuario, event)) },
            value: (usuario.status),
            ...{ class: (['status-select', __VLS_ctx.statusClass(usuario.status)]) },
        });
        // @ts-ignore
        [prepararAtualizacaoStatus, statusClass,];
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "ativo",
        });
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "inativo",
        });
    }
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
    __VLS_asFunctionalDirective(__VLS_directives.vHtml)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.popupMessage) }, null, null);
    // @ts-ignore
    [popupMessage,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "popup-actions" },
    });
    if (__VLS_ctx.popupType === 'confirm') {
        // @ts-ignore
        [popupType,];
        __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
            ...{ onClick: (__VLS_ctx.cancelAction) },
            ...{ class: "popup-btn popup-btn-cancel" },
            disabled: (__VLS_ctx.isLoading),
        });
        // @ts-ignore
        [cancelAction, isLoading,];
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
/** @type {__VLS_StyleScopedClasses['gestao-usuarios-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['filters']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-select']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-search']} */ ;
/** @type {__VLS_StyleScopedClasses['table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['usuarios-table']} */ ;
/** @type {__VLS_StyleScopedClasses['clickable-row']} */ ;
/** @type {__VLS_StyleScopedClasses['usuario-info']} */ ;
/** @type {__VLS_StyleScopedClasses['usuario-cpf']} */ ;
/** @type {__VLS_StyleScopedClasses['nivel-select']} */ ;
/** @type {__VLS_StyleScopedClasses['status-select']} */ ;
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
//# sourceMappingURL=gestaoUsuarios.vue.js.map