<template>
  <div class="cadastro-page">
    <!-- Container principal dividindo tela -->
    <div class="left-side">
      <img src="../../assets/images/logodeskops.png" alt="Logo DeskOps" class="logo-image" />
    </div>

    <div class="right-side">
      <div class="right-scroll">
        <!-- Container de cadastro com scroll -->
        <div class="cadastro-form-container fade-in">
          <h1 class="cadastro-title">Crie a sua conta!</h1>
          <p class="cadastro-subtitle">Preencha os campos abaixo para criar sua conta</p>

          <div class="form-scroll">
            <!-- Campo Nome -->
            <div class="input-group">
              <label for="nome">Nome</label>
              <input type="text" id="nome" placeholder="Digite seu nome" />
            </div>

            <!-- Campo E-mail -->
            <div class="input-group">
              <label for="email">E-mail</label>
              <input type="email" id="email" placeholder="Digite seu email" />
            </div>

            <!-- Campo Data de Nascimento -->
            <div class="input-group">
              <label for="birthdate">Data de Nascimento</label>
              <input type="date" id="birthdate" />
            </div>

            <!-- Campo CPF -->
            <div class="input-group">
              <label for="cpf">CPF</label>
              <input type="text" id="cpf" placeholder="Digite seu CPF" />
            </div>

            <!-- Campo Endereço -->
            <div class="input-group">
              <label for="endereco">Endereço</label>
              <input type="text" id="endereco" placeholder="Digite seu endereço" />
            </div>

            <!-- Campo Senha -->
            <div class="input-group">
              <label for="password">Senha</label>
              <input type="password" id="password" placeholder="Digite sua senha" />
            </div>

            <!-- Campo Confirmar Senha -->
            <div class="input-group">
              <label for="confirm-password">Confirmar Senha</label>
              <input type="password" id="confirm-password" placeholder="Confirme sua senha" />
            </div>
          </div>

          <button class="btn-cadastrar">Cadastrar</button>
        </div>

        <!-- Container para entrar -->
        <div class="login-container fade-in">
          <h2>Já tem uma conta?</h2>
          <p>Entre agora mesmo</p>
          <router-link to="/">
            <button class="btn-entrar">Entrar</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Cadastro',
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
.cadastro-page {
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
  overflow: hidden;
  padding: 0 20px;
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

/* Container de cadastro */
.cadastro-form-container {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cadastro-form-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-scroll {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.form-scroll::-webkit-scrollbar {
  width: 6px;
}

.form-scroll::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.cadastro-title {
  color: #000;
  margin-bottom: 8px;
  font-size: 24px;
  text-align: left;
}

.cadastro-subtitle {
  color: #888;
  margin-bottom: 24px;
  font-size: 14px;
  text-align: left;
}

.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.input-group label {
  color: #000;
  font-size: 14px;
  margin-bottom: 4px;
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

/* Botão cadastrar */
.btn-cadastrar {
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

.btn-cadastrar:hover {
  background-color: #222;
  transform: translateY(-2px);
}

/* Container para entrar */
.login-container {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 20px 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-container:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.login-container h2 {
  color: #000;
  font-size: 18px;
  margin-bottom: 4px;
}

.login-container p {
  color: #888;
  font-size: 14px;
  margin-bottom: 12px;
}

.btn-entrar {
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

.btn-entrar:hover {
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
  .cadastro-page {
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

  .cadastro-form-container,
  .login-container {
    max-width: 90%;
  }

  .form-scroll {
    max-height: 300px;
  }
}

@media (max-width: 500px) {
  .cadastro-form-container {
    padding: 30px 20px;
  }

  .cadastro-title {
    font-size: 20px;
  }

  .cadastro-subtitle {
    font-size: 12px;
  }

  .btn-cadastrar,
  .btn-entrar {
    font-size: 14px;
    padding: 10px 0;
  }

  .login-container {
    padding: 15px 20px;
  }

  .form-scroll {
    max-height: 250px;
  }
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .logo-image {
    max-width: 70%;
    max-height: 70%;
  }
  
  .cadastro-form-container,
  .login-container {
    max-width: 450px;
  }
  
  .form-scroll {
    max-height: 450px;
  }
}
</style>