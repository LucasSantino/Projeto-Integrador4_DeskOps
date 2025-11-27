import { ref } from "vue";
import api from "../../services/api"; // arquivo axios centralizado
import { useRouter } from "vue-router";
const router = useRouter();
// Campos do formulário
const form = ref({
    name: "",
    email: "",
    password: "",
    cpf: "",
    dt_nascimento: "",
    endereco: "",
});
const confirmPassword = ref("");
const message = ref("");
const error = ref("");
// Função de cadastro
const handleRegister = async () => {
    message.value = "";
    error.value = "";
    if (form.value.password !== confirmPassword.value) {
        error.value = "As senhas não coincidem.";
        return;
    }
    try {
        const response = await api.post("register/", form.value);
        message.value = "Cadastro realizado com sucesso! Aguarde aprovação do administrador.";
        // limpa campos após o sucesso
        Object.keys(form.value).forEach((key) => (form.value[key] = ""));
        confirmPassword.value = "";
        // redireciona após 3s
        setTimeout(() => router.push("/"), 3000);
    }
    catch (err) {
        console.error("Erro ao cadastrar:", err.response?.data || err);
        error.value = err.response?.data?.error || "Erro ao cadastrar. Verifique os dados.";
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['cadastro-form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['form-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cadastrar']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-entrar']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-page']} */ ;
/** @type {__VLS_StyleScopedClasses['left-side']} */ ;
/** @type {__VLS_StyleScopedClasses['right-side']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-title']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cadastrar']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-entrar']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['form-scroll']} */ ;
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "cadastro-page" },
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
    ...{ class: "cadastro-form-container fade-in" },
});
__VLS_asFunctionalElement(__VLS_elements.h1, __VLS_elements.h1)({
    ...{ class: "cadastro-title" },
});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
    ...{ class: "cadastro-subtitle" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "form-scroll" },
});
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "nome",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    value: (__VLS_ctx.form.name),
    type: "text",
    id: "nome",
    placeholder: "Digite seu nome",
});
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "email",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "email",
    id: "email",
    placeholder: "Digite seu email",
});
(__VLS_ctx.form.email);
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "birthdate",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "date",
    id: "birthdate",
});
(__VLS_ctx.form.dt_nascimento);
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "cpf",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    value: (__VLS_ctx.form.cpf),
    type: "text",
    id: "cpf",
    placeholder: "Digite seu CPF",
});
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "endereco",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    value: (__VLS_ctx.form.endereco),
    type: "text",
    id: "endereco",
    placeholder: "Digite seu endereço",
});
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "password",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "password",
    id: "password",
    placeholder: "Digite sua senha",
});
(__VLS_ctx.form.password);
// @ts-ignore
[form,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ class: "input-group" },
});
__VLS_asFunctionalElement(__VLS_elements.label, __VLS_elements.label)({
    for: "confirm-password",
});
__VLS_asFunctionalElement(__VLS_elements.input)({
    type: "password",
    id: "confirm-password",
    placeholder: "Confirme sua senha",
});
(__VLS_ctx.confirmPassword);
// @ts-ignore
[confirmPassword,];
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ onClick: (__VLS_ctx.handleRegister) },
    ...{ class: "btn-cadastrar" },
});
// @ts-ignore
[handleRegister,];
if (__VLS_ctx.message) {
    // @ts-ignore
    [message,];
    __VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({
        ...{ class: "success-message" },
    });
    (__VLS_ctx.message);
    // @ts-ignore
    [message,];
}
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
    ...{ class: "login-container fade-in" },
});
__VLS_asFunctionalElement(__VLS_elements.h2, __VLS_elements.h2)({});
__VLS_asFunctionalElement(__VLS_elements.p, __VLS_elements.p)({});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/",
}));
const __VLS_2 = __VLS_1({
    to: "/",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_4 } = __VLS_3.slots;
__VLS_asFunctionalElement(__VLS_elements.button, __VLS_elements.button)({
    ...{ class: "btn-entrar" },
});
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['cadastro-page']} */ ;
/** @type {__VLS_StyleScopedClasses['left-side']} */ ;
/** @type {__VLS_StyleScopedClasses['logo-image']} */ ;
/** @type {__VLS_StyleScopedClasses['right-side']} */ ;
/** @type {__VLS_StyleScopedClasses['right-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-form-container']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-title']} */ ;
/** @type {__VLS_StyleScopedClasses['cadastro-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['form-scroll']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-cadastrar']} */ ;
/** @type {__VLS_StyleScopedClasses['success-message']} */ ;
/** @type {__VLS_StyleScopedClasses['error-message']} */ ;
/** @type {__VLS_StyleScopedClasses['login-container']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-entrar']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=cadastro.vue.js.map