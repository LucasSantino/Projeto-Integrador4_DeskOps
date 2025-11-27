import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const showLoadingModal = ref(false);
const showErrorModal = ref(false);
const showPassword = ref(false); // Novo estado para controlar visibilidade da senha
const auth = useAuthStore();
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};
const handleLogin = async () => {
    error.value = "";
    loading.value = true;
    showLoadingModal.value = true;
    try {
        await auth.login(email.value, password.value);
        // O authStore já faz o redirecionamento automático
    }
    catch (err) {
        error.value =
            err?.response?.data?.detail ||
                err?.detail ||
                "E-mail ou senha incorretos.";
        showErrorModal.value = true;
    }
    finally {
        loading.value = false;
        showLoadingModal.value = false;
    }
};
const closeModal = () => {
    // Não permite fechar o modal de loading clicando fora
    if (!loading.value) {
        showLoadingModal.value = false;
    }
};
const closeErrorModal = () => {
    showErrorModal.value = false;
    error.value = "";
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['password-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['password-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-login']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-login']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-container']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-container']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-container']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cadastro']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-error-ok']} */ ;
/** @type {__VLS_StyleScopedClasses['login-page']} */ ;
/** @type {__VLS_StyleScopedClasses['left-side']} */ ;
/** @type {__VLS_StyleScopedClasses['right-side']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-image']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-title']} */ ;
/** @type {__VLS_StyleScopedClasses['login-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-login']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cadastro']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-image']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-title']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['password-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-container']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-image']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-title']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-subtitle']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "login-page" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "left-side" },
});
__VLS_asFunctionalElement(__VLS_elements.img)({
    src: "../../assets/images/logodeskops.png",
    alt: "Logo DeskOps",
    ...{ class: "logo-image" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "right-side" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "right-scroll" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "login-container fade-in" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "login-title" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "login-subtitle" },
});
__VLS_asFunctionalElement(__VLS_elements.form, __VLS_elements.form)({
    ...{ onSubmit: (__VLS_ctx.handleLogin) },
});
// @ts-ignore
[handleLogin,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "email",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "email",
    id: "email",
    placeholder: "Digite o seu email",
    required: true,
});
(__VLS_ctx.email);
// @ts-ignore
[email,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group password-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "password",
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "password-input-container" },
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: (__VLS_ctx.showPassword ? 'text' : 'password'),
    id: "password",
    placeholder: "Digite a sua senha",
    required: true,
    ...{ class: "password-input" },
});
(__VLS_ctx.password);
// @ts-ignore
[showPassword, password,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.togglePasswordVisibility) },
    type: "button",
    ...{ class: "password-toggle" },
    tabindex: "-1",
});
// @ts-ignore
[togglePasswordVisibility,];
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "material-icons" },
});
(__VLS_ctx.showPassword ? 'visibility_off' : 'visibility');
// @ts-ignore
[showPassword,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ class: "btn-login" },
    type: "submit",
    disabled: (__VLS_ctx.loading),
});
// @ts-ignore
[loading,];
(__VLS_ctx.loading ? "Entrando..." : "Entrar");
// @ts-ignore
[loading,];
if (__VLS_ctx.error) {
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "error-message" },
    });
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "cadastro-container fade-in" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/cadastro",
}));
const __VLS_2 = __VLS_1({
    to: "/cadastro",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ class: "btn-cadastro" },
});
var __VLS_3;
if (__VLS_ctx.showLoadingModal) {
    // @ts-ignore
    [showLoadingModal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.closeModal) },
        ...{ class: "modal-overlay" },
    });
    // @ts-ignore
    [closeModal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-content" },
        ...{ class: ({ 'modal-visible': __VLS_ctx.showLoadingModal }) },
    });
    // @ts-ignore
    [showLoadingModal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "loading-spinner" },
    });
    __VLS_asFunctionalElement(__VLS_elements.img)({
        src: "../../assets/images/iconedeskops.png",
        alt: "Loading",
        ...{ class: "spinner-image" },
        ...{ class: ({ rotating: __VLS_ctx.showLoadingModal }) },
    });
    // @ts-ignore
    [showLoadingModal,];
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "loading-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "loading-subtitle" },
    });
}
if (__VLS_ctx.showErrorModal) {
    // @ts-ignore
    [showErrorModal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ onClick: (__VLS_ctx.closeErrorModal) },
        ...{ class: "modal-overlay" },
    });
    // @ts-ignore
    [closeErrorModal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "modal-content error-modal" },
        ...{ class: ({ 'modal-visible': __VLS_ctx.showErrorModal }) },
    });
    // @ts-ignore
    [showErrorModal,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "error-header" },
    });
    __VLS_asFunctionalElement(__VLS_elements.h3, __VLS_elements.h3)({
        ...{ class: "error-title" },
    });
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "error-body" },
    });
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
    (__VLS_ctx.error);
    // @ts-ignore
    [error,];
    __VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
        ...{ class: "error-actions" },
    });
    __VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
        ...{ onClick: (__VLS_ctx.closeErrorModal) },
        ...{ class: "btn-error-ok" },
    });
    // @ts-ignore
    [closeErrorModal,];
}
/** @type {__VLS_StyleScopedClasses['login-page']} */ ;
/** @type {__VLS_StyleScopedClasses['left-side']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
/** @type {__VLS_StyleScopedClasses['right-side']} */ ;
/** @type {__VLS_StyleScopedClasses['right-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['login-title']} */ ;
/** @type {__VLS_StyleScopedClasses['login-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['password-group']} */ ;
/** @type {__VLS_StyleScopedClasses['password-input-container']} */ ;
/** @type {__VLS_StyleScopedClasses['password-input']} */ ;
/** @type {__VLS_StyleScopedClasses['password-toggle']} */ ;
/** @type {__VLS_StyleScopedClasses['material-icons']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-login']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-container']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cadastro']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-visible']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-image']} */ ;
/** @type {__VLS_StyleScopedClasses['rotating']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-title']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-content']} */ ;
/** @type {__VLS_StyleScopedClasses['error-modal']} */ ;
/** @type {__VLS_StyleScopedClasses['modal-visible']} */ ;
/** @type {__VLS_StyleScopedClasses['error-header']} */ ;
/** @type {__VLS_StyleScopedClasses['error-title']} */ ;
/** @type {__VLS_StyleScopedClasses['error-body']} */ ;
/** @type {__VLS_StyleScopedClasses['error-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-error-ok']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=Login.vue.js.map