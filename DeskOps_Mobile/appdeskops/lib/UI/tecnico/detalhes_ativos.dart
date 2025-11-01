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
  String? photo;

  // Função para obter cor do status
  Color _getStatusColor(String status) {
    switch (status) {
      case 'ATIVO':
        return Colors.green;
      case 'EM_MANUTENCAO':
        return Colors.orange;
      case 'DESATIVADO':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  // Função para obter cor de fundo do status
  Color _getStatusBackgroundColor(String status) {
    switch (status) {
      case 'ATIVO':
        return Colors.green.shade100;
      case 'EM_MANUTENCAO':
        return Colors.orange.shade100;
      case 'DESATIVADO':
        return Colors.red.shade100;
      default:
        return Colors.grey.shade100;
    }
  }

  // Função para obter ícone do status
  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'ATIVO':
        return Icons.check_circle_outline;
      case 'EM_MANUTENCAO':
        return Icons.build_circle_outlined;
      case 'DESATIVADO':
        return Icons.cancel_outlined;
      default:
        return Icons.help_outline;
    }
  }

  // Função para formatar o nome do status para exibição
  String _formatStatus(String status) {
    switch (status) {
      case 'ATIVO':
        return 'Ativo';
      case 'EM_MANUTENCAO':
        return 'Em Manutenção';
      case 'DESATIVADO':
        return 'Desativado';
      default:
        return status;
    }
  }

  @override
  Widget build(BuildContext context) {
    // Dados normalizados seguindo o modelo Ativo
    final int id = 101;
    final String name = "Ar Condicionado Central";
    final String description =
        "Manutenção preventiva realizada, verificado compressor, sistema elétrico e filtros. Observações técnicas anotadas.";
    final String status = "ATIVO"; // Usando os valores do enum status_ativos
    final String qrCode = "QR123456789"; // Adicionando QR Code
    final DateTime dtCriacao = DateTime(2025, 10, 1, 9, 0);
    final DateTime updateDate = DateTime(2025, 10, 5, 15, 30);

    // Dados do Environment (ambiente)
    final String environmentName = "Escritório Central";
    final String environmentDescription =
        "Ambiente climatizado para trabalho em equipe";

    // Dados do Employee (responsável)
    final String employeeName = "Carlos Silva";
    final String employeeEmail = "carlos.silva@email.com";
    final String employeeCargo = "Técnico de Manutenção";

    // Formatando datas para exibição
    final String criadoEm =
        "${dtCriacao.day.toString().padLeft(2, '0')}/${dtCriacao.month.toString().padLeft(2, '0')}/${dtCriacao.year} ${dtCriacao.hour.toString().padLeft(2, '0')}:${dtCriacao.minute.toString().padLeft(2, '0')}";
    final String atualizadoEm =
        "${updateDate.day.toString().padLeft(2, '0')}/${updateDate.month.toString().padLeft(2, '0')}/${updateDate.year} ${updateDate.hour.toString().padLeft(2, '0')}:${updateDate.minute.toString().padLeft(2, '0')}";

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
                          // Status com Stack - seguindo padrão dos chamados
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
                                  _formatStatus(status),
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
                        name,
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
                      Text(description),
                      const SizedBox(height: 12),

                      // Ambiente
                      const Text(
                        "Ambiente",
                        style: TextStyle(color: Colors.black54),
                      ),
                      Text(environmentName),
                      const SizedBox(height: 8),
                      const Text(
                        "Descrição do Ambiente",
                        style: TextStyle(color: Colors.black54),
                      ),
                      Text(environmentDescription),
                      const SizedBox(height: 12),

                      // QR Code
                      const Text(
                        "QR Code",
                        style: TextStyle(color: Colors.black54),
                      ),
                      Text(qrCode),
                      const SizedBox(height: 12),

                      const Text(
                        "Imagem",
                        style: TextStyle(color: Colors.black54),
                      ),
                      if (photo != null) ...[
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
                              File(photo!),
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

                      // Responsável pelo Ambiente
                      const Text(
                        "Responsável pelo Ambiente",
                        style: TextStyle(color: Colors.black54),
                      ),
                      Text(employeeName),
                      Text(employeeEmail),
                      Text(employeeCargo),
                      const SizedBox(height: 12),

                      // Datas
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
          if (mostrarImagemFullscreen && photo != null)
            Positioned.fill(
              child: Container(
                color: const Color(0xE6000000),
                child: Stack(
                  children: [
                    Center(
                      child: Image.file(File(photo!), fit: BoxFit.contain),
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
