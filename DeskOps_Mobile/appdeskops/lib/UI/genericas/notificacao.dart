import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';

class Notificacao extends StatelessWidget {
  const Notificacao({super.key});

  @override
  Widget build(BuildContext context) {
    // Exemplo de notificações
    final List<Map<String, String>> notificacoes = [
      {
        'titulo': 'Chamado Atualizado',
        'descricao': 'Seu chamado #123 foi atualizado pelo técnico.',
        'data': '30/09/2025 14:30'
      },
      {
        'titulo': 'Novo Chamado',
        'descricao': 'Você criou um novo chamado #124.',
        'data': '29/09/2025 10:00'
      },
      {
        'titulo': 'Chamado Concluído',
        'descricao': 'O chamado #120 foi concluído.',
        'data': '28/09/2025 09:15'
      },
    ];

    return MainLayout(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Botão Voltar
          TextButton.icon(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: const Icon(Icons.arrow_back, color: Colors.black),
            label: const Text(
              "Voltar",
              style: TextStyle(color: Colors.black),
            ),
          ),

          const SizedBox(height: 10),

          // Título
          const Text(
            'Notificações',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Color(0xFF003366), // dark blue
            ),
          ),

          const SizedBox(height: 20),

          // Card das notificações
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.2),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: ListView.separated(
                itemCount: notificacoes.length,
                separatorBuilder: (context, index) => const Divider(),
                itemBuilder: (context, index) {
                  final notif = notificacoes[index];
                  return ListTile(
                    title: Text(
                      notif['titulo']!,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    subtitle: Text('${notif['descricao']!}\n${notif['data']!}'),
                    isThreeLine: true,
                    leading: const Icon(Icons.notifications, color: Colors.blue),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
