import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';
import 'meus_chamados.dart'; // importa a tela de origem

class ChamadoDetalhado extends StatefulWidget {
  const ChamadoDetalhado({super.key});

  @override
  State<ChamadoDetalhado> createState() => _ChamadoDetalhadoState();
}

class _ChamadoDetalhadoState extends State<ChamadoDetalhado> {
  bool mostrarImagemFullscreen = false;
  String? imagemChamado;

  @override
  Widget build(BuildContext context) {
    final int id = 123;
    final String titulo = "Problema na Impressora";
    final String descricao =
        "A impressora não está imprimindo corretamente e apresenta falha de hardware.";
    final String categoria = "Problema em Impressora";
    final String status = "Aberto";
    final String criadoEm = "25/09/2025 14:30";
    final String atualizadoEm = "26/09/2025 10:15";
    final String cliente = "Lucas Santino";
    final String clienteEmail = "lucas.santino@email.com";
    final String tecnicoNome = "Carlos Silva";
    final String tecnicoEmail = "carlos.silva@email.com";

    Color statusColor = Colors.grey;
    IconData statusIcon = Icons.help_outline;

    switch (status.toLowerCase()) {
      case 'aberto':
        statusColor = Colors.red;
        statusIcon = Icons.error_outline;
        break;
      case 'aguardando':
        statusColor = Colors.orange;
        statusIcon = Icons.hourglass_empty;
        break;
      case 'em andamento':
        statusColor = Colors.blue;
        statusIcon = Icons.autorenew;
        break;
      case 'concluido':
        statusColor = Colors.green;
        statusIcon = Icons.check_circle_outline;
        break;
      case 'cancelado':
        statusColor = Colors.grey;
        statusIcon = Icons.cancel_outlined;
        break;
    }

    return MainLayout(
      child: Stack(
        children: [
          SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Botão voltar
                GestureDetector(
                  onTap: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const MeusChamados()),
                    );
                  },
                  child: Row(
                    children: const [
                      Icon(Icons.arrow_back, color: Colors.black),
                      SizedBox(width: 4),
                      Text(
                        "Voltar",
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                const Text(
                  'Chamado detalhado',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
                const SizedBox(height: 16),

                // Botão Encerrar
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      "Encerrar",
                      style: TextStyle(color: Colors.white),
                    ),
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
                            fontSize: 18, fontWeight: FontWeight.bold),
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

                      const Text("Imagem",
                          style: TextStyle(color: Colors.black54)),
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
                            child: Image.network(
                              imagemChamado!,
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
                            fontSize: 16, fontWeight: FontWeight.bold),
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

          // Overlay imagem fullscreen
          if (mostrarImagemFullscreen && imagemChamado != null)
            Positioned.fill(
              child: Container(
                color: Colors.black.withOpacity(0.9),
                child: Stack(
                  children: [
                    Center(
                      child: Image.network(
                        imagemChamado!,
                        fit: BoxFit.contain,
                      ),
                    ),
                    Positioned(
                      top: 40,
                      right: 20,
                      child: IconButton(
                        icon: const Icon(Icons.close,
                            color: Colors.white, size: 32),
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
