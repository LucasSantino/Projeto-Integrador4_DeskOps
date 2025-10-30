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
  String prioridadeFilter = 'Todas'; // NOVO: filtro de prioridade

  final List<Map<String, String>> chamados = [
    {
      'atualizadoData': '25/09/2025',
      'atualizadoHora': '14:30',
      'titulo':
          'Problema na Impressora muito grande que precisa de truncamento',
      'status': 'Aberto',
      'prioridade': 'Alta', // NOVO: campo prioridade
    },
    {
      'atualizadoData': '24/09/2025',
      'atualizadoHora': '10:15',
      'titulo': 'Falha no Sistema',
      'status': 'Em Andamento',
      'prioridade': 'Média', // NOVO: campo prioridade
    },
    {
      'atualizadoData': '22/09/2025',
      'atualizadoHora': '09:20',
      'titulo': 'Erro de Login',
      'status': 'Aguardando',
      'prioridade': 'Baixa', // NOVO: campo prioridade
    },
    {
      'atualizadoData': '20/09/2025',
      'atualizadoHora': '15:10',
      'titulo': 'Instalação de Software',
      'status': 'Concluido',
      'prioridade': 'Média', // NOVO: campo prioridade
    },
    {
      'atualizadoData': '19/09/2025',
      'atualizadoHora': '11:05',
      'titulo': 'Configuração de Rede',
      'status': 'Cancelado',
      'prioridade': 'Alta', // NOVO: campo prioridade
    },
    {
      'atualizadoData': '18/09/2025',
      'atualizadoHora': '08:30',
      'titulo': 'Problema com Impressora',
      'status': 'Em Andamento',
      'prioridade': 'Baixa', // NOVO: campo prioridade
    },
  ];

  String truncate(String text, [int maxLength = 25]) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength - 3)}...';
  }

  // Função para obter cor do status
  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'aberto':
        return Colors.green;
      case 'concluido':
        return Colors.green.shade300;
      case 'em andamento':
        return Colors.blue;
      case 'aguardando':
        return Colors.amber.shade700; // NOVO: amarelo escuro
      case 'cancelado':
        return Colors.red;
      default:
        return Colors.grey;
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

  int? hoveredRowIndex;

  @override
  Widget build(BuildContext context) {
    final filteredChamados =
        chamados.where((chamado) {
          final titulo = chamado['titulo'] ?? '';
          final status = chamado['status'] ?? '';
          final prioridade = chamado['prioridade'] ?? '';

          final matchesStatus =
              statusFilter == 'Todos' ||
              status.toLowerCase() == statusFilter.toLowerCase();
          final matchesPrioridade =
              prioridadeFilter == 'Todas' ||
              prioridade.toLowerCase() == prioridadeFilter.toLowerCase();
          final matchesSearch =
              searchController.text.isEmpty ||
              titulo.toLowerCase().contains(
                searchController.text.toLowerCase(),
              );

          return matchesStatus && matchesPrioridade && matchesSearch;
        }).toList();

    return MainLayout(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Meus Chamados',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Color.fromARGB(255, 46, 61, 163),
            ),
          ),
          const SizedBox(height: 20),

          // Filtros - ATUALIZADO: 3 filtros lado a lado
          Row(
            children: [
              // Filtro de Status
              Expanded(
                flex: 2,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(8),
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
                            child: Text(
                              status,
                              style: const TextStyle(fontSize: 14),
                            ),
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
              const SizedBox(width: 8),

              // NOVO: Filtro de Prioridade
              Expanded(
                flex: 2,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: DropdownButton<String>(
                    value: prioridadeFilter,
                    isExpanded: true,
                    underline: const SizedBox(),
                    dropdownColor: Colors.white,
                    items:
                        const ['Todas', 'Alta', 'Média', 'Baixa'].map((
                          prioridade,
                        ) {
                          return DropdownMenuItem(
                            value: prioridade,
                            child: Text(
                              prioridade,
                              style: const TextStyle(fontSize: 14),
                            ),
                          );
                        }).toList(),
                    onChanged: (value) {
                      setState(() {
                        prioridadeFilter = value!;
                      });
                    },
                  ),
                ),
              ),
              const SizedBox(width: 8),

              // Campo de Pesquisa
              Expanded(
                flex: 3,
                child: TextField(
                  controller: searchController,
                  decoration: InputDecoration(
                    hintText: 'Pesquisar...',
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 12,
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    isDense: true,
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
                  showCheckboxColumn: false,
                  columnSpacing: 20,
                  headingRowHeight: 40,
                  dataRowMinHeight: 80, // CORREÇÃO: substitui dataRowHeight
                  dataRowMaxHeight: 80, // CORREÇÃO: substitui dataRowHeight
                  columns: const [
                    DataColumn(
                      label: SizedBox(width: 70, child: Text('Atualizado')),
                    ),
                    DataColumn(label: Text('Título')),
                    DataColumn(label: Text('Status')),
                  ],
                  rows: List.generate(filteredChamados.length, (index) {
                    final chamado = filteredChamados[index];
                    final status = chamado['status'] ?? '';

                    final statusColor = _getStatusColor(status);
                    final statusIcon = _getStatusIcon(status);

                    return DataRow(
                      color: WidgetStateProperty.resolveWith<Color?>((states) {
                        if (hoveredRowIndex == index)
                          return Colors.grey.shade200;
                        return null;
                      }),
                      onSelectChanged: (selected) {
                        if (selected != null && selected) {
                          Navigator.pushNamed(context, '/chamado_detalhado');
                        }
                      },
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
                            style: const TextStyle(fontWeight: FontWeight.bold),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        // Coluna Status - ATUALIZADO: com cores e ícones corrigidos
                        DataCell(
                          Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Icon(statusIcon, color: statusColor, size: 20),
                                const SizedBox(height: 4),
                                Flexible(
                                  child: Text(
                                    status,
                                    style: TextStyle(
                                      color: statusColor,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
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
