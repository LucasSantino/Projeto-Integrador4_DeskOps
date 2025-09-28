import 'package:flutter/material.dart';
import '../widgets/mainlayout.dart';

class MeusChamados extends StatefulWidget {
  const MeusChamados({super.key});

  @override
  State<MeusChamados> createState() => _MeusChamadosState();
}

class _MeusChamadosState extends State<MeusChamados> {
  final TextEditingController searchController = TextEditingController();
  String statusFilter = 'Todos';

  final List<Map<String, String>> chamados = [
    {
      'atualizadoData': '25/09/2025',
      'atualizadoHora': '14:30',
      'titulo':
          'Problema na Impressora muito grande que precisa de truncamento...',
      'status': 'Aberto',
    },
    {
      'atualizadoData': '24/09/2025',
      'atualizadoHora': '10:15',
      'titulo': 'Falha no Sistema',
      'status': 'Em Andamento',
    },
    {
      'atualizadoData': '23/09/2025',
      'atualizadoHora': '16:50',
      'titulo': 'Manutenção de Rede',
      'status': 'Concluido',
    },
  ];

  // Função para limitar caracteres com "..."
  String truncate(String text, [int maxLength = 25]) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength - 3)}...';
  }

  @override
  Widget build(BuildContext context) {
    final filteredChamados =
        chamados.where((chamado) {
          final titulo = chamado['titulo'] ?? '';
          final status = chamado['status'] ?? '';

          final matchesStatus =
              statusFilter == 'Todos' ||
              status.toLowerCase() == statusFilter.toLowerCase();
          final matchesSearch =
              searchController.text.isEmpty ||
              titulo.toLowerCase().contains(
                searchController.text.toLowerCase(),
              );

          return matchesStatus && matchesSearch;
        }).toList();

    return MainLayout(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Meus Chamados',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),

          // Filtros
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: DropdownButton<String>(
                    value: statusFilter,
                    isExpanded: true,
                    underline: const SizedBox(),
                    items:
                        const [
                          'Todos',
                          'Aberto',
                          'Aguardando',
                          'Em Andamento',
                          'Concluido',
                          'Cancelado',
                        ].map((status) {
                          return DropdownMenuItem(
                            value: status,
                            child: Text(status),
                          );
                        }).toList(),
                    onChanged: (value) {
                      setState(() {
                        statusFilter = value!;
                      });
                    },
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: TextField(
                  controller: searchController,
                  decoration: InputDecoration(
                    hintText: 'Pesquisar pelo título',
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  onChanged: (value) {
                    setState(() {});
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Tabela
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: DataTable(
                  columnSpacing: 20,
                  headingRowHeight: 40,
                  dataRowHeight: 80,
                  columns: const [
                    DataColumn(
                      label: SizedBox(width: 80, child: Text('Atualizado')),
                    ),
                    DataColumn(label: Text('Título')),
                    DataColumn(label: Text('Status')),
                  ],
                  rows:
                      filteredChamados.map((chamado) {
                        Color statusColor = Colors.grey;
                        IconData statusIcon = Icons.help_outline;

                        switch ((chamado['status'] ?? '').toLowerCase()) {
                          case 'aberto':
                            statusColor = const Color.fromARGB(
                              255,
                              218,
                              217,
                              217,
                            );
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
                            statusColor = const Color.fromARGB(255, 255, 1, 1);
                            statusIcon = Icons.cancel_outlined;
                            break;
                        }

                        return DataRow(
                          cells: [
                            // Coluna Atualizado
                            DataCell(
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    chamado['atualizadoData'] ?? '',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  Text(
                                    chamado['atualizadoHora'] ?? '',
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),

                            // Coluna Título
                            DataCell(
                              Text(
                                truncate(chamado['titulo'] ?? ''),
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),

                            // Coluna Status
                            DataCell(
                              Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Icon(statusIcon, color: statusColor),
                                    const SizedBox(height: 4),
                                    Flexible(
                                      child: Text(
                                        chamado['status'] ?? '',
                                        style: TextStyle(color: statusColor),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        );
                      }).toList(),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
