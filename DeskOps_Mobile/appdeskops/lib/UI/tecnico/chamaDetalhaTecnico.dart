import 'dart:io';
import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';
import '../widgets/drawer_tecnico.dart';
import '../tecnico/chamadosTecnico.dart';

class ChamadoDetalhadoTecnico extends StatefulWidget {
  const ChamadoDetalhadoTecnico({super.key});

  @override
  State<ChamadoDetalhadoTecnico> createState() =>
      _ChamadoDetalhadoTecnicoState();
}

class _ChamadoDetalhadoTecnicoState extends State<ChamadoDetalhadoTecnico> {
  bool mostrarImagemFullscreen = false;
  String? imagemChamado;
  String status = "Aguardando"; // status inicial controlado pelo sistema

  // Função para obter cor baseada na prioridade
  Color _getPrioridadeColor(String prioridade) {
    switch (prioridade.toLowerCase()) {
      case 'alta':
        return Colors.red;
      case 'médio':
        return Colors.orange;
      case 'baixo':
        return Colors.green;
      default:
        return Colors.black54;
    }
  }

  // Função para obter cor de fundo baseada na prioridade
  Color _getPrioridadeBackgroundColor(String prioridade) {
    switch (prioridade.toLowerCase()) {
      case 'alta':
        return Colors.red.shade100;
      case 'médio':
        return Colors.orange.shade100;
      case 'baixo':
        return Colors.green.shade100;
      default:
        return Colors.grey.shade100;
    }
  }

  // Função para obter cor do status
  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'aberto':
        return Colors.green;
      case 'concluido':
        return Colors.green.shade300;
      case 'em andamento':
        return Colors.blue;
      case 'aguardando':
        return Colors.amber.shade700;
      case 'cancelado':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  // Função para obter cor de fundo do status
  Color _getStatusBackgroundColor(String status) {
    switch (status.toLowerCase()) {
      case 'aberto':
        return Colors.green.shade100;
      case 'concluido':
        return Colors.green.shade50;
      case 'em andamento':
        return Colors.blue.shade100;
      case 'aguardando':
        return Colors.yellow.shade100;
      case 'cancelado':
        return Colors.red.shade100;
      default:
        return Colors.grey.shade100;
    }
  }

  // Função para obter ícone do status
  IconData _getStatusIcon(String status) {
    switch (status.toLowerCase()) {
      case 'aberto':
        return Icons.error_outline;
      case 'concluido':
        return Icons.check_circle_outline;
      case 'em andamento':
        return Icons.autorenew;
      case 'aguardando':
        return Icons.hourglass_empty;
      case 'cancelado':
        return Icons.cancel_outlined;
      default:
        return Icons.help_outline;
    }
  }

  void atribuirChamado() {
    setState(() {
      status = "Em andamento";
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Chamado atribuído com sucesso!"),
        backgroundColor: Colors.green,
      ),
    );
  }

  void concluirChamado() {
    setState(() {
      status = "Concluido";
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Chamado marcado como concluído!"),
        backgroundColor: Colors.green,
      ),
    );
  }

  void reabrirChamado() {
    setState(() {
      status = "Em andamento";
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Chamado reaberto com sucesso!"),
        backgroundColor: Colors.blue,
      ),
    );
  }

  Future<void> confirmarConclusao() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder:
          (context) => AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            title: const Text(
              "Concluir Chamado",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.indigo,
              ),
            ),
            content: const Text(
              "Deseja realmente marcar este chamado como concluído?",
              style: TextStyle(color: Colors.black87),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text(
                  "Cancelar",
                  style: TextStyle(color: Colors.grey),
                ),
              ),
              ElevatedButton(
                onPressed: () => Navigator.pop(context, true),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF065f46),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  "Concluir",
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ],
          ),
    );

    if (confirm == true) {
      concluirChamado();
    }
  }

  @override
  Widget build(BuildContext context) {
    final int id = 123;
    final String titulo = "Problema na Impressora";
    final String descricao =
        "A impressora não está imprimindo corretamente e apresenta falha de hardware.";
    final String ambiente = "Sala de contabilidade";
    final String ativo =
        "Impressora HP Deskjet 1585"; // NOVO: informação do ativo
    final String prioridade = "Alta";
    final String criadoEm = "25/09/2025 14:30";
    final String atualizadoEm = "26/09/2025 10:15";
    final String cliente = "Lucas Santino";
    final String clienteEmail = "lucas.santino@email.com";
    final String tecnicoNome = "Carlos Silva";
    final String tecnicoEmail = "carlos.silva@email.com";

    return MainLayout(
      drawer: const DrawerTecnico(),
      child: Stack(
        children: [
          SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Botão voltar
                  GestureDetector(
                    onTap: () {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const MeusChamadosTecnico(),
                        ),
                      );
                    },
                    child: Row(
                      children: const [
                        Icon(Icons.arrow_back, color: Colors.black),
                        SizedBox(width: 4),
                        Text(
                          "Voltar",
                          style: TextStyle(fontSize: 16, color: Colors.black),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Título
                  const Text(
                    'Chamado Detalhado',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.indigo,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // BOTÕES DE AÇÃO - SUBSTITUINDO O ANTIGO SELETOR DE STATUS
                  if (status == "Aguardando") ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Atribuir Chamado",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            "Este chamado está aguardando atribuição",
                            style: TextStyle(
                              color: Colors.black54,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: atribuirChamado,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.black,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 12,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(6),
                                ),
                              ),
                              icon: const Icon(
                                Icons.person_add,
                                color: Colors.white,
                                size: 20,
                              ),
                              label: const Text(
                                "Atribuir para Mim",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Seção para chamado em andamento
                  if (status == "Em andamento") ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Gerenciar Chamado",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            "Chamado em andamento",
                            style: TextStyle(
                              color: Colors.black54,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Botão Concluir
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: confirmarConclusao,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color(0xFF065f46),
                                padding: const EdgeInsets.symmetric(
                                  vertical: 12,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(6),
                                ),
                              ),
                              icon: const Icon(
                                Icons.check_circle,
                                color: Colors.white,
                                size: 20,
                              ),
                              label: const Text(
                                "Marcar como Concluído",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Dropdown para alterar status - ATUALIZADO COM FUNDO BRANCO E BORDA CINZA
                          DropdownButtonFormField<String>(
                            value: status,
                            decoration: InputDecoration(
                              labelText: "Alterar Status",
                              labelStyle: const TextStyle(
                                color: Colors.black54,
                              ),
                              filled: true,
                              fillColor: Colors.white, // Fundo branco
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(6),
                                borderSide: BorderSide(
                                  color: Colors.grey.shade400,
                                ), // Borda cinza
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(6),
                                borderSide: BorderSide(
                                  color: Colors.grey.shade400,
                                ), // Borda cinza quando normal
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(6),
                                borderSide: const BorderSide(
                                  color: Colors.indigo,
                                ), // Borda roxa quando focado
                              ),
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 8,
                              ),
                            ),
                            dropdownColor:
                                Colors.white, // Fundo branco do dropdown
                            icon: const Icon(
                              Icons.arrow_drop_down,
                              color: Colors.black,
                            ),
                            style: const TextStyle(
                              color: Colors.black, // Texto preto
                              fontSize: 14,
                            ),
                            items:
                                [
                                      "Aguardando",
                                      "Em andamento",
                                      "Concluido",
                                      "Cancelado",
                                    ]
                                    .map(
                                      (status) => DropdownMenuItem(
                                        value: status,
                                        child: Text(
                                          status,
                                          style: const TextStyle(
                                            color: Colors.black,
                                          ),
                                        ),
                                      ),
                                    )
                                    .toList(),
                            onChanged: (novoStatus) {
                              if (novoStatus != null) {
                                if (novoStatus == "Concluido") {
                                  confirmarConclusao();
                                } else {
                                  setState(() {
                                    status = novoStatus;
                                  });
                                }
                              }
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Seção para chamado concluído
                  if (status == "Concluido") ...[
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Chamado Concluído",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            "Este chamado foi finalizado",
                            style: TextStyle(
                              color: Colors.black54,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: reabrirChamado,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color(0xFF856404),
                                padding: const EdgeInsets.symmetric(
                                  vertical: 12,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(6),
                                ),
                              ),
                              icon: const Icon(
                                Icons.refresh,
                                color: Colors.white,
                                size: 20,
                              ),
                              label: const Text(
                                "Reabrir Chamado",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Card Chamado (ATUALIZADO com campo Ativo)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // ID e Status
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "ID: $id",
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: _getStatusBackgroundColor(status),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    _getStatusIcon(status),
                                    color: _getStatusColor(status),
                                    size: 16,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    status,
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: _getStatusColor(status),
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),

                        Text(
                          titulo,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 12),

                        const Text(
                          "Descrição",
                          style: TextStyle(color: Colors.black54),
                        ),
                        Text(descricao),
                        const SizedBox(height: 12),

                        const Text(
                          "Ambiente",
                          style: TextStyle(color: Colors.black54),
                        ),
                        Text(ambiente),
                        const SizedBox(height: 12),

                        // NOVO: Campo Ativo adicionado
                        const Text(
                          "Ativo",
                          style: TextStyle(color: Colors.black54),
                        ),
                        Row(
                          children: [
                            Icon(
                              Icons.devices,
                              color: Colors.grey.shade600,
                              size: 16,
                            ),
                            const SizedBox(width: 8),
                            Text(ativo),
                          ],
                        ),
                        const SizedBox(height: 12),

                        const Text(
                          "Prioridade",
                          style: TextStyle(color: Colors.black54),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: _getPrioridadeBackgroundColor(prioridade),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.arrow_upward,
                                color: _getPrioridadeColor(prioridade),
                                size: 16,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                prioridade,
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: _getPrioridadeColor(prioridade),
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),

                        const Text(
                          "Imagem",
                          style: TextStyle(color: Colors.black54),
                        ),
                        if (imagemChamado != null) ...[
                          const SizedBox(height: 8),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                mostrarImagemFullscreen = true;
                              });
                            },
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.file(
                                File(imagemChamado!),
                                height: 120,
                                fit: BoxFit.cover,
                              ),
                            ),
                          ),
                        ] else
                          const Text(
                            "Nenhuma imagem anexada",
                            style: TextStyle(color: Colors.black54),
                          ),
                        const SizedBox(height: 12),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Criado em",
                                  style: TextStyle(color: Colors.black54),
                                ),
                                Text(criadoEm),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "Atualizado em",
                                  style: TextStyle(color: Colors.black54),
                                ),
                                Text(atualizadoEm),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),

                        const Text(
                          "Cliente",
                          style: TextStyle(color: Colors.black54),
                        ),
                        Text(cliente),
                        Text(clienteEmail),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Card Técnico
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Técnico Responsável",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(tecnicoNome),
                        Text(tecnicoEmail),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Overlay imagem fullscreen
          if (mostrarImagemFullscreen && imagemChamado != null)
            Positioned.fill(
              child: Container(
                color: const Color(0xE6000000),
                child: Stack(
                  children: [
                    Center(
                      child: Image.file(
                        File(imagemChamado!),
                        fit: BoxFit.contain,
                      ),
                    ),
                    Positioned(
                      top: 40,
                      right: 20,
                      child: IconButton(
                        icon: const Icon(
                          Icons.close,
                          color: Colors.white,
                          size: 32,
                        ),
                        onPressed: () {
                          setState(() {
                            mostrarImagemFullscreen = false;
                          });
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
