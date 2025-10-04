import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';

class Notificacao extends StatelessWidget {
  const Notificacao({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> notificacoes = [
      {
        'titulo': 'Chamado Atualizado',
        'descricao':
            'Seu chamado #123 foi atualizado pelo técnico responsável.',
        'data': '30/09/2025 14:30',
      },
      {
        'titulo': 'Novo Chamado Criado',
        'descricao': 'Você abriu um novo chamado #124 com sucesso.',
        'data': '29/09/2025 10:00',
      },
      {
        'titulo': 'Chamado Concluído',
        'descricao': 'O chamado #120 foi concluído e encerrado no sistema.',
        'data': '28/09/2025 09:15',
      },
      {
        'titulo': 'Nova Mensagem do Suporte',
        'descricao':
            'O suporte técnico enviou uma atualização no chamado #118.',
        'data': '27/09/2025 17:40',
      },
      {
        'titulo': 'Sistema Atualizado',
        'descricao': 'O aplicativo DeskOps foi atualizado para a versão 2.1.',
        'data': '25/09/2025 12:00',
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
            label: const Text("Voltar", style: TextStyle(color: Colors.black)),
          ),

          const SizedBox(height: 10),

          // Título
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 8.0),
            child: Text(
              'Notificações',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.indigo,
              ),
            ),
          ),

          const SizedBox(height: 18),

          // Lista de notificações
          Expanded(
            child: Container(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Colors.grey.shade300, width: 1),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.15),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ListView.separated(
                itemCount: notificacoes.length,
                separatorBuilder:
                    (context, index) => Divider(
                      color: Colors.grey.shade300,
                      thickness: 1,
                      height: 20,
                    ),
                itemBuilder: (context, index) {
                  final notif = notificacoes[index];
                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(vertical: 4),
                    leading: const Icon(
                      Icons.notifications,
                      color: Colors.indigo,
                    ),
                    title: Text(
                      notif['titulo']!,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 4),
                        Text(
                          notif['descricao']!,
                          style: const TextStyle(
                            color: Colors.black87,
                            height: 1.3,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          notif['data']!,
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
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
