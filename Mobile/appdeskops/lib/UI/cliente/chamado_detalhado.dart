import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';

class ChamadoDetalhado extends StatelessWidget {
  const ChamadoDetalhado({super.key});

  @override
  Widget build(BuildContext context) {
    // Dados de exemplo do chamado
    final int id = 123;
    final String titulo = "Problema na Impressora";
    final String descricao =
        "A impressora não está imprimindo corretamente e apresenta falha de hardware.";
    final String categoria = "Problema em Impressora";
    final String status = "Aberto"; // Pode ser "Em Andamento", "Concluido", etc.
    final String criadoEm = "25/09/2025 14:30";
    final String atualizadoEm = "26/09/2025 10:15";
    final String cliente = "Lucas Santino";
    final String tecnicoNome = "Carlos Silva";
    final String tecnicoEmail = "carlos.silva@email.com";
    final String? imagemChamado =
        null; // coloque o caminho ou URL da imagem aqui se existir

    // Definir cor e ícone do status dinamicamente
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
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
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

                  // Título do chamado
                  Text(
                    titulo,
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),

                  // Descrição
                  const Text(
                    "Descrição",
                    style: TextStyle(color: Colors.black54),
                  ),
                  Text(descricao),
                  const SizedBox(height: 12),

                  // Categoria
                  const Text(
                    "Categoria",
                    style: TextStyle(color: Colors.black54),
                  ),
                  Text(categoria),
                  const SizedBox(height: 12),

                  // Imagem (se existir)
                  const Text("Imagem", style: TextStyle(color: Colors.black54)),
                  if (imagemChamado != null) ...[
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        imagemChamado,
                        height: 120,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ] else
                    const Text(
                      "Nenhuma imagem anexada",
                      style: TextStyle(color: Colors.black54),
                    ),
                  const SizedBox(height: 12),

                  // Criado e Atualizado
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

                  // Cliente
                  const Text(
                    "Cliente",
                    style: TextStyle(color: Colors.black54),
                  ),
                  Text(cliente),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Card Técnico Responsável
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
    );
  }
}
