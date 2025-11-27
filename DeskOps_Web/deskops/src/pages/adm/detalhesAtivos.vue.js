import { defineComponent, ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AdmSidebar from '@/components/layouts/admSidebar.vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'DetalhesAtivo',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const auth = useAuthStore();
        const token = auth.access;
        const ativo = ref(null);
        const ambientes = ref([]);
        const carregando = ref(true);
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
            ambiente: { id: 0, nome: '', localizacao: '' },
            status: ''
        });
        const carregarAtivo = async () => {
            try {
                const id = route.params.id;
                const response = await api.get(`/ativo/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;
                console.log('🔍 Dados completos do ativo:', data); // Para debug
                // 🔥 CORREÇÃO: Verificar a estrutura real dos dados do ambiente
                let ambienteData = {
                    id: 0,
                    nome: 'Sem ambiente',
                    localizacao: '---'
                };
                // Diferentes possíveis estruturas que a API pode retornar
                if (data.environment_FK) {
                    // Se environment_FK é um objeto completo
                    if (typeof data.environment_FK === 'object') {
                        ambienteData = {
                            id: data.environment_FK.id || 0,
                            nome: data.environment_FK.name || data.environment_FK.nome || 'Ambiente',
                            localizacao: data.environment_FK.description || data.environment_FK.localizacao || '---'
                        };
                    }
                    // Se environment_FK é apenas o ID
                    else if (typeof data.environment_FK === 'number') {
                        // Buscar detalhes do ambiente separadamente
                        try {
                            const ambienteResponse = await api.get(`/environment/${data.environment_FK}/`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            const ambData = ambienteResponse.data;
                            ambienteData = {
                                id: ambData.id,
                                nome: ambData.name,
                                localizacao: ambData.description || '---'
                            };
                        }
                        catch (error) {
                            console.error('❌ Erro ao carregar detalhes do ambiente:', error);
                        }
                    }
                }
                ativo.value = {
                    id: data.id,
                    nome: data.name,
                    descricao: data.description || 'Sem descrição',
                    status: data.status,
                    qrCode: data.qr_code || '---',
                    criadoEm: new Date(data.created_at).toLocaleString('pt-BR'),
                    atualizadoEm: new Date(data.updated_at).toLocaleString('pt-BR'),
                    ambiente: ambienteData
                };
                carregando.value = false;
            }
            catch (error) {
                console.error('❌ Erro ao carregar ativo:', error);
                showCustomPopup('error', 'Erro', 'Erro ao carregar o ativo.', 'OK', () => {
                    router.push('/adm/gestao-ativos');
                });
                carregando.value = false;
            }
        };
        const carregarAmbientes = async () => {
            try {
                const response = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // 🔥 CORREÇÃO: Verificar a estrutura da resposta
                const data = Array.isArray(response.data) ? response.data : response.data.results;
                ambientes.value = data?.map((a) => ({
                    id: a.id,
                    nome: a.name,
                    localizacao: a.description || '---',
                })) || [];
                console.log('✅ Ambientes carregados:', ambientes.value); // Para debug
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambientes:', error);
            }
        };
        const iniciarEdicao = () => {
            if (!ativo.value)
                return;
            formEdit.nome = ativo.value.nome;
            formEdit.descricao = ativo.value.descricao;
            formEdit.ambiente = { ...ativo.value.ambiente };
            formEdit.status = ativo.value.status;
            editando.value = true;
        };
        const cancelarEdicao = () => {
            editando.value = false;
        };
        const confirmarEdicao = () => {
            if (!ativo.value)
                return;
            // Validações básicas
            if (!formEdit.nome.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o nome do ativo.', 'OK');
                return;
            }
            if (!formEdit.descricao.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe a descrição do ativo.', 'OK');
                return;
            }
            if (!formEdit.ambiente.id) {
                showCustomPopup('error', 'Campo obrigatório', 'Selecione um ambiente.', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar Edição', 'Tem certeza que deseja salvar as alterações neste ativo?', 'Salvar', salvarEdicao);
        };
        const salvarEdicao = async () => {
            if (!ativo.value)
                return;
            isLoading.value = true;
            loadingText.value = 'Salvando alterações...';
            try {
                const payload = {
                    name: formEdit.nome.trim(),
                    description: formEdit.descricao.trim(),
                    environment_FK: Number(formEdit.ambiente.id),
                    status: formEdit.status.toUpperCase()
                };
                console.log('📤 Payload de edição:', payload); // Para debug
                const response = await api.patch(`/ativo/${ativo.value.id}/`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✅ Resposta da edição:', response.data); // Para debug
                // Atualiza o objeto ativo com os dados da resposta
                if (ativo.value) {
                    ativo.value.nome = response.data.name;
                    ativo.value.descricao = response.data.description;
                    ativo.value.status = response.data.status;
                    ativo.value.atualizadoEm = new Date(response.data.updated_at).toLocaleString('pt-BR');
                    // Atualiza o ambiente se necessário
                    const ambienteEncontrado = ambientes.value.find(amb => amb.id === Number(formEdit.ambiente.id));
                    if (ambienteEncontrado) {
                        ativo.value.ambiente = { ...ambienteEncontrado };
                    }
                }
                editando.value = false;
                showCustomPopup('success', 'Sucesso!', 'Ativo atualizado com sucesso!', 'OK');
            }
            catch (error) {
                console.error('❌ Erro ao atualizar ativo:', error.response?.data || error);
                let errorMessage = 'Erro desconhecido ao atualizar ativo.';
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
        const alterarStatus = async () => {
            if (!ativo.value)
                return;
            const novoStatus = ativo.value.status === 'ATIVO' ? 'EM_MANUTENCAO' : 'ATIVO';
            const acao = novoStatus === 'EM_MANUTENCAO' ? 'colocar em manutenção' : 'reativar';
            showCustomPopup('confirm', 'Alterar Status', `Tem certeza que deseja ${acao} este ativo?`, 'Confirmar', async () => {
                isLoading.value = true;
                loadingText.value = 'Alterando status...';
                try {
                    const response = await api.patch(`/ativo/${ativo.value.id}/`, { status: novoStatus }, { headers: { Authorization: `Bearer ${token}` } });
                    if (ativo.value) {
                        ativo.value.status = response.data.status;
                        ativo.value.atualizadoEm = new Date().toLocaleString('pt-BR');
                    }
                    showCustomPopup('success', 'Sucesso!', `Ativo ${novoStatus === 'EM_MANUTENCAO' ? 'colocado em manutenção' : 'reativado'} com sucesso!`, 'OK');
                }
                catch (error) {
                    console.error('❌ Erro ao alterar status:', error);
                    showCustomPopup('error', 'Erro', 'Erro ao alterar status do ativo.', 'OK');
                }
                finally {
                    isLoading.value = false;
                }
            });
        };
        const confirmarExclusao = () => {
            if (!ativo.value)
                return;
            showCustomPopup('confirm', 'Confirmar Exclusão', 'Tem certeza que deseja excluir este ativo? Esta ação não pode ser desfeita.', 'Excluir', excluirAtivo);
        };
        const excluirAtivo = async () => {
            if (!ativo.value)
                return;
            isLoading.value = true;
            loadingText.value = 'Excluindo ativo...';
            try {
                await api.delete(`/ativo/${ativo.value.id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                showCustomPopup('success', 'Sucesso!', 'Ativo excluído com sucesso!', 'OK', () => router.push('/adm/gestao-ativos'));
            }
            catch (error) {
                console.error('❌ Erro ao excluir ativo:', error);
                showCustomPopup('error', 'Erro', 'Erro ao excluir ativo.', 'OK');
            }
            finally {
                isLoading.value = false;
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
        const statusClass = (status) => {
            return status === 'ATIVO' ? 'status-ativo' : 'status-manutencao';
        };
        const statusIcon = (status) => {
            return status === 'ATIVO' ? 'check_circle' : 'build';
        };
        const formatarStatus = (status) => {
            return status === 'ATIVO' ? 'Ativo' : 'Em Manutenção';
        };
        const closeProfileMenu = () => { };
        onMounted(() => {
            carregarAtivo();
            carregarAmbientes();
        });
        return {
            ativo,
            ambientes,
            carregando,
            editando,
            isLoading,
            formEdit,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            loadingText,
            iniciarEdicao,
            cancelarEdicao,
            confirmarEdicao,
            salvarEdicao,
            alterarStatus,
            confirmarExclusao,
            excluirAtivo,
            statusClass,
            statusIcon,
            formatarStatus,
            closeProfileMenu,
            closePopup,
            handlePopupConfirm,
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'DetalhesAtivo',
    components: { AdmSidebar },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const auth = useAuthStore();
        const token = auth.access;
        const ativo = ref(null);
        const ambientes = ref([]);
        const carregando = ref(true);
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
            ambiente: { id: 0, nome: '', localizacao: '' },
            status: ''
        });
        const carregarAtivo = async () => {
            try {
                const id = route.params.id;
                const response = await api.get(`/ativo/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;
                console.log('🔍 Dados completos do ativo:', data); // Para debug
                // 🔥 CORREÇÃO: Verificar a estrutura real dos dados do ambiente
                let ambienteData = {
                    id: 0,
                    nome: 'Sem ambiente',
                    localizacao: '---'
                };
                // Diferentes possíveis estruturas que a API pode retornar
                if (data.environment_FK) {
                    // Se environment_FK é um objeto completo
                    if (typeof data.environment_FK === 'object') {
                        ambienteData = {
                            id: data.environment_FK.id || 0,
                            nome: data.environment_FK.name || data.environment_FK.nome || 'Ambiente',
                            localizacao: data.environment_FK.description || data.environment_FK.localizacao || '---'
                        };
                    }
                    // Se environment_FK é apenas o ID
                    else if (typeof data.environment_FK === 'number') {
                        // Buscar detalhes do ambiente separadamente
                        try {
                            const ambienteResponse = await api.get(`/environment/${data.environment_FK}/`, {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            const ambData = ambienteResponse.data;
                            ambienteData = {
                                id: ambData.id,
                                nome: ambData.name,
                                localizacao: ambData.description || '---'
                            };
                        }
                        catch (error) {
                            console.error('❌ Erro ao carregar detalhes do ambiente:', error);
                        }
                    }
                }
                ativo.value = {
                    id: data.id,
                    nome: data.name,
                    descricao: data.description || 'Sem descrição',
                    status: data.status,
                    qrCode: data.qr_code || '---',
                    criadoEm: new Date(data.created_at).toLocaleString('pt-BR'),
                    atualizadoEm: new Date(data.updated_at).toLocaleString('pt-BR'),
                    ambiente: ambienteData
                };
                carregando.value = false;
            }
            catch (error) {
                console.error('❌ Erro ao carregar ativo:', error);
                showCustomPopup('error', 'Erro', 'Erro ao carregar o ativo.', 'OK', () => {
                    router.push('/adm/gestao-ativos');
                });
                carregando.value = false;
            }
        };
        const carregarAmbientes = async () => {
            try {
                const response = await api.get('/environment/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // 🔥 CORREÇÃO: Verificar a estrutura da resposta
                const data = Array.isArray(response.data) ? response.data : response.data.results;
                ambientes.value = data?.map((a) => ({
                    id: a.id,
                    nome: a.name,
                    localizacao: a.description || '---',
                })) || [];
                console.log('✅ Ambientes carregados:', ambientes.value); // Para debug
            }
            catch (error) {
                console.error('❌ Erro ao carregar ambientes:', error);
            }
        };
        const iniciarEdicao = () => {
            if (!ativo.value)
                return;
            formEdit.nome = ativo.value.nome;
            formEdit.descricao = ativo.value.descricao;
            formEdit.ambiente = { ...ativo.value.ambiente };
            formEdit.status = ativo.value.status;
            editando.value = true;
        };
        const cancelarEdicao = () => {
            editando.value = false;
        };
        const confirmarEdicao = () => {
            if (!ativo.value)
                return;
            // Validações básicas
            if (!formEdit.nome.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe o nome do ativo.', 'OK');
                return;
            }
            if (!formEdit.descricao.trim()) {
                showCustomPopup('error', 'Campo obrigatório', 'Informe a descrição do ativo.', 'OK');
                return;
            }
            if (!formEdit.ambiente.id) {
                showCustomPopup('error', 'Campo obrigatório', 'Selecione um ambiente.', 'OK');
                return;
            }
            showCustomPopup('confirm', 'Confirmar Edição', 'Tem certeza que deseja salvar as alterações neste ativo?', 'Salvar', salvarEdicao);
        };
        const salvarEdicao = async () => {
            if (!ativo.value)
                return;
            isLoading.value = true;
            loadingText.value = 'Salvando alterações...';
            try {
                const payload = {
                    name: formEdit.nome.trim(),
                    description: formEdit.descricao.trim(),
                    environment_FK: Number(formEdit.ambiente.id),
                    status: formEdit.status.toUpperCase()
                };
                console.log('📤 Payload de edição:', payload); // Para debug
                const response = await api.patch(`/ativo/${ativo.value.id}/`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✅ Resposta da edição:', response.data); // Para debug
                // Atualiza o objeto ativo com os dados da resposta
                if (ativo.value) {
                    ativo.value.nome = response.data.name;
                    ativo.value.descricao = response.data.description;
                    ativo.value.status = response.data.status;
                    ativo.value.atualizadoEm = new Date(response.data.updated_at).toLocaleString('pt-BR');
                    // Atualiza o ambiente se necessário
                    const ambienteEncontrado = ambientes.value.find(amb => amb.id === Number(formEdit.ambiente.id));
                    if (ambienteEncontrado) {
                        ativo.value.ambiente = { ...ambienteEncontrado };
                    }
                }
                editando.value = false;
                showCustomPopup('success', 'Sucesso!', 'Ativo atualizado com sucesso!', 'OK');
            }
            catch (error) {
                console.error('❌ Erro ao atualizar ativo:', error.response?.data || error);
                let errorMessage = 'Erro desconhecido ao atualizar ativo.';
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
        const alterarStatus = async () => {
            if (!ativo.value)
                return;
            const novoStatus = ativo.value.status === 'ATIVO' ? 'EM_MANUTENCAO' : 'ATIVO';
            const acao = novoStatus === 'EM_MANUTENCAO' ? 'colocar em manutenção' : 'reativar';
            showCustomPopup('confirm', 'Alterar Status', `Tem certeza que deseja ${acao} este ativo?`, 'Confirmar', async () => {
                isLoading.value = true;
                loadingText.value = 'Alterando status...';
                try {
                    const response = await api.patch(`/ativo/${ativo.value.id}/`, { status: novoStatus }, { headers: { Authorization: `Bearer ${token}` } });
                    if (ativo.value) {
                        ativo.value.status = response.data.status;
                        ativo.value.atualizadoEm = new Date().toLocaleString('pt-BR');
                    }
                    showCustomPopup('success', 'Sucesso!', `Ativo ${novoStatus === 'EM_MANUTENCAO' ? 'colocado em manutenção' : 'reativado'} com sucesso!`, 'OK');
                }
                catch (error) {
                    console.error('❌ Erro ao alterar status:', error);
                    showCustomPopup('error', 'Erro', 'Erro ao alterar status do ativo.', 'OK');
                }
                finally {
                    isLoading.value = false;
                }
            });
        };
        const confirmarExclusao = () => {
            if (!ativo.value)
                return;
            showCustomPopup('confirm', 'Confirmar Exclusão', 'Tem certeza que deseja excluir este ativo? Esta ação não pode ser desfeita.', 'Excluir', excluirAtivo);
        };
        const excluirAtivo = async () => {
            if (!ativo.value)
                return;
            isLoading.value = true;
            loadingText.value = 'Excluindo ativo...';
            try {
                await api.delete(`/ativo/${ativo.value.id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                showCustomPopup('success', 'Sucesso!', 'Ativo excluído com sucesso!', 'OK', () => router.push('/adm/gestao-ativos'));
            }
            catch (error) {
                console.error('❌ Erro ao excluir ativo:', error);
                showCustomPopup('error', 'Erro', 'Erro ao excluir ativo.', 'OK');
            }
            finally {
                isLoading.value = false;
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
        const statusClass = (status) => {
            return status === 'ATIVO' ? 'status-ativo' : 'status-manutencao';
        };
        const statusIcon = (status) => {
            return status === 'ATIVO' ? 'check_circle' : 'build';
        };
        const formatarStatus = (status) => {
            return status === 'ATIVO' ? 'Ativo' : 'Em Manutenção';
        };
        const closeProfileMenu = () => { };
        onMounted(() => {
            carregarAtivo();
            carregarAmbientes();
        });
        return {
            ativo,
            ambientes,
            carregando,
            editando,
            isLoading,
            formEdit,
            showPopup,
            popupType,
            popupTitle,
            popupMessage,
            popupConfirmText,
            popupIcon,
            loadingText,
            iniciarEdicao,
            cancelarEdicao,
            confirmarEdicao,
            salvarEdicao,
            alterarStatus,
            confirmarExclusao,
            excluirAtivo,
            statusClass,
            statusIcon,
            formatarStatus,
            closeProfileMenu,
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
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['info-rapida']} */ ;
/** @type {__VLS_StyleScopedClasses['error-container']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-voltar']} */ ;
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
/** @type {__VLS_StyleScopedClasses['detalhes-ativo-page']} */ ;
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
    ...{ class: "detalhes-ativo-page" },
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
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "title-container" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "action-buttons-header" },
});
if (!__VLS_ctx.editando && __VLS_ctx.ativo) {
    // @ts-ignore
    [editando, ativo,];
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
if (__VLS_ctx.ativo) {
    // @ts-ignore
    [ativo,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.confirmarExclusao) },
        ...{ class: "btn-excluir" },
    });
    // @ts-ignore
    [confirmarExclusao,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
}
if (__VLS_ctx.carregando) {
    // @ts-ignore
    [carregando,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
}
else if (__VLS_ctx.ativo) {
    // @ts-ignore
    [ativo,];
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
        (__VLS_ctx.ativo.descricao);
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
        (__VLS_ctx.ativo.ambiente.localizacao);
        // @ts-ignore
        [ativo,];
    }
    else {
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "edit-mode" },
        });
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
            ...{ class: "section-title" },
        });
        __VLS_asFunctionalElement(__VLS_elements.input)({
            type: "text",
            value: (__VLS_ctx.formEdit.nome),
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
        __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
            value: (__VLS_ctx.formEdit.ambiente.id),
            ...{ class: "form-select" },
        });
        // @ts-ignore
        [formEdit,];
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
            (amb.nome);
        }
        __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
            ...{ class: "form-section" },
        });
        __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
            ...{ class: "section-title" },
        });
        __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
            value: (__VLS_ctx.formEdit.status),
            ...{ class: "form-select" },
        });
        // @ts-ignore
        [formEdit,];
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "ATIVO",
        });
        __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
            value: "EM_MANUTENCAO",
        });
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
        ...{ class: "action-buttons" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.alterarStatus) },
        ...{ class: "btn-secondary" },
        disabled: (__VLS_ctx.editando || __VLS_ctx.isLoading),
    });
    // @ts-ignore
    [editando, isLoading, alterarStatus,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
    (__VLS_ctx.ativo.status === 'ATIVO' ? 'build' : 'check_circle');
    // @ts-ignore
    [ativo,];
    (__VLS_ctx.ativo.status === 'ATIVO' ? 'Colocar em Manutenção' : 'Ativar Ativo');
    // @ts-ignore
    [ativo,];
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
}
else {
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "error-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (...[$event]) => {
                if (!!(__VLS_ctx.carregando))
                    return;
                if (!!(__VLS_ctx.ativo))
                    return;
                __VLS_ctx.$router.push('/adm/gestao-ativos');
                // @ts-ignore
                [$router,];
            } },
        ...{ class: "btn-voltar" },
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
/** @type {__VLS_StyleScopedClasses['detalhes-ativo-page']} */ ;
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
/** @type {__VLS_StyleScopedClasses['loading']} */ ;
/** @type {__VLS_StyleScopedClasses['cards-container']} */ ;
/** @type {__VLS_StyleScopedClasses['card-form']} */ ;
/** @type {__VLS_StyleScopedClasses['view-mode']} */ ;
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
/** @type {__VLS_StyleScopedClasses['edit-mode']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-title']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['form-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cancelar']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-salvar']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['card-summary']} */ ;
/** @type {__VLS_StyleScopedClasses['card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['info-rapida']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['info-item']} */ ;
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
/** @type {__VLS_StyleScopedClasses['info-value']} */ ;
/** @type {__VLS_StyleScopedClasses['error-container']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-voltar']} */ ;
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
//# sourceMappingURL=detalhesAtivos.vue.js.map