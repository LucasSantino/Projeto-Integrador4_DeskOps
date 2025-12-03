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
        return Colors.amber.shade700;
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
    // Usando MediaQuery para detectar tamanho da tela
    final screenWidth = MediaQuery.of(context).size.width;
    
    // Definindo breakpoints para diferentes tamanhos de tela
    final bool isTablet = screenWidth >= 600; // Tablet a partir de 600px
    final bool isLargeTablet = screenWidth >= 900; // Tablets grandes
    final bool isDesktop = screenWidth >= 1200; // Desktop
    
    // Ajustes baseados no tamanho da tela
    final double titleFontSize = isLargeTablet ? 28 : (isTablet ? 26 : 24);
    final double columnSpacing = isLargeTablet ? 40 : (isTablet ? 30 : 20);
    final double headingRowHeight = isTablet ? 50 : 40;
    final double dataRowHeight = isTablet ? 90 : 80;
    final double statusIconSize = isTablet ? 24 : 20;
    final double statusFontSize = isTablet ? 14 : 12;
    final double filterFontSize = isTablet ? 16 : 14;
    final double searchPadding = isTablet ? 16 : 12;
    
    // Configuração de truncamento baseada no tamanho da tela
    final int titleMaxLength = isDesktop ? 50 : (isLargeTablet ? 40 : (isTablet ? 35 : 25));

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
      drawer: const DrawerTecnico(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Lista de Chamados',
            style: TextStyle(
              fontSize: titleFontSize,
              fontWeight: FontWeight.bold,
              color: const Color.fromARGB(255, 46, 61, 163),
            ),
          ),
          const SizedBox(height: 20),

          // Filtros - ATUALIZADO: 3 filtros lado a lado com responsividade
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
                              style: TextStyle(fontSize: filterFontSize),
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
                              style: TextStyle(fontSize: filterFontSize),
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
                    contentPadding: EdgeInsets.symmetric(
                      horizontal: searchPadding,
                      vertical: searchPadding,
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

          // Tabela de chamados - ATUALIZADA para responsividade
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey.shade300),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: SingleChildScrollView(
                  scrollDirection: isTablet ? Axis.vertical : Axis.horizontal,
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      minWidth: isTablet ? screenWidth * 0.9 : screenWidth,
                    ),
                    child: DataTable(
                      showCheckboxColumn: false,
                      columnSpacing: columnSpacing,
                      headingRowHeight: headingRowHeight,
                      dataRowMinHeight: dataRowHeight,
                      dataRowMaxHeight: dataRowHeight,
                      columns: [
                        DataColumn(
                          label: SizedBox(
                            width: isTablet ? 100 : 70,
                            child: Text(
                              'Atualizado',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: isTablet ? 16 : 14,
                              ),
                            ),
                          ),
                        ),
                        DataColumn(
                          label: Text(
                            'Título',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: isTablet ? 16 : 14,
                            ),
                          ),
                        ),
                        if (isTablet) // Adiciona coluna de prioridade apenas em tablets
                          DataColumn(
                            label: Text(
                              'Prioridade',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: isTablet ? 16 : 14,
                              ),
                            ),
                          ),
                        DataColumn(
                          label: Text(
                            'Status',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: isTablet ? 16 : 14,
                            ),
                          ),
                        ),
                      ],
                      rows: List.generate(filteredChamados.length, (index) {
                        final chamado = filteredChamados[index];
                        final status = chamado['status'] ?? '';
                        final prioridade = chamado['prioridade'] ?? '';

                        final statusColor = _getStatusColor(status);
                        final statusIcon = _getStatusIcon(status);

                        // Função para obter cor da prioridade
                        Color _getPrioridadeColor(String prioridade) {
                          switch (prioridade.toLowerCase()) {
                            case 'alta':
                              return Colors.red;
                            case 'média':
                              return Colors.orange;
                            case 'baixa':
                              return Colors.green;
                            default:
                              return Colors.grey;
                          }
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
                            // Coluna Atualizado
                            DataCell(
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    chamado['atualizadoData'] ?? '',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: isTablet ? 15 : 14,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  Text(
                                    chamado['atualizadoHora'] ?? '',
                                    style: TextStyle(
                                      fontSize: isTablet ? 14 : 13,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                            // Coluna Título
                            DataCell(
                              Container(
                                constraints: BoxConstraints(
                                  maxWidth: isDesktop ? 400 : (isLargeTablet ? 300 : (isTablet ? 250 : 200)),
                                ),
                                child: Text(
                                  truncate(chamado['titulo'] ?? '', titleMaxLength),
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: isTablet ? 15 : 14,
                                  ),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ),
                            // Coluna Prioridade (apenas em tablets)
                            if (isTablet)
                              DataCell(
                                Center(
                                  child: Container(
                                    padding: EdgeInsets.symmetric(
                                      horizontal: isLargeTablet ? 12 : 8,
                                      vertical: isLargeTablet ? 6 : 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: _getPrioridadeColor(prioridade).withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(
                                        color: _getPrioridadeColor(prioridade),
                                        width: 1,
                                      ),
                                    ),
                                    child: Text(
                                      prioridade,
                                      style: TextStyle(
                                        color: _getPrioridadeColor(prioridade),
                                        fontWeight: FontWeight.bold,
                                        fontSize: statusFontSize,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            // Coluna Status
                            DataCell(
                              Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Icon(
                                      statusIcon,
                                      color: statusColor,
                                      size: statusIconSize,
                                    ),
                                    const SizedBox(height: 4),
                                    Flexible(
                                      child: Text(
                                        status,
                                        style: TextStyle(
                                          color: statusColor,
                                          fontWeight: FontWeight.bold,
                                          fontSize: statusFontSize,
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
            ),
          ),
        ],
      ),
    );
  }
}