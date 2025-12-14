import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';
import '../widgets/drawer_tecnico.dart';
import '../../../api/services/chamado_service.dart'; // Importar o serviço
import '../../../api/models/chamado_model.dart'; // Importar o modelo

class ListaChamados extends StatefulWidget {
  const ListaChamados({super.key});

  @override
  State<ListaChamados> createState() => _ListaChamadosState();
}

class _ListaChamadosState extends State<ListaChamados> {
  final TextEditingController searchController = TextEditingController();
  String statusFilter = 'Todos';
  String prioridadeFilter = 'Todas'; // NOVO: filtro de prioridade

  // Substituir a lista estática por uma lista dinâmica
  List<Chamado> _chamados = [];
  List<Chamado> _filteredChamados = [];
  bool _isLoading = true;
  String _errorMessage = '';

  final ChamadoService _chamadoService = ChamadoService();

  @override
  void initState() {
    super.initState();
    print('🚀 Inicializando Lista de Chamados (Técnico)...');
    _carregarChamados();
  }

  Future<void> _carregarChamados() async {
    print('📥 Carregando todos os chamados (técnico)...');
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      // Carregar todos os chamados (técnico vê todos)
      final chamados = await _chamadoService.getChamados();
      print('✅ ${chamados.length} chamados carregados com sucesso!');

      setState(() {
        _chamados = chamados;
        _filteredChamados = chamados;
        _isLoading = false;
      });

      // Log para debug
      for (var chamado in chamados) {
        print('📄 Chamado ID: ${chamado.id}');
        print('   Título: ${chamado.title}');
        print('   Status: ${chamado.status}');
        print('   Prioridade: ${chamado.prioridade}');
        print('   Criador: ${chamado.creator.name}');
        if (chamado.employee != null) {
          print('   Técnico: ${chamado.employee!.name}');
        }
        print('   Atualizado: ${chamado.updateDate}');
        print('---');
      }
    } catch (e) {
      print('❌ Erro ao carregar chamados: $e');
      setState(() {
        _isLoading = false;
        _errorMessage = 'Erro ao carregar chamados: $e';
      });
    }
  }

  void _aplicarFiltros() {
    print('🔍 Aplicando filtros...');
    print('   Status: $statusFilter');
    print('   Prioridade: $prioridadeFilter');
    print('   Busca: ${searchController.text}');

    List<Chamado> resultado = _chamados;

    // Filtro de status
    if (statusFilter != 'Todos') {
      resultado =
          resultado.where((chamado) {
            final statusTexto = _traduzirStatus(chamado.status.toString());
            return statusTexto == statusFilter;
          }).toList();
    }

    // Filtro de prioridade
    if (prioridadeFilter != 'Todas') {
      resultado =
          resultado.where((chamado) {
            final prioridadeTexto = _traduzirPrioridade(
              chamado.prioridade.toString(),
            );
            return prioridadeTexto == prioridadeFilter;
          }).toList();
    }

    // Filtro de busca
    if (searchController.text.isNotEmpty) {
      resultado =
          resultado.where((chamado) {
            final titulo = chamado.title.toLowerCase();
            final busca = searchController.text.toLowerCase();
            return titulo.contains(busca);
          }).toList();
    }

    setState(() {
      _filteredChamados = resultado;
      print('✅ Filtrados: ${_filteredChamados.length} chamados');
    });
  }

  String truncate(String text, [int maxLength = 25]) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength - 3)}...';
  }

  // Função para traduzir status
  String _traduzirStatus(String statusEnum) {
    final statusStr = statusEnum.toString().split('.').last;

    switch (statusStr) {
      case 'AGUARDANDO_ATENDIMENTO':
        return 'Aguardando';
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'CONCLUIDO':
        return 'Concluído';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return statusStr;
    }
  }

  // Função para traduzir prioridade
  String _traduzirPrioridade(String prioridadeEnum) {
    final prioridadeStr = prioridadeEnum.toString().split('.').last;

    switch (prioridadeStr) {
      case 'ALTA':
        return 'Alta';
      case 'MEDIA':
        return 'Média';
      case 'BAIXA':
        return 'Baixa';
      default:
        return prioridadeStr;
    }
  }

  // Função para obter cor do status
  Color _getStatusColor(String statusEnum) {
    final status = statusEnum.toString().split('.').last;

    switch (status) {
      case 'AGUARDANDO_ATENDIMENTO':
        return Colors.orange;
      case 'EM_ANDAMENTO':
        return Colors.blue;
      case 'CONCLUIDO':
        return Colors.green;
      case 'CANCELADO':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  // Função para obter ícone do status
  IconData _getStatusIcon(String statusEnum) {
    final status = statusEnum.toString().split('.').last;

    switch (status) {
      case 'AGUARDANDO_ATENDIMENTO':
        return Icons.hourglass_empty;
      case 'EM_ANDAMENTO':
        return Icons.autorenew;
      case 'CONCLUIDO':
        return Icons.check_circle_outline;
      case 'CANCELADO':
        return Icons.cancel_outlined;
      default:
        return Icons.help_outline;
    }
  }

  // Função para obter cor da prioridade
  Color _getPrioridadeColor(String prioridadeEnum) {
    final prioridade = prioridadeEnum.toString().split('.').last;

    switch (prioridade) {
      case 'ALTA':
        return Colors.red;
      case 'MEDIA':
        return Colors.orange;
      case 'BAIXA':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  // Formatar data
  String _formatarData(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  // Formatar hora
  String _formatarHora(DateTime date) {
    return '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }

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
    final int titleMaxLength =
        isDesktop ? 50 : (isLargeTablet ? 40 : (isTablet ? 35 : 25));

    // Aplicar filtros sempre que os filtros mudarem
    _aplicarFiltros();

    return MainLayout(
      drawer: const DrawerTecnico(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Título com botão de atualizar
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Lista de Chamados',
                  style: TextStyle(
                    fontSize: titleFontSize,
                    fontWeight: FontWeight.bold,
                    color: const Color.fromARGB(255, 46, 61, 163),
                  ),
                ),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.indigo,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: IconButton(
                    onPressed: _carregarChamados,
                    icon: const Icon(
                      Icons.refresh,
                      color: Colors.white,
                      size: 20,
                    ),
                    tooltip: 'Atualizar lista',
                  ),
                ),
              ],
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
                            'Aguardando',
                            'Em Andamento',
                            'Concluído',
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

            // Exibir loading, erro ou tabela
            if (_isLoading)
              const Center(child: CircularProgressIndicator())
            else if (_errorMessage.isNotEmpty)
              Center(
                child: Text(
                  _errorMessage,
                  style: const TextStyle(color: Colors.red),
                ),
              )
            else
              // Tabela de chamados - ATUALIZADA para responsividade
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey.shade300),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.vertical,
                    child: SingleChildScrollView(
                      scrollDirection:
                          isTablet ? Axis.vertical : Axis.horizontal,
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
                          rows: List.generate(_filteredChamados.length, (
                            index,
                          ) {
                            final chamado = _filteredChamados[index];
                            final statusTexto = _traduzirStatus(
                              chamado.status.toString(),
                            );
                            final prioridadeTexto = _traduzirPrioridade(
                              chamado.prioridade.toString(),
                            );

                            final statusColor = _getStatusColor(
                              chamado.status.toString(),
                            );
                            final statusIcon = _getStatusIcon(
                              chamado.status.toString(),
                            );

                            return DataRow(
                              onSelectChanged: (selected) {
                                if (selected != null && selected) {
                                  Navigator.pushNamed(
                                    context,
                                    '/chamado_detalhado_Tecnico',
                                    arguments: chamado.id,
                                  );
                                }
                              },
                              cells: [
                                // Coluna Atualizado
                                DataCell(
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        _formatarData(chamado.updateDate),
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: isTablet ? 15 : 14,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      Text(
                                        _formatarHora(chamado.updateDate),
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
                                      maxWidth:
                                          isDesktop
                                              ? 400
                                              : (isLargeTablet
                                                  ? 300
                                                  : (isTablet ? 250 : 200)),
                                    ),
                                    child: Text(
                                      truncate(chamado.title, titleMaxLength),
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
                                          color: _getPrioridadeColor(
                                            chamado.prioridade.toString(),
                                          ).withOpacity(0.1),
                                          borderRadius: BorderRadius.circular(
                                            20,
                                          ),
                                          border: Border.all(
                                            color: _getPrioridadeColor(
                                              chamado.prioridade.toString(),
                                            ),
                                            width: 1,
                                          ),
                                        ),
                                        child: Text(
                                          prioridadeTexto,
                                          style: TextStyle(
                                            color: _getPrioridadeColor(
                                              chamado.prioridade.toString(),
                                            ),
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
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      children: [
                                        Icon(
                                          statusIcon,
                                          color: statusColor,
                                          size: statusIconSize,
                                        ),
                                        const SizedBox(height: 4),
                                        Flexible(
                                          child: Text(
                                            statusTexto,
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
      ),
    );
  }
}
