import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';
import '../widgets/drawer_tecnico.dart';

class ListaChamados extends StatefulWidget {
  const ListaChamados({super.key});

  @override
  State<ListaChamados> createState() => _ListaChamadosState();
}

class _ListaChamadosState extends State<ListaChamados> {
  final TextEditingController searchController = TextEditingController();
  String statusFilter = 'Todos';

  final List<Map<String, String>> chamados = [
    {
      'atualizadoData': '25/09/2025',
      'atualizadoHora': '14:30',
      'titulo':
          'Problema na Impressora muito grande que precisa de truncamento',
      'status': 'Aberto',
    },
    {
      'atualizadoData': '24/09/2025',
      'atualizadoHora': '10:15',
      'titulo': 'Falha no Sistema',
      'status': 'Em Andamento',
    },
    {
      'atualizadoData': '22/09/2025',
      'atualizadoHora': '09:20',
      'titulo': 'Erro de Login',
      'status': 'Aguardando',
    },
    {
      'atualizadoData': '20/09/2025',
      'atualizadoHora': '15:10',
      'titulo': 'Instalação de Software',
      'status': 'Concluido',
    },
    {
      'atualizadoData': '19/09/2025',
      'atualizadoHora': '11:05',
      'titulo': 'Configuração de Rede',
      'status': 'Cancelado',
    },
    {
      'atualizadoData': '18/09/2025',
      'atualizadoHora': '08:30',
      'titulo': 'Problema com Impressora',
      'status': 'Em Andamento',
    },
  ];

  String truncate(String text, [int maxLength = 25]) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength - 3)}...';
  }

  int? hoveredRowIndex;

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
      drawer: const DrawerTecnico(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Lista de Chamados',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Color.fromARGB(255, 46, 61, 163),
            ),
          ),
          const SizedBox(height: 20),

          // Filtros e pesquisa
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
                    dropdownColor: Colors.white,
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
                    hintText: 'Pesquisar...',
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

          // Tabela de chamados - CORRIGIDO
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: DataTable(
                  showCheckboxColumn: false,
                  columnSpacing: 20,
                  headingRowHeight: 40,
                  dataRowMinHeight: 80, // CORREÇÃO
                  dataRowMaxHeight: 80, // CORREÇÃO
                  columns: const [
                    DataColumn(
                      label: SizedBox(width: 70, child: Text('Atualizado')),
                    ),
                    DataColumn(label: Text('Título')),
                    DataColumn(label: Text('Status')),
                  ],
                  rows: List.generate(filteredChamados.length, (index) {
                    final chamado = filteredChamados[index];

                    Color statusColor = Colors.grey;
                    IconData statusIcon = Icons.help_outline;

                    switch ((chamado['status'] ?? '').toLowerCase()) {
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

                    return DataRow(
                      color: WidgetStateProperty.resolveWith<Color?>((states) {
                        if (hoveredRowIndex == index)
                          return Colors.grey.shade200;
                        return null;
                      }),
                      onSelectChanged: (selected) {
                        if (selected != null && selected) {
                          Navigator.pushNamed(
                            context,
                            '/chamado_detalhado_Tecnico',
                          );
                        }
                      },
                      cells: [
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
                        DataCell(
                          Text(
                            truncate(chamado['titulo'] ?? ''),
                            style: const TextStyle(fontWeight: FontWeight.bold),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
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
                  }),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
