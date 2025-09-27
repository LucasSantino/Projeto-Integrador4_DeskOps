<template>
  <div class="main-container">
    <!-- Lado esquerdo -->
    <div class="sidebar">
      <img src="@/assets/logodeskops.png" alt="DeskOps Logo" class="logo" />
     
      <nav>
        <ul>
          <li>
            <button @click="goToChamados">Meus Chamados</button>
          </li>
          <li>
            <button @click="goToClientenewchamado">Criar Chamado</button>
          </li>
        </ul>
      </nav>
      <div class=usuario><p>USER</p>
    </div>
    
    </div>

    <!-- Lado direito -->
    <div class="content">
      <div class="content-box">
        <h2>Novo Chamado</h2>
    
       
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      selectedStatus: "Todos",
      searchQuery: "",
      tickets: [
        {
          id: "00004",
          title: "Projeto Epson",
          service: "Trocar lâmpada",
          client: "André Costa",
          technician: "Carlos Silva",
          status: "Aberto",
          statusClass: "status-open"
        },
        {
          id: "00001",
          title: "Impressora HP",
          service: "Trocar cartucho",
          client: "Aline Souza",
          technician: "Carlos Silva",
          status: "Em Atendimento",
          statusClass: "status-in-progress"
        }
      ],
      filteredTickets: [],
    };
  },
  methods: {
    filterTickets() {
      this.filteredTickets = this.tickets.filter(ticket => {
        const matchesStatus =
          this.selectedStatus === "Todos" || ticket.status === this.selectedStatus;
        const matchesSearch =
          ticket.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          ticket.client.toLowerCase().includes(this.searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
      });
    },
    editTicket(id) {
      console.log("Editar ticket com ID:", id);
      // Redirecionar para página de edição
      this.$router.push(`/edit-ticket/${id}`);
    },
    goToChamados() {
      this.$router.push('/clienteschamados');
    },
     goToClientenewchamado() {
      this.$router.push('/clientenewchamado');
    }
  },
  created() {
    this.filteredTickets = this.tickets; // Inicializa a lista de chamados filtrados
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Segoe UI', sans-serif;
}

.main-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  background-color: #181112;
  color: white;
  flex: 1;
  display: flex;
  flex-direction: column;   
  padding: 20px;
}

.logo {
  width: 300px;
  margin-bottom: 20px;
}

.app-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

nav li {
  margin-bottom: 10px;
}

button {
  background-color: #111;
  color: white;
  border: none;
  padding: 10px;
  width: 150px;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #333;
}

/* Lado direito */
.content {
  background-color: #f7f7f7;
  flex: 2;
  padding: 20px;
}

.content-box {
  max-width: 1000px;
  margin: 0 auto;
}

.content-box h2 {
  margin-bottom: 20px;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters select,
.filters input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.ticket-list {
  display: flex;
  flex-wrap: wrap;
}

.ticket-card {
  background-color: white;
  padding: 20px;
  margin: 10px;
  width: 250px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.status-open {
  color: red;
}

.status-in-progress {
  color: blue;
}

.status-closed {
  color: green;
}

.ticket-card button {
  margin-top: 10px;
  padding: 8px;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.ticket-card button:hover {
  background-color: #555;
}
</style>
