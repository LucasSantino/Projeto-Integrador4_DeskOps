import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_export = defineComponent({
    name: 'TecnicoSidebar',
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const profileMenuOpen = ref(false);
        const showLogoutPopup = ref(false);
        const defaultFoto = new URL('@/assets/images/default-avatar.png', import.meta.url).href;
        // ✅ Computed protegido (evita erro se auth.user for undefined)
        const usuario = computed(() => {
            const user = auth.user;
            if (!user) {
                return { name: 'Técnico', email: 'sem@email.com', foto: '' };
            }
            return {
                name: user.name || 'Técnico',
                email: user.email || 'sem@email.com',
                foto: user.foto_user || ''
            };
        });
        const toggleProfileMenu = () => {
            profileMenuOpen.value = !profileMenuOpen.value;
        };
        const closeProfileMenu = () => {
            profileMenuOpen.value = false;
        };
        const goToPerfil = () => {
            router.push('/tecnico/perfil');
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
            document.addEventListener('click', handleClickOutside);
        });
        onBeforeUnmount(() => {
            document.removeEventListener('click', handleClickOutside);
        });
        return {
            profileMenuOpen,
            showLogoutPopup,
            toggleProfileMenu,
            closeProfileMenu,
            goToPerfil,
            confirmLogout,
            closeLogoutPopup,
            performLogout,
            usuario,
            defaultFoto
        };
    }
});
const __VLS_self = (await import('vue')).defineComponent({
    name: 'TecnicoSidebar',
    setup() {
        const router = useRouter();
        const auth = useAuthStore();
        const profileMenuOpen = ref(false);
        const showLogoutPopup = ref(false);
        const defaultFoto = new URL('@/assets/images/default-avatar.png', import.meta.url).href;
        // ✅ Computed protegido (evita erro se auth.user for undefined)
        const usuario = computed(() => {
            const user = auth.user;
            if (!user) {
                return { name: 'Técnico', email: 'sem@email.com', foto: '' };
            }
            return {
                name: user.name || 'Técnico',
                email: user.email || 'sem@email.com',
                foto: user.foto_user || ''
            };
        });
        const toggleProfileMenu = () => {
            profileMenuOpen.value = !profileMenuOpen.value;
        };
        const closeProfileMenu = () => {
            profileMenuOpen.value = false;
        };
        const goToPerfil = () => {
            router.push('/tecnico/perfil');
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
            document.addEventListener('click', handleClickOutside);
        });
        onBeforeUnmount(() => {
            document.removeEventListener('click', handleClickOutside);
        });
        return {
            profileMenuOpen,
            showLogoutPopup,
            toggleProfileMenu,
            closeProfileMenu,
            goToPerfil,
            confirmLogout,
            closeLogoutPopup,
            performLogout,
            usuario,
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
    to: "/tecnico/chamados-lista",
    ...{ class: "nav-link" },
    activeClass: "active",
}));
const __VLS_2 = __VLS_1({
    to: "/tecnico/chamados-lista",
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
    to: "/tecnico/chamados",
    ...{ class: "nav-link" },
    activeClass: "active",
}));
const __VLS_7 = __VLS_6({
    to: "/tecnico/chamados",
    ...{ class: "nav-link" },
    activeClass: "active",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const { default: __VLS_9 } = __VLS_8.slots;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
var __VLS_8;
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
(__VLS_ctx.usuario.name);
// @ts-ignore
[usuario,];
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "profile-email" },
});
(__VLS_ctx.usuario.email);
// @ts-ignore
[usuario,];
const __VLS_10 = {}.transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.transition, typeof __VLS_components.Transition, typeof __VLS_components.transition, ]} */ ;
// @ts-ignore
Transition;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent(__VLS_10, new __VLS_10({
    name: "slide-right",
}));
const __VLS_12 = __VLS_11({
    name: "slide-right",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_14 } = __VLS_13.slots;
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
var __VLS_13;
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
//# sourceMappingURL=tecnicoSidebar.vue.js.map