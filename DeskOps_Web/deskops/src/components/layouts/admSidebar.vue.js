import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'AdmSidebar',
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const profileMenuOpen = ref(false);
        const showLogoutPopup = ref(false);
        const defaultFoto = new URL('@/assets/images/default-avatar.png', import.meta.url).href;
        // 👤 Dados do usuário logado vindos do Pinia
        const usuario = computed(() => {
            const user = auth.user;
            if (!user) {
                return {
                    nome: 'Administrador',
                    email: 'admin@deskops.com',
                    foto: ''
                };
            }
            return {
                nome: user.name || 'Administrador',
                email: user.email || 'admin@deskops.com',
                foto: user.foto_user || ''
            };
        });
        // 🔄 Atualiza os dados ao carregar o sidebar
        const carregarUsuario = async () => {
            try {
                const token = auth.access;
                if (!token)
                    return;
                const response = await api.get('/me/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Atualiza o estado global no Pinia
                auth.user = response.data;
            }
            catch (error) {
                console.error('❌ Erro ao carregar dados do usuário no sidebar:', error);
            }
        };
        const toggleProfileMenu = () => (profileMenuOpen.value = !profileMenuOpen.value);
        const closeProfileMenu = () => (profileMenuOpen.value = false);
        const goToPerfil = () => {
            router.push('/adm/perfil');
            closeProfileMenu();
        };
        const confirmLogout = () => {
            closeProfileMenu();
            showLogoutPopup.value = true;
        };
        const closeLogoutPopup = () => {
            showLogoutPopup.value = false;
        };
        const performLogout = () => {
            auth.logout?.();
            router.push('/');
            closeLogoutPopup();
        };
        // Fechar menu ao clicar fora
        const handleClickOutside = (event) => {
            const profileContainer = document.querySelector('.profile-container');
            if (profileContainer && !profileContainer.contains(event.target)) {
                closeProfileMenu();
            }
        };
        onMounted(() => {
            carregarUsuario();
            document.addEventListener('click', handleClickOutside);
        });
        onBeforeUnmount(() => {
            document.removeEventListener('click', handleClickOutside);
        });
        return {
            usuario,
            profileMenuOpen,
            showLogoutPopup,
            toggleProfileMenu,
            closeProfileMenu,
            goToPerfil,
            confirmLogout,
            closeLogoutPopup,
            performLogout,
            defaultFoto
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'AdmSidebar',
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const profileMenuOpen = ref(false);
        const showLogoutPopup = ref(false);
        const defaultFoto = new URL('@/assets/images/default-avatar.png', import.meta.url).href;
        // 👤 Dados do usuário logado vindos do Pinia
        const usuario = computed(() => {
            const user = auth.user;
            if (!user) {
                return {
                    nome: 'Administrador',
                    email: 'admin@deskops.com',
                    foto: ''
                };
            }
            return {
                nome: user.name || 'Administrador',
                email: user.email || 'admin@deskops.com',
                foto: user.foto_user || ''
            };
        });
        // 🔄 Atualiza os dados ao carregar o sidebar
        const carregarUsuario = async () => {
            try {
                const token = auth.access;
                if (!token)
                    return;
                const response = await api.get('/me/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Atualiza o estado global no Pinia
                auth.user = response.data;
            }
            catch (error) {
                console.error('❌ Erro ao carregar dados do usuário no sidebar:', error);
            }
        };
        const toggleProfileMenu = () => (profileMenuOpen.value = !profileMenuOpen.value);
        const closeProfileMenu = () => (profileMenuOpen.value = false);
        const goToPerfil = () => {
            router.push('/adm/perfil');
            closeProfileMenu();
        };
        const confirmLogout = () => {
            closeProfileMenu();
            showLogoutPopup.value = true;
        };
        const closeLogoutPopup = () => {
            showLogoutPopup.value = false;
        };
        const performLogout = () => {
            auth.logout?.();
            router.push('/');
            closeLogoutPopup();
        };
        // Fechar menu ao clicar fora
        const handleClickOutside = (event) => {
            const profileContainer = document.querySelector('.profile-container');
            if (profileContainer && !profileContainer.contains(event.target)) {
                closeProfileMenu();
            }
        };
        onMounted(() => {
            carregarUsuario();
            document.addEventListener('click', handleClickOutside);
        });
        onBeforeUnmount(() => {
            document.removeEventListener('click', handleClickOutside);
        });
        return {
            usuario,
            profileMenuOpen,
            showLogoutPopup,
            toggleProfileMenu,
            closeProfileMenu,
            goToPerfil,
            confirmLogout,
            closeLogoutPopup,
            performLogout,
            defaultFoto
        };
    }
});
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
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
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-dropdown-right']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
__VLS_asFunctionalElement(__VLS_elements.aside, __VLS_elements.aside)({
    ...{ class: "sidebar" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "sidebar-logo" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "../../assets/images/logodeskops.png",
    alt: "Logo DeskOps",
    ...{ class: "logo-image" },
});
__VLS_asFunctionalElement(__VLS_elements.nav, __VLS_elements.nav)({
    ...{ class: "sidebar-nav" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/adm/dashboard",
    ...{ class: "nav-link" },
    activeClass: "active",
}));
const __VLS_2 = __VLS_1({
    to: "/adm/dashboard",
    ...{ class: "nav-link" },
    activeClass: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
var __VLS_3;
const __VLS_5 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    to: "/adm/gestao-ambiente",
    ...{ class: "nav-link" },
    activeClass: "active",
}));
const __VLS_7 = __VLS_6({
    to: "/adm/gestao-ambiente",
    ...{ class: "nav-link" },
    activeClass: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
var __VLS_8;
const __VLS_10 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    to: "/adm/gestao-ativos",
    ...{ class: "nav-link" },
    activeClass: "active",
}));
const __VLS_12 = __VLS_11({
    to: "/adm/gestao-ativos",
    ...{ class: "nav-link" },
    activeClass: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_14 } = __VLS_13.slots;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
var __VLS_13;
const __VLS_15 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
    to: "/adm/gestao-chamado",
    ...{ class: "nav-link" },
    activeClass: "active",
}));
const __VLS_17 = __VLS_16({
    to: "/adm/gestao-chamado",
    ...{ class: "nav-link" },
    activeClass: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_19 } = __VLS_18.slots;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
var __VLS_18;
const __VLS_20 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    to: "/adm/gestao-usuarios",
    ...{ class: "nav-link" },
    activeClass: "active",
}));
const __VLS_22 = __VLS_21({
    to: "/adm/gestao-usuarios",
    ...{ class: "nav-link" },
    activeClass: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_24 } = __VLS_23.slots;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
var __VLS_23;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: () => { } },
    ...{ class: "profile-container" },
    ref: "profileContainer",
});
/** @type {typeof __VLS_ctx.profileContainer} */ ;
// @ts-ignore
[profileContainer,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (__VLS_ctx.toggleProfileMenu) },
    ...{ class: "sidebar-profile" },
});
// @ts-ignore
[toggleProfileMenu,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile-image" },
});
if (__VLS_ctx.usuario.foto) {
    // @ts-ignore
    [usuario,];
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: (__VLS_ctx.usuario.foto),
        alt: "Foto de perfil",
        ...{ class: "user-photo" },
    });
    // @ts-ignore
    [usuario,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "profile-info" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "profile-name" },
});
(__VLS_ctx.usuario.nome);
// @ts-ignore
[usuario,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "profile-email" },
});
(__VLS_ctx.usuario.email);
// @ts-ignore
[usuario,];
const __VLS_25 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    name: "slide-right",
}));
const __VLS_27 = __VLS_26({
    name: "slide-right",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_29 } = __VLS_28.slots;
if (__VLS_ctx.profileMenuOpen) {
    // @ts-ignore
    [profileMenuOpen,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "profile-dropdown-right" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.goToPerfil) },
        ...{ class: "dropdown-item" },
    });
    // @ts-ignore
    [goToPerfil,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.confirmLogout) },
        ...{ class: "dropdown-item" },
    });
    // @ts-ignore
    [confirmLogout,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons" },
    });
}
var __VLS_28;
if (__VLS_ctx.showLogoutPopup) {
    // @ts-ignore
    [showLogoutPopup,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.closeLogoutPopup) },
        ...{ class: "popup-overlay" },
    });
    // @ts-ignore
    [closeLogoutPopup,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "popup-container" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "popup-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ class: "material-icons popup-icon confirm" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "popup-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "popup-content" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "popup-message" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "popup-actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.closeLogoutPopup) },
        ...{ class: "popup-btn popup-btn-cancel" },
    });
    // @ts-ignore
    [closeLogoutPopup,];
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.performLogout) },
        ...{ class: "popup-btn popup-btn-confirm confirm" },
    });
    // @ts-ignore
    [performLogout,];
}
/** @type {__VLS_StyleScopedClasses['sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-logo']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-link']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-container']} */ ;
/** @type {__VLS_StyleScopedClasses['sidebar-profile']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-image']} */ ;
/** @type {__VLS_StyleScopedClasses['user-photo']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-info']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-name']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-email']} */ ;
/** @type {__VLS_StyleScopedClasses['profile-dropdown-right']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-container']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-header']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-title']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-content']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-message']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['popup-btn-confirm']} */ ;
/** @type {__VLS_StyleScopedClasses['confirm']} */ ;
export default {};
//# sourceMappingURL=admSidebar.vue.js.map