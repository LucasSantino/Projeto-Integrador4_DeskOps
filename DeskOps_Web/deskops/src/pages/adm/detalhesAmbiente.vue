<template>
  <div class="detalhes-ambiente-page" @click="closeProfileMenu">
    <!-- Sidebar do Admin -->
    <adm-sidebar :usuario="usuario" />

    <!-- Conteúdo principal -->
    <main class="main-content">
      <div class="content-area">
        <!-- Botão Voltar -->
        <div class="back-container" @click="$router.push('/adm/gestao-ambientes')">
          <span class="material-icons back-icon">arrow_back</span>
          <span class="back-text">Voltar</span>
        </div>

        <!-- Título com botões de editar e excluir no canto direito -->
        <div class="title-container">
          <h1 class="page-title">Detalhes do Ambiente</h1>
          <div class="action-buttons-header">
            <button v-if="!editando" class="btn-editar" @click.stop="iniciarEdicao">
              <span class="material-icons">edit</span>
              Editar Ambiente
            </button>
            <button class="btn-excluir" @click.stop="excluirAmbiente">
              <span class="material-icons">delete</span>
              Excluir Ambiente
            </button>
          </div>
        </div>

        <div class="cards-container"> 
          <!-- Card do ambiente (MAIOR) -->
          <div class="card-form">
            <!-- Modo Visualização -->
            <div v-if="!editando" class="view-mode">
              <div class="header-info">
                <p class="ambiente-id">#{{ ambiente.id }}</p>
                <span class="criado-em">Criado em: {{ ambiente.criadoEm }}</span>
              </div>

              <h2 class="ambiente-nome">{{ ambiente.nome }}</h2>

              <div class="info-section">
                <h3>Descrição</h3>
                <p class="info-text">{{ ambiente.descricao }}</p>
              </div>

              <div class="info-section">
                <h3>Responsável</h3>
                <p class="info-text">{{ ambiente.responsavel.nome }}</p>
                <p class="info-text">{{ ambiente.responsavel.email }}</p>
              </div>

              <div class="date-info">
                <div class="date-container left">
                  <h3 class="date-title">Data de Criação</h3>
                  <p class="info-text date-text">{{ ambiente.criadoEm }}</p>
                </div>
                <div class="date-container right">
                  <h3 class="date-title">Última Atualização</h3>
                  <p class="info-text date-text">{{ ambiente.atualizadoEm }}</p>
                </div>
              </div>
            </div>

            <!-- Modo Edição -->
            <div v-else class="edit-mode">
              <div class="header-info">
                <p class="ambiente-id">#{{ ambiente.id }}</p>
                <span class="criado-em">Criado em: {{ ambiente.criadoEm }}</span>
              </div>

              <div class="form-section">
                <h3 class="section-title">Nome do Ambiente</h3>
                <input
                  type="text"
                  v-model="formEdit.nome"
                  placeholder="Digite o nome do ambiente"
                  class="form-input"
                />
              </div>

              <div class="form-section">
                <h3 class="section-title">Descrição</h3>
                <textarea
                  v-model="formEdit.descricao"
                  placeholder="Descreva o ambiente"
                  class="form-textarea"
                  rows="4"
                ></textarea>
              </div>

              <div class="form-section">
                <h3 class="section-title">Responsável</h3>
                <input
                  type="text"
                  v-model="formEdit.responsavel.nome"
                  placeholder="Digite o nome do responsável"
                  class="form-input"
                />
              </div>

              <div class="form-section">
                <h3 class="section-title">Email do Responsável</h3>
                <input
                  type="email"
                  v-model="formEdit.responsavel.email"
                  placeholder="Digite o email do responsável"
                  class="form-input"
                />
              </div>

              <div class="form-actions">
                <button class="btn-cancelar" @click="cancelarEdicao">
                  <span class="material-icons">close</span>
                  Cancelar
                </button>
                <button class="btn-salvar" @click="salvarEdicao">
                  <span class="material-icons">save</span>
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>

          <!-- Card de ações (MENOR) -->
          <div class="card-summary">
            <h2 class="card-title">Ações</h2>
            
            <!-- REMOVIDOS OS BOTÕES DE GERAR RELATÓRIO E VER ATIVOS -->
            
            <div class="info-rapida">
              <h3>Informações Rápidas</h3>
              <div class="info-item">
                <span class="info-label">ID:</span>
                <span class="info-value">{{ ambiente.id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Nome:</span>
                <span class="info-value">{{ ambiente.nome }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Responsável:</span>
                <span class="info-value">{{ ambiente.responsavel.nome }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ ambiente.responsavel.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Criado em:</span>
                <span class="info-value">{{ ambiente.criadoEm }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AdmSidebar from '@/components/layouts/admSidebar.vue'

interface Responsavel {
  nome: string
  email: string
}

interface Ambiente {
  id: number
  nome: string
  descricao: string
  responsavel: Responsavel
  criadoEm: string
  atualizadoEm: string
}

export default defineComponent({
  name: 'DetalhesAmbiente',
  components: {
    AdmSidebar
  },
  setup() {
    const router = useRouter()
    const editando = ref(false)
    const formEdit = reactive({
      nome: '',
      descricao: '',
      responsavel: {
        nome: '',
        email: ''
      }
    })

    const usuario = ref({
      nome: 'Administrador',
      email: 'admin@deskops.com',
      dataNascimento: '10/05/1980',
      cpf: '111.222.333-44',
      endereco: 'Av. Principal, 1000, São Paulo, SP',
      tipoUsuario: 'Administrador',
      foto: '', 
    })

    const ambiente = ref<Ambiente>({
      id: 2001,
      nome: 'Sala de Reuniões - Matriz',
      descricao: 'Sala de reuniões principal com capacidade para 20 pessoas, equipada com projetor e sistema de videoconferência.',
      responsavel: { 
        nome: 'Lucas Santino', 
        email: 'lucas@email.com' 
      },
      criadoEm: '11/10/2025 10:30',
      atualizadoEm: '11/10/2025 10:30'
    })

    const iniciarEdicao = () => {
      // Copia os dados atuais para o formulário de edição
      formEdit.nome = ambiente.value.nome
      formEdit.descricao = ambiente.value.descricao
      formEdit.responsavel = { ...ambiente.value.responsavel }
      editando.value = true
    }

    const cancelarEdicao = () => {
      editando.value = false
    }

    const salvarEdicao = () => {
      // Atualiza os dados do ambiente
      ambiente.value.nome = formEdit.nome
      ambiente.value.descricao = formEdit.descricao
      ambiente.value.responsavel = { ...formEdit.responsavel }
      ambiente.value.atualizadoEm = new Date().toLocaleString('pt-BR')
      
      editando.value = false
      alert('Alterações salvas com sucesso!')
    }

    const closeProfileMenu = () => {
      // Esta função será chamada no clique da página para fechar o menu de perfil
    }

    const excluirAmbiente = () => {
      if (confirm('Tem certeza que deseja excluir este ambiente? Esta ação não pode ser desfeita.')) {
        alert('Ambiente excluído com sucesso!')
        router.push('/adm/gestao-ambientes')
      }
    }

    return { 
      ambiente,
      usuario,
      editando,
      formEdit,
      closeProfileMenu,
      excluirAmbiente,
      iniciarEdicao,
      cancelarEdicao,
      salvarEdicao
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
.detalhes-ambiente-page {
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

/* Título com botões de editar e excluir no canto direito */
.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
}

.page-title {
  color: indigo;
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

.action-buttons-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Botão Editar */
.btn-editar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid indigo;
  background-color: transparent;
  color: indigo;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-editar:hover {
  background-color: indigo;
  color: white;
}

.btn-editar .material-icons {
  font-size: 18px;
  color: inherit;
}

/* Botão Excluir */
.btn-excluir {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #dc2626;
  background-color: transparent;
  color: #dc2626;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-excluir:hover {
  background-color: #dc2626;
  color: white;
}

.btn-excluir .material-icons {
  font-size: 18px;
  color: inherit;
}

/* Container dos Cards - ALTURAS ORIGINAIS */
.cards-container {
  display: flex;
  gap: 30px;
  width: 100%;
  margin-bottom: 40px;
  align-items: flex-start;
}

/* Card do ambiente - MAIOR (flex: 2) */
.card-form {
  flex: 2;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-height: 500px;
}

/* Card de ações - MENOR (flex: 1) */
.card-summary {
  flex: 1;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  height: fit-content;
  min-height: 400px;
}

/* Header do Card */
.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.ambiente-id {
  font-weight: bold;
  color: #000;
  font-size: 16px;
}

.criado-em {
  color: #666;
  font-size: 14px;
}

.ambiente-nome {
  font-size: 20px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
  text-align: left;
}

/* Seções de Informação - ESPAÇAMENTOS AUMENTADOS */
.info-section {
  text-align: left;
}

.info-section h3,
.date-title {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.info-text,
.date-text {
  color: #555;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.date-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
  margin-top: auto;
  padding-top: 20px;
}

.date-container {
  flex: 1;
}

.date-container.left {
  text-align: left;
}

.date-container.right {
  text-align: right;
}

/* ESTILOS DO MODO EDIÇÃO - COM ESPAÇAMENTOS AUMENTADOS */

/* Seções do Formulário - ESPAÇAMENTOS AUMENTADOS */
.form-section {
  text-align: left;
  margin-bottom: 25px;
}

.form-section:last-of-type {
  margin-bottom: 0;
}

.section-title {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: left;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 10px 0;
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
  min-height: 120px;
  padding: 12px 0;
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

/* Ações do Formulário */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 30px;
}

.btn-cancelar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #6b7280;
  background-color: transparent;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-cancelar:hover {
  background-color: #6b7280;
  color: white;
}

.btn-salvar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #059669;
  background-color: transparent;
  color: #059669;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-salvar:hover {
  background-color: #059669;
  color: white;
}

.btn-cancelar .material-icons,
.btn-salvar .material-icons {
  font-size: 18px;
  color: inherit;
}

/* Card Summary - Ações */
.card-title {
  color: #000;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 8px;
  width: 100%;
}

/* LINHA CINZA ADICIONADA ABAIXO DO TÍTULO AÇÕES */
.card-title {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
  margin-bottom: 20px;
}

/* Informações Rápidas - MOVIDA PARA MAIS PERTO DO TÍTULO */
.info-rapida {
  width: 100%;
  margin-top: 0;
}

.info-rapida h3 {
  color: #000;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-label {
  color: #666;
  font-size: 14px;
}

.info-value {
  color: #000;
  font-size: 14px;
  font-weight: 500;
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
  .detalhes-ambiente-page {
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
  
  .title-container {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .action-buttons-header {
    width: 100%;
    justify-content: flex-start;
  }
  
  .btn-editar,
  .btn-excluir {
    align-self: flex-start;
  }
  
  .date-info {
    flex-direction: column;
    gap: 15px;
  }
  
  .date-container.right {
    text-align: left;
  }
  
  .back-container {
    padding: 30px 0 0 0;
  }
  
  .form-actions {
    flex-direction: column;
  }
}

/* Estilos para telas muito grandes */
@media (min-width: 1600px) {
  .content-area {
    max-width: 1400px;
  }
}
</style>