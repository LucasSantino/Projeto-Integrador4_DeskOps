<template>
  <div class="editar-chamado-page">
    <!-- Sidebar como componente -->
    <cliente-sidebar />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <!-- Botão Voltar -->
        <div class="back-container" @click="$router.push('/cliente/chamado-detalhado')">
          <span class="material-icons back-icon">arrow_back</span>
          <span class="back-text">Voltar</span>
        </div>

        <h1 class="page-title">Edição de Chamado</h1>

        <!-- Cards -->
        <div class="cards-container">
          <!-- Formulário -->
          <div class="card-form">
            <div class="card-header">
              <h2 class="card-title">Informações</h2>
              <p class="card-subtitle">Atualize as informações abaixo do chamado</p>
            </div>

            <div class="form-section">
              <h3 class="section-title">Título</h3>
              <input
                type="text"
                v-model="titulo"
                placeholder="Digite o título do chamado"
                class="form-input"
              />
            </div>

            <div class="form-section">
              <h3 class="section-title">Descrição</h3>
              <textarea
                v-model="descricao"
                placeholder="Descreva o que está acontecendo"
                :maxlength="maxDescricaoChars"
                class="form-textarea"
              ></textarea>
              <div class="char-counter">
                {{ descricao.length }}/{{ maxDescricaoChars }} caracteres
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-title">Ambiente</h3>
              <select v-model="categoria" class="form-select">
                <option value="" disabled>Selecione o Ambiente</option>
                <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <!-- Seletor de Prioridade Adicionado -->
            <div class="form-section">
              <h3 class="section-title">Prioridade</h3>
              <select v-model="prioridade" class="form-select">
                <option value="" disabled>Selecione a prioridade</option>
                <option v-for="prioridadeOption in prioridades" :key="prioridadeOption.value" :value="prioridadeOption.value">
                  {{ prioridadeOption.label }}
                </option>
              </select>
            </div>

            <div class="form-section file-section">
              <h3 class="section-title">Anexar imagem</h3>
              <div class="file-upload">
                <label class="file-label">
                  <input type="file" @change="onFileChange" class="file-input" />
                  <span class="file-button">Escolher arquivo</span>
                  <span class="file-text">Nenhum arquivo escolhido</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Card Resumo -->
          <div class="card-summary">
            <h2 class="summary-title">Resumo</h2>
            
            <div class="summary-section">
              <p class="summary-label">Título do chamado</p>
              <p class="summary-value">{{ titulo || 'Nenhum título' }}</p>
            </div>

            <div class="summary-section">
              <p class="summary-label">Descrição</p>
              <p class="summary-value">{{ descricao || 'Nenhuma descrição' }}</p>
            </div>

            <div class="summary-section">
              <p class="summary-label">Categoria do Serviço</p>
              <p class="summary-value">{{ categoria || 'Nenhuma selecionada' }}</p>
            </div>

            <!-- Prioridade no Resumo Adicionada -->
            <div class="summary-section">
              <p class="summary-label">Prioridade</p>
              <p class="summary-value">
                <span :class="['prioridade-badge', prioridadeClass(prioridade)]" v-if="prioridade">
                  <span class="material-icons prioridade-icon">{{ prioridadeIcon(prioridade) }}</span>
                  {{ formatarPrioridade(prioridade) }}
                </span>
                <span v-else>Nenhuma selecionada</span>
              </p>
            </div>

            <div class="summary-section">
              <p class="summary-label">Imagem</p>
              <p class="summary-value">Nenhuma imagem selecionada</p>
            </div>

            <div class="save-btn-container">
              <button class="save-btn" @click="salvarChamado">Salvar Alterações</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ClienteSidebar from '@/components/layouts/clienteSidebar.vue'
import api from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

export default defineComponent({
  name: 'EditarChamado',
  components: { ClienteSidebar },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const auth = useAuthStore()

    // ✅ Campos do chamado
    const titulo = ref('')
    const descricao = ref('')
    const categoria = ref('')
    const prioridade = ref('')
    const imagemURL = ref<string | null>(null)
    const imagem = ref<File | null>(null)

    // ✅ Opções fixas
    const categorias = ref(['Manutenção', 'Suporte', 'Instalação', 'Rede', 'Software', 'Hardware'])
    const prioridades = ref([
      { value: 'alta', label: 'Alta' },
      { value: 'media', label: 'Média' },
      { value: 'baixa', label: 'Baixa' },
    ])

    const maxDescricaoChars = 2830

    // ✅ Carregar dados do chamado
    const carregarChamado = async () => {
      try {
        const id = route.params.id
        const token = auth.access

        if (!token) {
          alert('Sessão expirada. Faça login novamente.')
          router.push('/')
          return
        }

        const response = await api.get(`/chamados/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = response.data
        titulo.value = data.title
        descricao.value = data.description
        categoria.value = data.environment || ''
        prioridade.value = data.prioridade?.toLowerCase() || ''
        imagemURL.value = data.photo || null
      } catch (error: any) {
        console.error('❌ Erro ao carregar chamado:', error.response?.data || error)
        alert('Erro ao carregar informações do chamado.')
      }
    }

    onMounted(() => carregarChamado())

    // ✅ Atualizar chamado
    const salvarChamado = async () => {
      try {
        const id = route.params.id
        const token = auth.access

        if (!token) {
          alert('Sessão expirada. Faça login novamente.')
          router.push('/')
          return
        }

        const formData = new FormData()
        formData.append('title', titulo.value)
        formData.append('description', descricao.value)
        formData.append('prioridade', prioridade.value.toUpperCase())

        // 🔹 Categoria (verifica se é ID ou nome)
        if (!isNaN(Number(categoria.value))) {
          formData.append('environment', categoria.value)
        } else {
          formData.append('environment', categoria.value)
        }

        if (imagem.value) {
          formData.append('photo', imagem.value)
        }

        const response = await api.patch(`/chamados/${id}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })

        console.log('✅ Chamado atualizado:', response.data)
        alert('Chamado atualizado com sucesso!')
        router.push(`/cliente/chamado/${id}`)
      } catch (error: any) {
        console.error('❌ Erro ao atualizar chamado:', error.response?.data || error)
        alert('Erro ao salvar alterações. Verifique os dados e tente novamente.')
      }
    }

    // ✅ Upload de imagem
    const onFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files && target.files[0]) {
        imagem.value = target.files[0]
        imagemURL.value = URL.createObjectURL(target.files[0])
      }
    }

    // ✅ Funções auxiliares de prioridade
    const prioridadeClass = (prioridade: string) => {
      switch (prioridade.toLowerCase()) {
        case 'alta': return 'prioridade-alta'
        case 'media': return 'prioridade-media'
        case 'baixa': return 'prioridade-baixa'
        default: return ''
      }
    }

    const prioridadeIcon = (prioridade: string) => {
      switch (prioridade.toLowerCase()) {
        case 'alta': return 'arrow_upward'
        case 'media': return 'remove'
        case 'baixa': return 'arrow_downward'
        default: return ''
      }
    }

    const formatarPrioridade = (prioridade: string) => {
      switch (prioridade.toLowerCase()) {
        case 'alta': return 'Alta'
        case 'media': return 'Média'
        case 'baixa': return 'Baixa'
        default: return prioridade
      }
    }

    return {
      titulo,
      descricao,
      categoria,
      prioridade,
      imagemURL,
      categorias,
      prioridades,
      salvarChamado,
      onFileChange,
      maxDescricaoChars,
      prioridadeClass,
      prioridadeIcon,
      formatarPrioridade,
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
.editar-chamado-page {
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
  padding: 40px 0 0 0; /* REDUZIDO de 50px para 40px */
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
  margin: 0 0 25px 0; /* REDUZIDO de 30px para 25px */
  width: 100%;
  text-align: left;
}

/* Container dos Cards */
.cards-container {
  display: flex;
  gap: 30px;
  width: 100%;
  margin-bottom: 30px; /* REDUZIDO de 40px para 30px */
  max-height: calc(100vh - 200px); /* ADICIONADO para limitar altura máxima */
  overflow: hidden;
}

/* Card do Formulário - ESTILO EXATO DA IMAGEM */
.card-form {
  flex: 2;
  background-color: #fff;
  padding: 0;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 100%; /* ADICIONADO para limitar altura */
  overflow-y: auto; /* ADICIONADO para scroll interno se necessário */
}

/* REMOVIDA A UNDERLINE DO CARD HEADER */
.card-header {
  padding: 20px 24px; /* REDUZIDO padding vertical de 24px para 20px */
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

/* Seções do Formulário - ESTILO EXATO DA IMAGEM */
.form-section {
  padding: 16px 24px; /* REDUZIDO de 20px para 16px */
}

/* REDUZIDA A ALTURA DO TEXTAREA */
.form-textarea {
  min-height: 100px; /* REDUZIDO de 150px para 100px */
}

.section-title {
  color: #000;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px; /* REDUZIDO de 12px para 10px */
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
  font-family: inherit;
  max-height: 200px; /* ADICIONADO para limitar altura máxima */
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
  margin-top: 6px; /* REDUZIDO de 8px para 6px */
}

/* ADICIONADA UNDERLINE NA SEÇÃO DE IMAGEM */
.file-section {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px; /* REDUZIDO de 20px para 16px */
}

/* Upload de Arquivo - ESTILO EXATO DA IMAGEM */
.file-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.file-input {
  display: none;
}

.file-button {
  padding: 8px 16px;
  background-color: #555;
  border: none;
  border-bottom: 1px solid #ccc;
  border-radius: 0;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
}

.file-button:hover {
  background-color: #666;
}

.file-text {
  font-size: 14px;
  color: #666;
}

/* Card Resumo - ESTILO EXATO DA IMAGEM */
.card-summary {
  flex: 1;
  background-color: #fff;
  padding: 20px; /* REDUZIDO de 24px para 20px */
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: fit-content;
  min-width: 300px;
  max-height: 100%; /* ADICIONADO para limitar altura */
}

.summary-title {
  color: #000;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px; /* REDUZIDO de 20px para 16px */
  padding-bottom: 10px; /* REDUZIDO de 12px para 10px */
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}

.summary-section {
  margin-bottom: 14px; /* REDUZIDO de 16px para 14px */
}

.summary-section:last-of-type {
  margin-bottom: 20px; /* REDUZIDO de 24px para 20px */
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

/* Badge de Prioridade no Resumo */
.prioridade-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.prioridade-icon {
  font-size: 16px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

/* CORES DAS PRIORIDADES */
.prioridade-alta {
  background-color: #f8d7da;
  color: #842029;
}

.prioridade-media {
  background-color: #fff3cd;
  color: #856404;
}

.prioridade-baixa {
  background-color: #d1fae5;
  color: #065f46;
}

/* Container do Botão Salvar - MAIOR E CENTRALIZADO */
.save-btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  padding: 0 10px;
}

.save-btn {
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
  max-width: 280px;
}

.save-btn:hover {
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
    max-height: none; /* REMOVIDO em telas menores */
  }
  
  .card-form,
  .card-summary {
    flex: none;
    width: 100%;
    max-height: none; /* REMOVIDO em telas menores */
  }
  
  .card-summary {
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .editar-chamado-page {
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
  
  .cards-container {
    gap: 20px;
  }
  
  .card-form,
  .card-summary {
    padding: 0;
  }
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
}
</style>