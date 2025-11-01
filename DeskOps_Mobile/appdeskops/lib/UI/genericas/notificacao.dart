import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';

class Notificacao extends StatelessWidget {
  const Notificacao({super.key});

  @override
  Widget build(BuildContext context) {
    // Lista de notificações normalizada com o modelo Notificate
    final List<Map<String, dynamic>> notificacoes = [
      {
        'title': 'Chamado Atualizado',
        'description':
            'Seu chamado #123 foi atualizado pelo técnico responsável.',
        'dt_criacao': '2025-09-30 14:30:00',
        'author': 'Lucas Santino',
        'chamado_FK': '123',
      },
      {
        'title': 'Novo Chamado Criado',
        'description': 'Você abriu um novo chamado #124 com sucesso.',
        'dt_criacao': '2025-09-29 10:00:00',
        'author': 'Sistema',
        'chamado_FK': '124',
      },
      {
        'title': 'Chamado Concluído',
        'description': 'O chamado #120 foi concluído e encerrado no sistema.',
        'dt_criacao': '2025-09-28 09:15:00',
        'author': 'Carlos Silva',
        'chamado_FK': '120',
      },
      {
        'title': 'Nova Mensagem do Suporte',
        'description':
            'O suporte técnico enviou uma atualização no chamado #118.',
        'dt_criacao': '2025-09-27 17:40:00',
        'author': 'Suporte Técnico',
        'chamado_FK': '118',
      },
      {
        'title': 'Sistema Atualizado',
        'description': 'O aplicativo DeskOps foi atualizado para a versão 2.1.',
        'dt_criacao': '2025-09-25 12:00:00',
        'author': 'Sistema',
        'chamado_FK': null, // Notificação do sistema, sem chamado específico
      },
    ];

    // Função para formatar a data
    String _formatarData(String dataOriginal) {
      try {
        final parts = dataOriginal.split(' ');
        final dateParts = parts[0].split('-');
        final timeParts = parts[1].split(':');

        final dia = dateParts[2];
        final mes = dateParts[1];
        final ano = dateParts[0];
        final hora = timeParts[0];
        final minuto = timeParts[1];

        return '$dia/$mes/$ano $hora:$minuto';
      } catch (e) {
        return dataOriginal;
      }
    }

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
                    color: const Color(0x269E9E9E),
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
                    contentPadding: const EdgeInsets.symmetric(
                      vertical: 8,
                      horizontal: 4,
                    ),
                    leading: Stack(
                      children: [
                        Icon(
                          notif['chamado_FK'] != null
                              ? Icons.notifications
                              : Icons.system_update,
                          color: Colors.indigo,
                          size: 24,
                        ),
                        // Bolinha de notificação não lida
                        if (index <
                            2) // Apenas as primeiras 2 notificações como não lidas
                          Positioned(
                            right: 0,
                            top: 0,
                            child: Container(
                              width: 10,
                              height: 10,
                              decoration: const BoxDecoration(
                                color: Colors.red,
                                shape: BoxShape.circle,
                              ),
                            ),
                          ),
                      ],
                    ),
                    title: Text(
                      notif['title'] ?? '',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 6),
                        Text(
                          notif['description'] ?? '',
                          style: const TextStyle(
                            color: Colors.black87,
                            height: 1.3,
                          ),
                        ),
                        const SizedBox(height: 8),
                        // Data e badges - CORRIGIDO: layout vertical para evitar overflow
                        Text(
                          _formatarData(notif['dt_criacao'] ?? ''),
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade600,
                          ),
                        ),
                        const SizedBox(height: 6),
                        // Badges em Wrap para quebrar linha se necessário
                        Wrap(
                          spacing: 8,
                          runSpacing: 4,
                          children: [
                            if (notif['author'] != null)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade200,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  'por ${notif['author']}',
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: Colors.grey.shade700,
                                  ),
                                ),
                              ),
                            if (notif['chamado_FK'] != null)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.indigo.shade100,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  'Chamado #${notif['chamado_FK']}',
                                  style: const TextStyle(
                                    fontSize: 10,
                                    color: Colors.indigo,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                    onTap: () {
                      // Aqui você pode adicionar navegação para o chamado específico
                      if (notif['chamado_FK'] != null) {
                        // Navigator.pushNamed(context, '/chamado_detalhado', arguments: notif['chamado_FK']);
                      }
                    },
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
