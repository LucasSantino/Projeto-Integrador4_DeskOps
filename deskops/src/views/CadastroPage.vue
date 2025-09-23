<template>
  <div class="login-container">
    <!-- Lado esquerdo -->
    <div class="login-left">
      <img src="@/assets/logodeskops.png" alt="DeskOps Logo" class="logo" />
    </div>

    <!-- Lado direito -->
    <div class="login-right">
      <div class="login-box">
        <h2>Crie sua conta</h2>
        <p class="subtext">Informe seu nome, email e senha</p>

        <form @submit.prevent="login">
          <label>Nome</label>
          <input type="name" v-model="name" placeholder="Digite seu nome completo" required />

          <label>E-mail</label>
          <input type="email" v-model="email" placeholder="exemplo@mail.com" required />

          <label>Senha</label>
          <input type="password" v-model="password" placeholder="Digite sua senha" required />

          <button type="submit" class="btn-black">Entrar</button>
        </form>

        <div class="register-box">
          <p>Já tem uma conta?</p>
          <p>Entre agora mesmo</p>
          <button class="btn-light" @click="goToLogin">Acessar conta</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CadastroPage',
  data() {
    return {
      name: '',
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
      console.log('Cadastro com:', this.name, this.email, this.password)
      // Aqui você pode chamar sua API para criar uma conta
    },
    goToLogin() {
      this.$router.push('/login')  // Redireciona para a página de login
    }
  }
}
</script>

<style scoped>
/* Seu estilo permanece o mesmo */
</style>


<style scoped>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

html, body{
    height:100%;
    overflow: hidden;
    font-family: 'Segoe UI', sans-serif;

}

.login-container {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  overflow: hidden;
}

/* Lado esquerdo */
.login-left {
  background-color: #181112;
  color: white;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 500px;
  margin-bottom: 20px;
}

.login-left p {
  font-size: 14px;
  opacity: 0.8;
}

/* Lado direito */
.login-right {
  background-color: #fff;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 10px;
}

.login-box h2 {
  margin-bottom: 8px;
}

.subtext {
  font-size: 13px;
  color: #555;
  margin-bottom: 16px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 14px;
  text-align:left;
}

input {
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-black {
  background-color: #111;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-light {
  background-color: #f2f2f2;
  color: black;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  margin-top: 12px;
}

.register-box {
  margin-top: 24px;
  text-align: left;
}
</style>
