import 'dart:io';
import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';
import 'meus_chamados.dart'; // tela de origem
import 'editar_chamado.dart'; // NOVO: importar a tela de edição

class ChamadoDetalhado extends StatefulWidget {
  const ChamadoDetalhado({super.key});

  @override
  State<ChamadoDetalhado> createState() => _ChamadoDetalhadoState();
}

class _ChamadoDetalhadoState extends State<ChamadoDetalhado> {
  bool mostrarImagemFullscreen = false;
  String? imagemChamado;

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
        return Colors.green.shade300; // verde claro
      case 'em andamento':
        return Colors.blue;
      case 'aguardando':
        return Colors.yellow;
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
        return Colors.green.shade50; // verde bem claro
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

  @override
  Widget build(BuildContext context) {
    final int id = 123;
    final String titulo = "Problema na Impressora";
    final String descricao =
        "A impressora não está imprimindo corretamente e apresenta falha de hardware.";
    final String ambiente = "Sala de Reunião";
    final String prioridade = "Alta";
    final String status = "Aberto";
    final String criadoEm = "25/09/2025 14:30";
    final String atualizadoEm = "26/09/2025 10:15";
    final String cliente = "Lucas Santino";
    final String clienteEmail = "lucas.santino@email.com";
    final String tecnicoNome = "Carlos Silva";
    final String tecnicoEmail = "carlos.silva@email.com";

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
                        builder: (context) => const MeusChamados(),
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

                // Título com botão editar
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Chamado detalhado',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.indigo,
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () {
                        // CORREÇÃO: Usando MaterialPageRoute com todos os parâmetros
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder:
                                (context) => EditarChamado(
                                  tituloInicial: titulo,
                                  descricaoInicial: descricao,
                                  categoriaInicial: ambiente,
                                  prioridadeInicial:
                                      prioridade, // NOVO: passando a prioridade
                                  imagemInicial:
                                      imagemChamado != null
                                          ? File(imagemChamado!)
                                          : null,
                                ),
                          ),
                        );
                      },
                      icon: const Icon(Icons.edit, color: Colors.indigo),
                      label: const Text(
                        'Editar',
                        style: TextStyle(color: Colors.indigo),
                      ),
                    ),
                  ],
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
                      "Encerrar chamado",
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
                          // Status com Stack
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: _getStatusBackgroundColor(status),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Stack(
                              children: [
                                Row(
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

                      // Ambiente
                      const Text(
                        "Ambiente",
                        style: TextStyle(color: Colors.black54),
                      ),
                      Text(ambiente),
                      const SizedBox(height: 12),

                      // Prioridade com Stack
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
                        child: Stack(
                          children: [
                            Row(
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
