import 'dart:io';
import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';
import '../widgets/drawer_tecnico.dart';

class DetalhesAtivos extends StatefulWidget {
  const DetalhesAtivos({super.key});

  @override
  State<DetalhesAtivos> createState() => _DetalhesAtivosState();
}

class _DetalhesAtivosState extends State<DetalhesAtivos> {
  bool mostrarImagemFullscreen = false;
  String? imagemAtivo;

  @override
  Widget build(BuildContext context) {
    final int id = 101;
    final String nomeAtivo = "Ar Condicionado Central";
    final String descricao =
        "Manutenção preventiva realizada, verificado compressor, sistema elétrico e filtros. Observações técnicas anotadas.";
    final String categoria = "Ambiente: Escritório Central";
    final String status = "Ativo";
    final String criadoEm = "01/10/2025 09:00";
    final String atualizadoEm = "05/10/2025 15:30";
    final String responsavel = "Equipe de Manutenção";

    Color statusColor = Colors.grey;
    IconData statusIcon = Icons.help_outline;

    switch (status.toLowerCase()) {
      case 'ativo':
        statusColor = Colors.green;
        statusIcon = Icons.check_circle_outline;
        break;
      case 'inativo':
        statusColor = Colors.red;
        statusIcon = Icons.cancel_outlined;
        break;
      case 'manutenção':
        statusColor = Colors.orange;
        statusIcon = Icons.build_circle_outlined;
        break;
    }

    return MainLayout(
      drawer: const DrawerTecnico(),
      child: Stack(
        children: [
          SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Botão voltar
                GestureDetector(
                  onTap: () {
                    Navigator.pop(context);
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
                  'Detalhes do Ativo',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
                const SizedBox(height: 20),

                // Card Ativo
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
                        nomeAtivo,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),

                      const Text(
                        "Descrição Técnica",
                        style: TextStyle(color: Colors.black54),
                      ),
                      Text(descricao),
                      const SizedBox(height: 12),

                      const Text(
                        "Categoria / Ambiente",
                        style: TextStyle(color: Colors.black54),
                      ),
                      Text(categoria),
                      const SizedBox(height: 12),

                      const Text(
                        "Imagem",
                        style: TextStyle(color: Colors.black54),
                      ),
                      if (imagemAtivo != null) ...[
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
                              File(imagemAtivo!),
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

                      const Text(
                        "Responsável",
                        style: TextStyle(color: Colors.black54),
                      ),
                      Text(responsavel),
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
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Overlay imagem fullscreen
          if (mostrarImagemFullscreen && imagemAtivo != null)
            Positioned.fill(
              child: Container(
                color: Colors.black.withOpacity(0.9),
                child: Stack(
                  children: [
                    Center(
                      child: Image.file(
                        File(imagemAtivo!),
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
