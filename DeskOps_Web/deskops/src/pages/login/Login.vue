<template>
  <div class="login-page">
    <!-- Container principal dividindo tela -->
    <div class="left-side">
      <img src="../../assets/images/logodeskops.png" alt="Logo DeskOps" class="logo-image" />
    </div>

    <div class="right-side">
      <div class="right-scroll">
        <!-- Container de login -->
        <div class="login-container fade-in">
          <h1 class="login-title">Acesse o Portal!</h1>
          <p class="login-subtitle">Entre usando o seu email e senha cadastrado</p>

          <!-- Campo E-mail -->
          <div class="input-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" placeholder="Digite o seu email" />
          </div>

          <!-- Campo Senha -->
          <div class="input-group">
            <label for="password">Senha</label>
            <input type="password" id="password" placeholder="Digite a sua senha" />
          </div>

          <button class="btn-login">Entrar</button>
        </div>

        <!-- Container de cadastro -->
        <div class="cadastro-container fade-in">
          <h2>Ainda não tem uma conta?</h2>
          <p>Cadastre agora mesmo</p>
          <router-link to="/cadastro">
            <button class="btn-cadastro">Cadastrar</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Login',
}
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

/* ANIMAÇÕES */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-left {
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
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
}
</style>