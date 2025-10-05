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

  void atualizarStatus(String novoStatus) {
    setState(() {
      status = novoStatus;
    });
  }

  Future<void> confirmarEncerramento() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder:
          (context) => AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            title: const Text(
              "Encerrar Chamado",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.indigo,
              ),
            ),
            content: const Text(
              "Deseja realmente encerrar este chamado? Essa ação marcará o chamado como concluído.",
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
                  backgroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  "Encerrar",
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ],
          ),
    );

    if (confirm == true) {
      atualizarStatus("Concluído");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Chamado marcado como concluído com sucesso!"),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final int id = 123;
    final String titulo = "Problema na Impressora";
    final String descricao =
        "A impressora não está imprimindo corretamente e apresenta falha de hardware.";
    final String categoria = "Problema em Impressora";
    final String criadoEm = "25/09/2025 14:30";
    final String atualizadoEm = "26/09/2025 10:15";
    final String cliente = "Lucas Santino";
    final String clienteEmail = "lucas.santino@email.com";
    final String tecnicoNome = "Carlos Silva";
    final String tecnicoEmail = "carlos.silva@email.com";

    // Cores e ícones de status
    Color statusColor = Colors.grey;
    IconData statusIcon = Icons.help_outline;

    switch (status.toLowerCase()) {
      case 'aguardando':
        statusColor = Colors.orange;
        statusIcon = Icons.hourglass_empty;
        break;
      case 'em andamento':
        statusColor = Colors.blue;
        statusIcon = Icons.autorenew;
        break;
      case 'concluído':
        statusColor = Colors.green;
        statusIcon = Icons.check_circle_outline;
        break;
    }

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

                  // Alterar Status (exceto aguardando)
                  if (status != "Concluído")
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            "Atualizar Status:",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          DropdownButton<String>(
                            value: status == "Aguardando" ? null : status,
                            hint: const Text("Selecione"),
                            underline: const SizedBox(),
                            items:
                                ["Em andamento", "Concluído"]
                                    .map(
                                      (s) => DropdownMenuItem(
                                        value: s,
                                        child: Text(s),
                                      ),
                                    )
                                    .toList(),
                            onChanged: (novoStatus) {
                              if (novoStatus != null) {
                                if (novoStatus == "Concluído") {
                                  confirmarEncerramento();
                                } else {
                                  atualizarStatus(novoStatus);
                                }
                              }
                            },
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 20),

                  // Card Chamado
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
                            Row(
                              children: [
                                Icon(statusIcon, color: statusColor),
                                const SizedBox(width: 4),
                                Text(
                                  status,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: statusColor,
                                  ),
                                ),
                              ],
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
                          "Categoria",
                          style: TextStyle(color: Colors.black54),
                        ),
                        Text(categoria),
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
                color: Colors.black.withOpacity(0.9),
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
