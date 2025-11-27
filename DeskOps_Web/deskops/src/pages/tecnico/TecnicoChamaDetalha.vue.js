import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
import TecnicoSidebar from '@/components/layouts/tecnicoSidebar.vue';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'TecnicoChamadoDetalhado',
    components: { TecnicoSidebar },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const auth = useAuthStore();
        const novoStatus = ref('');
        // ✅ inicialização segura (evita null)
        const chamado = ref({
            id: null,
            titulo: '',
            descricao: '',
            categoria: '',
            imagem: null,
            status: '',
            prioridade: '',
            categorias: '',
            ambiente: '---',
            criadoEm: '',
            atualizadoEm: '',
            criadoPor: { nome: '', email: '' },
            tecnicoResponsavel: null,
            ultimaAcao: '',
            dataUltimaAcao: ''
        });
        const usuario = ref({
            nome: 'Carregando...',
            email: '',
            tipoUsuario: 'Técnico'
        });
        const carregarUsuario = async () => {
            try {
                const token = auth.access;
                if (!token)
                    return;
                const response = await api.get('/me/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                usuario.value = {
                    nome: data.name || 'Técnico',
                    email: data.email || 'sem@email.com',
                    tipoUsuario: data.role ? data.role.toUpperCase() : 'Técnico'
                };
                // opcional: sincroniza com o Pinia
                auth.user = data;
            }
            catch (error) {
                console.error('❌ Erro ao carregar usuário:', error.response?.data || error);
            }
        };
        // ✅ Função para carregar o chamado
        const carregarChamado = async () => {
            try {
                const id = route.params.id;
                const token = auth.access;
                if (!id || !token) {
                    console.error('⚠️ Falta ID ou token');
                    router.push('/tecnico/chamados');
                    return;
                }
                const response = await api.get(`/chamados/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                chamado.value = {
                    id: data.id,
                    titulo: data.title || 'Sem título',
                    descricao: data.description || '---',
                    categoria: data.categoria || '---',
                    ambiente: data.environment?.name || '---',
                    imagem: data.photo || null,
                    status: data.status || '---',
                    prioridade: data.prioridade || '---',
                    criadoEm: data.dt_criacao
                        ? new Date(data.dt_criacao).toLocaleString('pt-BR')
                        : '---',
                    atualizadoEm: data.update_date
                        ? new Date(data.update_date).toLocaleString('pt-BR')
                        : '---',
                    criadoPor: data.creator
                        ? { nome: data.creator.name, email: data.creator.email }
                        : { nome: '---', email: '---' },
                    tecnicoResponsavel: data.employee
                        ? { nome: data.employee.name, email: data.employee.email }
                        : null,
                    ultimaAcao: data.ultima_acao || 'Sem ações registradas',
                    dataUltimaAcao: data.data_ultima_acao
                        ? new Date(data.data_ultima_acao).toLocaleString('pt-BR')
                        : '---'
                };
            }
            catch (error) {
                console.error('❌ Erro ao carregar chamado:', error.response?.data || error);
                alert('Erro ao carregar chamado.');
                router.push('/tecnico/chamados');
            }
        };
        // ✅ Atribuir chamado ao técnico logado
        const atribuirChamado = async () => {
            if (!chamado.value)
                return;
            try {
                const token = auth.access;
                const id = chamado.value.id;
                await api.patch(`/chamados/${id}/`, {
                    employee: auth.user.id,
                    status: 'EM_ANDAMENTO',
                }, { headers: { Authorization: `Bearer ${token}` } });
                chamado.value.status = 'EM_ANDAMENTO';
                chamado.value.tecnicoResponsavel = {
                    nome: usuario.value.nome,
                    email: usuario.value.email,
                };
                chamado.value.ultimaAcao = 'Chamado atribuído ao técnico';
                chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
                alert('✅ Chamado atribuído com sucesso!');
            }
            catch (error) {
                console.error('❌ Erro ao atribuir chamado:', error.response?.data || error);
                alert('Erro ao atribuir chamado.');
            }
        };
        // ✅ Concluir chamado
        const concluirChamado = async () => {
            if (!chamado.value)
                return;
            try {
                const token = auth.access;
                const id = chamado.value.id;
                await api.patch(`/chamados/${id}/`, { status: 'CONCLUIDO' }, { headers: { Authorization: `Bearer ${token}` } });
                chamado.value.status = 'CONCLUIDO';
                chamado.value.ultimaAcao = 'Chamado concluído pelo técnico';
                chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
                alert('✅ Chamado concluído com sucesso!');
            }
            catch (error) {
                console.error('❌ Erro ao concluir chamado:', error.response?.data || error);
                alert('Erro ao concluir chamado.');
            }
        };
        // ✅ Alterar status manualmente
        const alterarStatus = async () => {
            if (!novoStatus.value || !chamado.value)
                return;
            try {
                const token = auth.access;
                const id = chamado.value.id;
                // Mapeia texto -> código aceito no backend
                const statusMap = {
                    'Aguardando': 'AGUARDANDO_ATENDIMENTO',
                    'Em Andamento': 'EM_ANDAMENTO',
                    'Concluído': 'CONCLUIDO',
                    'Cancelado': 'CANCELADO',
                };
                const backendStatus = statusMap[novoStatus.value] || novoStatus.value;
                await api.patch(`/chamados/${id}/`, { status: backendStatus }, { headers: { Authorization: `Bearer ${token}` } });
                chamado.value.status = backendStatus;
                chamado.value.ultimaAcao = `Status alterado para "${novoStatus.value}"`;
                chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
                alert(`✅ Status alterado para ${novoStatus.value}!`);
                novoStatus.value = '';
            }
            catch (error) {
                console.error('❌ Erro ao alterar status:', error.response?.data || error);
                alert('Erro ao alterar status.');
            }
        };
        // ✅ Reabrir chamado
        const reabrirChamado = async () => {
            if (!chamado.value)
                return;
            try {
                const token = auth.access;
                const id = chamado.value.id;
                await api.patch(`/chamados/${id}/`, { status: 'EM_ANDAMENTO' }, { headers: { Authorization: `Bearer ${token}` } });
                chamado.value.status = 'EM_ANDAMENTO';
                chamado.value.ultimaAcao = 'Chamado reaberto pelo técnico';
                chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
                alert('✅ Chamado reaberto com sucesso!');
            }
            catch (error) {
                console.error('❌ Erro ao reabrir chamado:', error.response?.data || error);
                alert('Erro ao reabrir chamado.');
            }
        };
        // ✅ Classes auxiliares
        const statusClass = (status) => {
            const s = status.toLowerCase();
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
            const s = status.toLowerCase();
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
        const prioridadeClass = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'prioridade-alta';
                case 'media': return 'prioridade-media';
                case 'baixa': return 'prioridade-baixa';
                default: return '';
            }
        };
        const prioridadeIcon = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'arrow_upward';
                case 'media': return 'remove';
                case 'baixa': return 'arrow_downward';
                default: return '';
            }
        };
        onMounted(() => {
            carregarChamado();
            carregarUsuario();
        });
        // ✅ retorna todas as funções usadas no template
        return {
            chamado,
            usuario,
            novoStatus,
            atribuirChamado,
            concluirChamado,
            alterarStatus,
            reabrirChamado,
            statusClass,
            statusIcon,
            prioridadeClass,
            prioridadeIcon
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'TecnicoChamadoDetalhado',
    components: { TecnicoSidebar },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const auth = useAuthStore();
        const novoStatus = ref('');
        // ✅ inicialização segura (evita null)
        const chamado = ref({
            id: null,
            titulo: '',
            descricao: '',
            categoria: '',
            imagem: null,
            status: '',
            prioridade: '',
            categorias: '',
            ambiente: '---',
            criadoEm: '',
            atualizadoEm: '',
            criadoPor: { nome: '', email: '' },
            tecnicoResponsavel: null,
            ultimaAcao: '',
            dataUltimaAcao: ''
        });
        const usuario = ref({
            nome: 'Carregando...',
            email: '',
            tipoUsuario: 'Técnico'
        });
        const carregarUsuario = async () => {
            try {
                const token = auth.access;
                if (!token)
                    return;
                const response = await api.get('/me/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                usuario.value = {
                    nome: data.name || 'Técnico',
                    email: data.email || 'sem@email.com',
                    tipoUsuario: data.role ? data.role.toUpperCase() : 'Técnico'
                };
                // opcional: sincroniza com o Pinia
                auth.user = data;
            }
            catch (error) {
                console.error('❌ Erro ao carregar usuário:', error.response?.data || error);
            }
        };
        // ✅ Função para carregar o chamado
        const carregarChamado = async () => {
            try {
                const id = route.params.id;
                const token = auth.access;
                if (!id || !token) {
                    console.error('⚠️ Falta ID ou token');
                    router.push('/tecnico/chamados');
                    return;
                }
                const response = await api.get(`/chamados/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data;
                chamado.value = {
                    id: data.id,
                    titulo: data.title || 'Sem título',
                    descricao: data.description || '---',
                    categoria: data.categoria || '---',
                    ambiente: data.environment?.name || '---',
                    imagem: data.photo || null,
                    status: data.status || '---',
                    prioridade: data.prioridade || '---',
                    criadoEm: data.dt_criacao
                        ? new Date(data.dt_criacao).toLocaleString('pt-BR')
                        : '---',
                    atualizadoEm: data.update_date
                        ? new Date(data.update_date).toLocaleString('pt-BR')
                        : '---',
                    criadoPor: data.creator
                        ? { nome: data.creator.name, email: data.creator.email }
                        : { nome: '---', email: '---' },
                    tecnicoResponsavel: data.employee
                        ? { nome: data.employee.name, email: data.employee.email }
                        : null,
                    ultimaAcao: data.ultima_acao || 'Sem ações registradas',
                    dataUltimaAcao: data.data_ultima_acao
                        ? new Date(data.data_ultima_acao).toLocaleString('pt-BR')
                        : '---'
                };
            }
            catch (error) {
                console.error('❌ Erro ao carregar chamado:', error.response?.data || error);
                alert('Erro ao carregar chamado.');
                router.push('/tecnico/chamados');
            }
        };
        // ✅ Atribuir chamado ao técnico logado
        const atribuirChamado = async () => {
            if (!chamado.value)
                return;
            try {
                const token = auth.access;
                const id = chamado.value.id;
                await api.patch(`/chamados/${id}/`, {
                    employee: auth.user.id,
                    status: 'EM_ANDAMENTO',
                }, { headers: { Authorization: `Bearer ${token}` } });
                chamado.value.status = 'EM_ANDAMENTO';
                chamado.value.tecnicoResponsavel = {
                    nome: usuario.value.nome,
                    email: usuario.value.email,
                };
                chamado.value.ultimaAcao = 'Chamado atribuído ao técnico';
                chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
                alert('✅ Chamado atribuído com sucesso!');
            }
            catch (error) {
                console.error('❌ Erro ao atribuir chamado:', error.response?.data || error);
                alert('Erro ao atribuir chamado.');
            }
        };
        // ✅ Concluir chamado
        const concluirChamado = async () => {
            if (!chamado.value)
                return;
            try {
                const token = auth.access;
                const id = chamado.value.id;
                await api.patch(`/chamados/${id}/`, { status: 'CONCLUIDO' }, { headers: { Authorization: `Bearer ${token}` } });
                chamado.value.status = 'CONCLUIDO';
                chamado.value.ultimaAcao = 'Chamado concluído pelo técnico';
                chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
                alert('✅ Chamado concluído com sucesso!');
            }
            catch (error) {
                console.error('❌ Erro ao concluir chamado:', error.response?.data || error);
                alert('Erro ao concluir chamado.');
            }
        };
        // ✅ Alterar status manualmente
        const alterarStatus = async () => {
            if (!novoStatus.value || !chamado.value)
                return;
            try {
                const token = auth.access;
                const id = chamado.value.id;
                // Mapeia texto -> código aceito no backend
                const statusMap = {
                    'Aguardando': 'AGUARDANDO_ATENDIMENTO',
                    'Em Andamento': 'EM_ANDAMENTO',
                    'Concluído': 'CONCLUIDO',
                    'Cancelado': 'CANCELADO',
                };
                const backendStatus = statusMap[novoStatus.value] || novoStatus.value;
                await api.patch(`/chamados/${id}/`, { status: backendStatus }, { headers: { Authorization: `Bearer ${token}` } });
                chamado.value.status = backendStatus;
                chamado.value.ultimaAcao = `Status alterado para "${novoStatus.value}"`;
                chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
                alert(`✅ Status alterado para ${novoStatus.value}!`);
                novoStatus.value = '';
            }
            catch (error) {
                console.error('❌ Erro ao alterar status:', error.response?.data || error);
                alert('Erro ao alterar status.');
            }
        };
        // ✅ Reabrir chamado
        const reabrirChamado = async () => {
            if (!chamado.value)
                return;
            try {
                const token = auth.access;
                const id = chamado.value.id;
                await api.patch(`/chamados/${id}/`, { status: 'EM_ANDAMENTO' }, { headers: { Authorization: `Bearer ${token}` } });
                chamado.value.status = 'EM_ANDAMENTO';
                chamado.value.ultimaAcao = 'Chamado reaberto pelo técnico';
                chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
                alert('✅ Chamado reaberto com sucesso!');
            }
            catch (error) {
                console.error('❌ Erro ao reabrir chamado:', error.response?.data || error);
                alert('Erro ao reabrir chamado.');
            }
        };
        // ✅ Classes auxiliares
        const statusClass = (status) => {
            const s = status.toLowerCase();
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
            const s = status.toLowerCase();
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
        const prioridadeClass = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'prioridade-alta';
                case 'media': return 'prioridade-media';
                case 'baixa': return 'prioridade-baixa';
                default: return '';
            }
        };
        const prioridadeIcon = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'arrow_upward';
                case 'media': return 'remove';
                case 'baixa': return 'arrow_downward';
                default: return '';
            }
        };
        onMounted(() => {
            carregarChamado();
            carregarUsuario();
        });
        // ✅ retorna todas as funções usadas no template
        return {
            chamado,
            usuario,
            novoStatus,
            atribuirChamado,
            concluirChamado,
            alterarStatus,
            reabrirChamado,
            statusClass,
            statusIcon,
            prioridadeClass,
            prioridadeIcon
        };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = { TecnicoSidebar };
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['action-section']} */ ;
/** @type {__VLS_StyleScopedClasses['action-section']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-atribuir']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-atribuir']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-concluir']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-concluir']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-reabrir']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-reabrir']} */ ;
/** @type {__VLS_StyleScopedClasses['status-select']} */ ;
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
/** @type {__VLS_StyleScopedClasses['title-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['date-info']} */ ;
/** @type {__VLS_StyleScopedClasses['date-container']} */ ;
/** @type {__VLS_StyleScopedClasses['right']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "chamado-detalhado-page" },
});
const __VLS_0 = {}.TecnicoSidebar;
/** @type {[typeof __VLS_components.TecnicoSidebar, typeof __VLS_components.tecnicoSidebar, ]} */ ;
// @ts-ignore
TecnicoSidebar;
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
            __VLS_ctx.$router.push('/tecnico/chamados');
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
(__VLS_ctx.chamado.categoria);
// @ts-ignore
[chamado,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "info-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "info-text" },
});
(__VLS_ctx.chamado.ambiente);
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
(__VLS_ctx.chamado.prioridade);
// @ts-ignore
[chamado,];
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
if (__VLS_ctx.chamado.status === 'AGUARDANDO_ATENDIMENTO' && !__VLS_ctx.chamado.tecnicoResponsavel) {
    // @ts-ignore
    [chamado, chamado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "action-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "summary-text" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.atribuirChamado) },
        ...{ class: "btn-atribuir" },
    });
    // @ts-ignore
    [atribuirChamado,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
}
else if (__VLS_ctx.chamado.status === 'EM_ANDAMENTO') {
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "action-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "summary-text" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "action-buttons" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.concluirChamado) },
        ...{ class: "btn-concluir" },
    });
    // @ts-ignore
    [concluirChamado,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
    __VLS_asFunctionalElement(__VLS_elements.select, __VLS_elements.select)({
        ...{ onChange: (__VLS_ctx.alterarStatus) },
        value: (__VLS_ctx.novoStatus),
        ...{ class: "status-select" },
    });
    // @ts-ignore
    [alterarStatus, novoStatus,];
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "Aguardando",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "Em Andamento",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "Concluído",
    });
    __VLS_asFunctionalElement(__VLS_elements.option, __VLS_elements.option)({
        value: "Cancelado",
    });
}
else if (__VLS_ctx.chamado.status === 'CONCLUIDO') {
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "action-section" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "summary-text" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.reabrirChamado) },
        ...{ class: "btn-reabrir" },
    });
    // @ts-ignore
    [reabrirChamado,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "tecnico-info-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
if (__VLS_ctx.chamado.tecnicoResponsavel) {
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({});
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "summary-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.br)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "summary-text tecnico-text" },
    });
    (__VLS_ctx.chamado.tecnicoResponsavel.nome);
    // @ts-ignore
    [chamado,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "summary-item" },
    });
    __VLS_asFunctionalElement(__VLS_elements.br)({});
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "summary-text tecnico-text" },
    });
    (__VLS_ctx.chamado.tecnicoResponsavel.email);
    // @ts-ignore
    [chamado,];
}
else {
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "summary-text" },
    });
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "historico-section" },
});
__VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "summary-text" },
});
(__VLS_ctx.chamado.ultimaAcao);
// @ts-ignore
[chamado,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "info-text timestamp" },
});
(__VLS_ctx.chamado.dataUltimaAcao);
// @ts-ignore
[chamado,];
/** @type {__VLS_StyleScopedClasses['chamado-detalhado-page']} */ ;
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
/** @type {__VLS_StyleScopedClasses['content-area']} */ ;
/** @type {__VLS_StyleScopedClasses['back-container']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['back-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['back-text']} */ ;
/** @type {__VLS_StyleScopedClasses['title-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
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
/** @type {__VLS_StyleScopedClasses['action-section']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-atribuir']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['action-section']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-concluir']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['status-select']} */ ;
/** @type {__VLS_StyleScopedClasses['action-section']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-reabrir']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['tecnico-info-section']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-item']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['tecnico-text']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-item']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['tecnico-text']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['historico-section']} */ ;
/** @type {__VLS_StyleScopedClasses['summary-text']} */ ;
/** @type {__VLS_StyleScopedClasses['info-text']} */ ;
/** @type {__VLS_StyleScopedClasses['timestamp']} */ ;
export default {};
//# sourceMappingURL=TecnicoChamaDetalha.vue.js.map