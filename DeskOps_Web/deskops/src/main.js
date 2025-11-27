import { createApp } from 'vue';
import { createPinia } from 'pinia'; // 👈 importa o Pinia
import App from './App.vue';
import router from './router';
import 'material-icons/iconfont/material-icons.css';
import './style.css';
// cria a instância do Pinia
const pinia = createPinia();
// cria a aplicação Vue
const app = createApp(App);
// registra o Pinia e o router na aplicação
app.use(pinia); // 👈 ESSENCIAL — ativa o Pinia
app.use(router);
// monta a aplicação
app.mount('#app');
//# sourceMappingURL=main.js.map