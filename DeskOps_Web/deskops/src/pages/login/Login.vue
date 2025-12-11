<template>
  <div class="login-page">
    <div class="left-side">
      <img src="../../assets/images/logodeskops.png" alt="Logo DeskOps" class="logo-image" />
    </div>

    <div class="right-side">
      <div class="right-scroll">
        <div class="login-container fade-in">
          <h1 class="login-title">Acesse o Portal!</h1>
          <p class="login-subtitle">Entre usando o seu email e senha cadastrado</p>

          <!-- 🔽 agora temos um form -->
          <form @submit.prevent="handleLogin">
            <div class="input-group">
              <label for="email">E-mail</label>
              <input
                v-model="email"
                type="email"
                id="email"
                placeholder="Digite o seu email"
                required
              />
            </div>

            <div class="input-group password-group">
              <label for="password">Senha</label>
              <div class="password-input-container">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  placeholder="Digite a sua senha"
                  required
                  class="password-input"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="togglePasswordVisibility"
                  tabindex="-1"
                >
                  <span class="material-icons">
                    {{ showPassword ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
              </div>
            </div>

            <button class="btn-login" type="submit" :disabled="loading">
              {{ loading ? "Entrando..." : "Entrar" }}
            </button>
          </form>

          <p v-if="error" class="error-message">{{ error }}</p>
        </div>

        <div class="cadastro-container fade-in">
          <h2>Ainda não tem uma conta?</h2>
          <p>Cadastre agora mesmo</p>
          <router-link to="/cadastro">
            <button class="btn-cadastro">Cadastrar</button>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal de Loading -->
    <div v-if="showLoadingModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" :class="{ 'modal-visible': showLoadingModal }">
        <div class="loading-spinner">
          <img 
            src="../../assets/images/iconedeskops.png" 
            alt="Loading" 
            class="spinner-image"
            :class="{ rotating: showLoadingModal }"
          />
        </div>
        <h3 class="loading-title">Entrando...</h3>
        <p class="loading-subtitle">Aguarde um momento</p>
      </div>
    </div>

    <!-- Modal de Erro -->
    <div v-if="showErrorModal" class="modal-overlay" @click.self="closeErrorModal">
      <div class="modal-content error-modal" :class="{ 'modal-visible': showErrorModal }">
        <div class="error-header">
          <h3 class="error-title">Erro</h3>
        </div>
        <div class="error-body">
          <p>{{ error }}</p>
        </div>
        <div class="error-actions">
          <button class="btn-error-ok" @click="closeErrorModal">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
} catch (err: any) {
  // Se houver resposta do backend
  if (err.response?.data) {
    // Se for um objeto, transforma em string legível
    if (typeof err.response.data === "object") {
      error.value = Object.values(err.response.data)
        .flat()
        .join(" ");
    } else {
      error.value = err.response.data;
    }
  } else if (err.detail) {
    error.value = err.detail;
  } else {
    error.value = "E-mail ou senha incorretos.";
  }

  showErrorModal.value = true;
} finally {
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
</script>

<style scoped>
/* RESET COMPLETO E FULLSCREEN - IGUAL AO PERFIL.VUE */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
}

html, body, #app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* CONTAINER PRINCIPAL - FULLSCREEN */
.login-page {
  display: flex;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-width: 100vw;
  overflow: hidden;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: fade-in 1s ease-out;
}

/* Lado esquerdo preto */
.left-side {
  flex: 1;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.logo-image {
  max-width: 80%;
  max-height: 80%;
  animation: slide-in-left 1s ease-out;
}

/* Lado direito branco */
.right-side {
  flex: 1;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  overflow: hidden;
  height: 100vh;
}

/* Scroll interno do lado direito */
.right-scroll {
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}

/* Container de login */
.login-container {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.login-title {
  color: #000;
  margin-bottom: 8px;
  font-size: 24px;
  text-align: left;
}

.login-subtitle {
  color: #888;
  margin-bottom: 24px;
  font-size: 14px;
  text-align: left;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  color: #000;
  font-size: 14px;
  margin-bottom: 4px;
  text-align: left;
}

.input-group input {
  background-color: #fff;
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 8px 4px;
  font-size: 14px;
  color: #333;
  transition: border-color 0.3s ease;
}

.input-group input::placeholder {
  color: #888;
}

.input-group input:focus {
  outline: none;
  border-bottom: 2px solid #000;
}

/* ESTILOS ESPECÍFICOS PARA O CAMPO DE SENHA */
.password-group {
  position: relative;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  flex: 1;
  padding-right: 40px; /* Espaço para o ícone */
  width: 100%;
}

.password-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  border-radius: 4px;
}

.password-toggle:hover {
  color: #000;
  background-color: #f5f5f5;
}

.password-toggle:focus {
  outline: none;
  background-color: #f0f0f0;
}

.material-icons {
  font-size: 20px;
  user-select: none;
}

/* Botão login */
.btn-login {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 12px 0;
  width: 100%;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-login:hover {
  background-color: #222;
  transform: translateY(-2px);
}

.btn-login:disabled {
  background-color: #666;
  cursor: not-allowed;
  transform: none;
}

/* Container de cadastro */
.cadastro-container {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 20px 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cadastro-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cadastro-container h2 {
  color: #000;
  font-size: 18px;
  margin-bottom: 4px;
}

.cadastro-container p {
  color: #888;
  font-size: 14px;
  margin-bottom: 12px;
}

.btn-cadastro {
  background-color: #ccc;
  color: #000;
  border: none;
  padding: 10px 0;
  width: 100%;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-cadastro:hover {
  background-color: #aaa;
  transform: translateY(-2px);
}

/* MODAIS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.54);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fade-in 0.3s ease-out;
}

.modal-content {
  background-color: white;
  padding: 50px 40px;
  border-radius: 25px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  text-align: center;
  max-width: 450px;
  width: 90%;
  opacity: 0;
  transform: scale(0.8) translateY(20px);
  transition: all 5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal-content.modal-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.loading-spinner {
  margin-bottom: 30px;
}

.spinner-image {
  width: 160px;
  height: 160px;
  object-fit: contain;
}

.rotating {
  animation: rotate 1s linear infinite;
}

.loading-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.loading-subtitle {
  font-size: 16px;
  color: #666;
  text-align: center;
}

/* Modal de Erro */
.error-modal {
  max-width: 400px;
  padding: 0;
  overflow: hidden;
  transition: all 0.3s ease-out;
}

.error-header {
  background-color: #fff;
  padding: 25px 25px 0 25px;
}

.error-title {
  font-weight: bold;
  color: #4f46e5;
  margin: 0;
  font-size: 20px;
}

.error-body {
  padding: 25px;
  color: #333;
  font-size: 16px;
}

.error-actions {
  padding: 0 25px 25px 25px;
  display: flex;
  justify-content: flex-end;
}

.btn-error-ok {
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.btn-error-ok:hover {
  background-color: #f5f5f5;
}

/* ANIMAÇÕES */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-left {
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes scale-in {
  from { 
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-message {
  color: #d32f2f;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

/* RESPONSIVIDADE */
@media (max-width: 900px) {
  .login-page {
    flex-direction: column;
  }

  .left-side,
  .right-side {
    flex: none;
    width: 100%;
    height: 50vh;
  }

  .logo-image {
    max-width: 60%;
    max-height: 60%;
  }

  .login-container,
  .cadastro-container {
    max-width: 90%;
  }

  .modal-content {
    max-width: 380px;
    padding: 40px 30px;
  }

  .spinner-image {
    width: 140px;
    height: 140px;
  }
}

@media (max-width: 500px) {
  .login-container {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 20px;
  }

  .login-subtitle {
    font-size: 12px;
  }

  .btn-login,
  .btn-cadastro {
    font-size: 14px;
    padding: 10px 0;
  }

  .cadastro-container {
    padding: 15px 20px;
  }

  .modal-content {
    padding: 35px 25px;
    max-width: 320px;
    border-radius: 20px;
  }

  .spinner-image {
    width: 120px;
    height: 120px;
  }

  .loading-title {
    font-size: 18px;
  }

  .loading-subtitle {
    font-size: 14px;
  }

  .password-toggle {
    padding: 6px;
  }

  .material-icons {
    font-size: 18px;
  }
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .logo-image {
    max-width: 70%;
    max-height: 70%;
  }
  
  .login-container,
  .cadastro-container {
    max-width: 450px;
  }

  .modal-content {
    max-width: 500px;
    padding: 60px 50px;
  }

  .spinner-image {
    width: 180px;
    height: 180px;
  }

  .loading-title {
    font-size: 22px;
  }

  .loading-subtitle {
    font-size: 18px;
  }
}
</style>