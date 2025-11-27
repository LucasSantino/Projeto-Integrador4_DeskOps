import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import TecnicoSidebar from '@/components/layouts/tecnicoSidebar.vue';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'TecnicoChamadoDetalhado',
    components: {
        TecnicoSidebar
    },
    setup() {
        const router = useRouter();
        const novoStatus = ref('');
        const usuario = ref({
            nome: 'Victor Ribeiro',
            email: 'victor@email.com',
            dataNascimento: '15/03/1985',
            cpf: '987.654.321-00',
            endereco: 'Av. Técnica, 456, São Paulo, SP',
            tipoUsuario: 'Técnico',
            foto: '',
        });
        const chamado = ref({
            id: 1024,
            titulo: 'Erro ao acessar o painel administrativo',
            descricao: 'Usuário relata que ao tentar acessar o painel, uma tela de erro 500 é exibida. Foi realizado teste em diferentes navegadores e o problema persiste.',
            categoria: 'Suporte Técnico',
            imagem: '',
            status: 'Aguardando',
            prioridade: 'Alta',
            criadoEm: '10/10/2025 - 14:22',
            atualizadoEm: '11/10/2025 - 09:10',
            criadoPor: {
                nome: 'Lucas Santino',
                email: 'lucas@email.com'
            },
            tecnicoResponsavel: null,
            ultimaAcao: 'Chamado criado pelo cliente',
            dataUltimaAcao: '10/10/2025 - 14:22'
        });
        const closeProfileMenu = () => {
            // Esta função será chamada no clique da página para fechar o menu de perfil
        };
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
        const formatarPrioridade = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'Alta';
                case 'media': return 'Média';
                case 'baixa': return 'Baixa';
                default: return prioridade;
            }
        };
        const atribuirChamado = () => {
            chamado.value.status = 'Em Andamento';
            chamado.value.tecnicoResponsavel = {
                nome: usuario.value.nome,
                email: usuario.value.email
            };
            chamado.value.ultimaAcao = 'Chamado atribuído ao técnico';
            chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
            chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR');
            // Simular ação no backend
            console.log('Chamado atribuído:', chamado.value.id);
        };
        const concluirChamado = () => {
            chamado.value.status = 'Concluído';
            chamado.value.ultimaAcao = 'Chamado concluído pelo técnico';
            chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
            chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR');
            // Simular ação no backend
            console.log('Chamado concluído:', chamado.value.id);
        };
        const alterarStatus = () => {
            if (novoStatus.value) {
                const statusAnterior = chamado.value.status;
                chamado.value.status = novoStatus.value;
                chamado.value.ultimaAcao = `Status alterado de "${statusAnterior}" para "${novoStatus.value}"`;
                chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
                chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR');
                novoStatus.value = '';
                // Simular ação no backend
                console.log('Status alterado para:', chamado.value.status);
            }
        };
        const reabrirChamado = () => {
            chamado.value.status = 'Em Andamento';
            chamado.value.ultimaAcao = 'Chamado reaberto pelo técnico';
            chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
            chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR');
            // Simular ação no backend
            console.log('Chamado reaberto:', chamado.value.id);
        };
        // Simular carregamento dos dados do chamado
        onMounted(() => {
            // Aqui viria a chamada à API para carregar os dados do chamado
            console.log('Carregando dados do chamado...');
        });
        return {
            chamado,
            usuario,
            novoStatus,
            closeProfileMenu,
            statusClass,
            statusIcon,
            prioridadeClass,
            prioridadeIcon,
            formatarPrioridade,
            atribuirChamado,
            concluirChamado,
            alterarStatus,
            reabrirChamado
        };
    },
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'TecnicoChamadoDetalhado',
    components: {
        TecnicoSidebar
    },
    setup() {
        const router = useRouter();
        const novoStatus = ref('');
        const usuario = ref({
            nome: 'Victor Ribeiro',
            email: 'victor@email.com',
            dataNascimento: '15/03/1985',
            cpf: '987.654.321-00',
            endereco: 'Av. Técnica, 456, São Paulo, SP',
            tipoUsuario: 'Técnico',
            foto: '',
        });
        const chamado = ref({
            id: 1024,
            titulo: 'Erro ao acessar o painel administrativo',
            descricao: 'Usuário relata que ao tentar acessar o painel, uma tela de erro 500 é exibida. Foi realizado teste em diferentes navegadores e o problema persiste.',
            categoria: 'Suporte Técnico',
            imagem: '',
            status: 'Aguardando',
            prioridade: 'Alta',
            criadoEm: '10/10/2025 - 14:22',
            atualizadoEm: '11/10/2025 - 09:10',
            criadoPor: {
                nome: 'Lucas Santino',
                email: 'lucas@email.com'
            },
            tecnicoResponsavel: null,
            ultimaAcao: 'Chamado criado pelo cliente',
            dataUltimaAcao: '10/10/2025 - 14:22'
        });
        const closeProfileMenu = () => {
            // Esta função será chamada no clique da página para fechar o menu de perfil
        };
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
        const formatarPrioridade = (prioridade) => {
            switch (prioridade.toLowerCase()) {
                case 'alta': return 'Alta';
                case 'media': return 'Média';
                case 'baixa': return 'Baixa';
                default: return prioridade;
            }
        };
        const atribuirChamado = () => {
            chamado.value.status = 'Em Andamento';
            chamado.value.tecnicoResponsavel = {
                nome: usuario.value.nome,
                email: usuario.value.email
            };
            chamado.value.ultimaAcao = 'Chamado atribuído ao técnico';
            chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
            chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR');
            // Simular ação no backend
            console.log('Chamado atribuído:', chamado.value.id);
        };
        const concluirChamado = () => {
            chamado.value.status = 'Concluído';
            chamado.value.ultimaAcao = 'Chamado concluído pelo técnico';
            chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
            chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR');
            // Simular ação no backend
            console.log('Chamado concluído:', chamado.value.id);
        };
        const alterarStatus = () => {
            if (novoStatus.value) {
                const statusAnterior = chamado.value.status;
                chamado.value.status = novoStatus.value;
                chamado.value.ultimaAcao = `Status alterado de "${statusAnterior}" para "${novoStatus.value}"`;
                chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
                chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR');
                novoStatus.value = '';
                // Simular ação no backend
                console.log('Status alterado para:', chamado.value.status);
            }
        };
        const reabrirChamado = () => {
            chamado.value.status = 'Em Andamento';
            chamado.value.ultimaAcao = 'Chamado reaberto pelo técnico';
            chamado.value.dataUltimaAcao = new Date().toLocaleString('pt-BR');
            chamado.value.atualizadoEm = new Date().toLocaleString('pt-BR');
            // Simular ação no backend
            console.log('Chamado reaberto:', chamado.value.id);
        };
        // Simular carregamento dos dados do chamado
        onMounted(() => {
            // Aqui viria a chamada à API para carregar os dados do chamado
            console.log('Carregando dados do chamado...');
        });
        return {
            chamado,
            usuario,
            novoStatus,
            closeProfileMenu,
            statusClass,
            statusIcon,
            prioridadeClass,
            prioridadeIcon,
            formatarPrioridade,
            atribuirChamado,
            concluirChamado,
            alterarStatus,
            reabrirChamado
        };
    },
});
const __VLS_ctx = {};
let __VLS_elements;
const __VLS_componentsOption = {
    TecnicoSidebar
};
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
    ...{ onClick: (__VLS_ctx.closeProfileMenu) },
    ...{ class: "chamado-detalhado-page" },
});
// @ts-ignore
[closeProfileMenu,];
const __VLS_0 = {}.TecnicoSidebar;
/** @type {[typeof __VLS_components.TecnicoSidebar, typeof __VLS_components.tecnicoSidebar, ]} */ ;
// @ts-ignore
TecnicoSidebar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    usuario: (__VLS_ctx.usuario),
}));
const __VLS_2 = __VLS_1({
    usuario: (__VLS_ctx.usuario),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
// @ts-ignore
[usuario,];
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
if (__VLS_ctx.chamado.status === 'Aguardando') {
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
        ...{ onClick: (__VLS_ctx.atribuirChamado) },
        ...{ class: "btn-atribuir" },
    });
    // @ts-ignore
    [atribuirChamado,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
}
else if (__VLS_ctx.chamado.status === 'Em Andamento') {
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
else if (__VLS_ctx.chamado.status === 'Concluído') {
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
//# sourceMappingURL=tecnico_chamaDetalha.vue.js.map