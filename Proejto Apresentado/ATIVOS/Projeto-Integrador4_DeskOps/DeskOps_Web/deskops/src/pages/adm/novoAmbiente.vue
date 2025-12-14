<template>
  <div class="novo-ambiente-page" @click="closeProfileMenu">
    <!-- Sidebar do Admin -->
    <adm-sidebar />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
         <!-- Botão Voltar -->
        <div class="back-container" @click="$router.push('/adm/gestao-ambiente')">
          <span class="material-icons back-icon">arrow_back</span>
          <span class="back-text">Voltar</span>
        </div>
        <h1 class="page-title">Novo Ambiente</h1>
        <!-- Cards -->
        <div class="cards-container">
          <!-- Formulário -->
          <div class="card-form">
            <div class="card-header">
              <h2 class="card-title">Informações do Ambiente</h2>
              <p class="card-subtitle">Insira as informações abaixo para cadastrar um novo ambiente</p>
            </div>

            <div class="form-section">
              <h3 class="section-title">Nome do Ambiente</h3>
              <input
                type="text"
                v-model="nome"
                placeholder="Digite o nome do ambiente"
                class="form-input"
                maxlength="250"
              />
              <div class="char-counter">
                {{ nome.length }}/250 caracteres
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Descrição</h3>
              <textarea
                v-model="descricao"
                placeholder="Descreva as características e finalidade do ambiente"
                :maxlength="maxDescricaoChars"
                class="form-textarea"
              ></textarea>
              <div class="char-counter">
                {{ descricao.length }}/{{ maxDescricaoChars }} caracteres
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Funcionário Responsável</h3>
              <select v-model="funcionarioResponsavel" class="form-select">
                <option value="" disabled>Selecione o funcionário responsável</option>
                <option v-for="funcionario in funcionarios" :key="funcionario.id" :value="funcionario.id">
                  {{ funcionario.nome }} - {{ funcionario.email }}
                </option>
                <option value="">Nenhum responsável</option>
              </select>
            </div>
          </div>

          <!-- Card Resumo -->
          <div class="card-summary">
            <h2 class="summary-title">Resumo</h2>
            
            <div class="summary-section">
              <p class="summary-label">Nome do Ambiente</p>
              <p class="summary-value">{{ nome || 'Nenhum nome informado' }}</p>
            </div>

            <div class="summary-section">
              <p class="summary-label">Descrição</p>
              <p class="summary-value">{{ descricaoLimitada }}</p>
            </div>

            <div class="summary-section">
              <p class="summary-label">Funcionário Responsável</p>
              <p class="summary-value">{{ funcionarioResponsavelNome || 'Nenhum responsável' }}</p>
            </div>

            <div class="create-btn-container">
              <button class="create-btn" @click="submitAmbiente">Cadastrar Ambiente</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdmSidebar from '@/components/layouts/admSidebar.vue'
import { useAuthStore } from '@/stores/authStore'
import api from '@/services/api' // ✅ garante a conexão com o backend

interface Funcionario {
  id: number
  nome: string
  email: string
}

export default defineComponent({
  name: 'NovoAmbiente',
  components: { AdmSidebar },
  setup() {
    const router = useRouter()
    const auth = useAuthStore()

    const nome = ref('')
    const descricao = ref('')
    const funcionarioResponsavel = ref<number | string>('')
    const funcionarios = ref<Funcionario[]>([])
    const maxDescricaoChars = 400

    // ✅ Buscar lista de funcionários do backend
    const carregarFuncionarios = async () => {
      try {
        const token = auth.access
        const response = await api.get('/usuarios/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        // Adapta o formato para seu front
        funcionarios.value = response.data.map((f: any) => ({
          id: f.id,
          nome: f.name,
          email: f.email
        }))
      } catch (error: any) {
        console.error('❌ Erro ao carregar funcionários:', error)
        alert('Erro ao carregar lista de funcionários.')
      }
    }

    // Computeds para resumo
    const descricaoLimitada = computed(() => {
      if (!descricao.value) return 'Nenhuma descrição informada'
      return descricao.value.length > 100
        ? descricao.value.substring(0, 100) + '...'
        : descricao.value
    })

    const funcionarioResponsavelNome = computed(() => {
      if (!funcionarioResponsavel.value) return 'Nenhum responsável'
      const f = funcionarios.value.find(f => f.id === funcionarioResponsavel.value)
      return f ? `${f.nome} - ${f.email}` : 'Nenhum responsável'
    })

    const closeProfileMenu = () => {}

    // ✅ Enviar dados reais para a API
    const submitAmbiente = async () => {
      if (!nome.value.trim()) {
        alert('Por favor, informe o nome do ambiente.')
        return
      }
      if (!descricao.value.trim()) {
        alert('Por favor, informe a descrição do ambiente.')
        return
      }

      const token = auth.access
      if (!token) {
        alert('Sessão expirada. Faça login novamente.')
        router.push('/')
        return
      }

      const ambienteData = {
        name: nome.value.trim(),
        description: descricao.value.trim(),
        employee: funcionarioResponsavel.value || null // o ID do responsável
      }

      try {
        const response = await api.post('/environment/', ambienteData, {
          headers: { Authorization: `Bearer ${token}` }
        })

        console.log('✅ Ambiente cadastrado:', response.data)
        alert('✅ Ambiente cadastrado com sucesso!')

        // Limpa os campos
        nome.value = ''
        descricao.value = ''
        funcionarioResponsavel.value = ''

        // Redireciona de volta
        router.push('/adm/gestao-ambiente')
      } catch (error: any) {
        console.error('❌ Erro ao cadastrar ambiente:', error.response?.data || error)
        alert('Erro ao cadastrar ambiente. Verifique os dados e tente novamente.')
      }
    }

    // Carrega a lista de funcionários ao montar
    carregarFuncionarios()

    return {
      nome,
      descricao,
      funcionarioResponsavel,
      funcionarios,
      descricaoLimitada,
      funcionarioResponsavelNome,
      maxDescricaoChars,
      closeProfileMenu,
      submitAmbiente
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
.novo-ambiente-page {
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

.back-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #000;
  padding: 50px 0 0 0;
  margin-bottom: 0px;
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
  padding: 50px 0 25px 0;
  margin: 0;
  width: 100%;
  text-align: left;
}

/* Container dos Cards */
.cards-container {
  display: flex;
  gap: 30px;
  width: 100%;
  margin-bottom: 40px;
}

/* Card do Formulário - ESTILO IDÊNTICO À PÁGINA DE NOVO CHAMADO */
.card-form {
  flex: 2;
  background-color: #fff;
  padding: 0;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 550px;
}

.card-header {
  padding: 24px;
}

.card-title {
  color: #000;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
  text-align: left;
}

.card-subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
  text-align: left;
}

/* Seções do Formulário */
.form-section {
  padding: 20px 24px;
}

.section-title {
  color: #000;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: left;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 8px 0;
  border: none;
  border-bottom: 1px solid #ccc;
  background-color: transparent;
  color: #333;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  text-align: left;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-bottom-color: #000;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.form-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23333' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>");
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 8px 10px;
  appearance: none;
  padding-right: 20px;
}

.char-counter {
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: 8px;
}

/* Card Resumo */
.card-summary {
  flex: 1;
  background-color: #fff;
  padding: 24px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: fit-content;
  min-width: 300px;
  min-height: 400px;
}

.summary-title {
  color: #000;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}

.summary-section {
  margin-bottom: 16px;
}

.summary-section:last-of-type {
  margin-bottom: 24px;
}

.summary-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
  text-align: left;
}

.summary-value {
  color: #000;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  text-align: left;
}

/* Container do Botão Criar */
.create-btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  padding: 0 20px;
}

.create-btn {
  padding: 12px 60px;
  border: none;
  background-color: #000;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 300px;
}

.create-btn:hover {
  background-color: #333;
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
  
  .cards-container {
    flex-direction: column;
  }
  
  .card-form,
  .card-summary {
    flex: none;
    width: 100%;
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .novo-ambiente-page {
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
    padding: 30px 0 15px 0;
  }
  
  .cards-container {
    gap: 20px;
  }
  
  .card-form,
  .card-summary {
    padding: 0;
    min-height: auto;
  }
  
  .form-textarea {
    min-height: 100px;
  }
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
}
</style>