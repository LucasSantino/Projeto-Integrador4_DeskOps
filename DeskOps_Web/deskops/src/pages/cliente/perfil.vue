<template>
  <div class="perfil-page">
    <!-- Sidebar como componente -->
    <ClienteSidebar 
      :user-name="usuario.nome" 
      :user-email="usuario.email"
    />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <!-- Botão Voltar -->
        <div class="back-container" @click="$router.push('/cliente/meus-chamados')">
          <span class="material-icons back-icon">arrow_back</span>
          <span class="back-text">Voltar</span>
        </div>

        <!-- Título -->
        <h1 class="page-title">Perfil do Usuário</h1>

        <div class="cards-container">
          <!-- Card do Perfil -->
          <div class="card-form">
            <div class="perfil-header">
              <img :src="usuario.foto || defaultFoto" alt="Foto do usuário" class="perfil-foto" />
              <h2 class="perfil-nome">{{ usuario.nome }}</h2>
            </div>

            <div class="info-section">
              <h3>Email</h3>
              <p class="info-text">{{ usuario.email }}</p>
            </div>

            <div class="info-section">
              <h3>Data de Nascimento</h3>
              <p class="info-text">{{ usuario.dataNascimento }}</p>
            </div>

            <div class="info-section">
              <h3>CPF</h3>
              <p class="info-text">{{ usuario.cpf }}</p>
            </div>

            <div class="info-section">
              <h3>Endereço</h3>
              <p class="info-text">{{ usuario.endereco }}</p>
            </div>

            <div class="info-section">
              <h3>Tipo de Usuário</h3>
              <p class="info-text">{{ usuario.tipoUsuario }}</p>
            </div>

            <div class="info-section">
              <h3>Senha</h3>
              <p class="info-text">********</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import ClienteSidebar from '@/components/layouts/clienteSidebar.vue'

export default defineComponent({
  name: 'Perfil',
  components: {
    ClienteSidebar
  },
  setup() {
    const router = useRouter()

    const usuario = ref({
      nome: 'Lucas Santino da Silva',
      email: 'lucas@email.com',
      dataNascimento: '01/01/1990',
      cpf: '123.456.789-00',
      endereco: 'Rua Exemplo, 123, São Paulo, SP',
      tipoUsuario: 'Cliente',
      foto: '', 
    })

    const defaultFoto = new URL('../../assets/images/default-avatar.png', import.meta.url).href

    return {
      usuario,
      defaultFoto,
    }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

/* RESET COMPLETO E FULLSCREEN */
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
.perfil-page {
  display: flex;
  height: 100vh;
  width: 100vw;
  min-height: 100vh;
  min-width: 100vw;
  overflow: hidden;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* CONTEÚDO PRINCIPAL - LAYOUT FULLSCREEN */
.main-content {
  flex: 1;
  background-color: #fff;
  margin-left: 250px;
  width: calc(100vw - 250px);
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  height: auto;
  min-height: 100vh;
  overflow: hidden;
  padding: 0 40px;
}

/* CORREÇÃO: Material-icons no conteúdo principal devem herdar a cor do contexto */
.main-content .material-icons {
  color: inherit;
  font-size: inherit;
}

/* Cabeçalho - MAIS ESPAÇAMENTO SUPERIOR */
.back-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #000;
  padding: 50px 0 0 0;
  margin-bottom: 10px;
  width: 100%;
}

.back-icon {
  font-size: 22px;
  margin-right: 8px;
  color: #000;
}

.back-text {
  font-size: 16px;
  font-weight: 500;
}

.back-container:hover {
  color: #555;
}

.back-container:hover .back-icon {
  color: #555;
}

/* Título da página */
.page-title {
  color: indigo;
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 30px 0;
  width: 100%;
  text-align: left;
}

/* Container dos Cards - CENTRALIZADO */
.cards-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 40px;
}

/* Card do Perfil - ESTILO CONSISTENTE */
.card-form {
  width: 480px;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Perfil Header */
.perfil-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 10px;
  text-align: left;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.perfil-foto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid indigo;
}

.perfil-nome {
  font-size: 22px;
  font-weight: bold;
  color: #000;
  text-align: left;
}

/* Informações */
.info-section {
  text-align: left;
}

.info-section h3 {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: left;
}

.info-text {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
}

/* RESPONSIVIDADE */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 220px;
    width: calc(100vw - 220px);
  }
  
  .content-area {
    padding: 0 30px;
  }
  
  .card-form {
    width: 100%;
    max-width: 480px;
  }
}

@media (max-width: 768px) {
  .perfil-page {
    flex-direction: column;
  }
  
  .main-content {
    width: 100%;
    margin-left: 0;
    height: auto;
    min-height: calc(100vh - 200px);
  }
  
  .content-area {
    height: auto;
    padding: 0 20px;
    min-height: auto;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .perfil-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .perfil-nome {
    text-align: center;
  }
  
  .card-form {
    padding: 20px;
    width: 100%;
  }
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
}
</style>