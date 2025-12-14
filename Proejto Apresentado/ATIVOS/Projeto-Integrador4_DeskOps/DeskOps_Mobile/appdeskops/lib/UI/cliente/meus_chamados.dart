import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'dart:async';
import '../widgets/mainlayout.dart';
import '../../../api/services/chamado_service.dart';
import '../../../api/models/chamado_model.dart';

class MeusChamados extends StatefulWidget {
  const MeusChamados({super.key});

  @override
  State<MeusChamados> createState() => _MeusChamadosState();
}

class _MeusChamadosState extends State<MeusChamados> {
  final TextEditingController searchController = TextEditingController();
  String statusFilter = 'Todos';
  String prioridadeFilter = 'Todas';

  // Substituir lista estática por dados dinâmicos
  List<Chamado> _chamados = [];
  List<Chamado> _filteredChamados = [];
  bool _isLoading = true;
  String _errorMessage = '';

  final ChamadoService _chamadoService = ChamadoService();

  // Timer para debounce na pesquisa
  Timer? _debounceTimer;

  @override
  void initState() {
    super.initState();
    print('🚀 Inicializando Meus Chamados...');
    _carregarChamados();
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    searchController.dispose();
    super.dispose();
  }

  Future<void> _carregarChamados() async {
    print('📥 Carregando chamados do usuário...');
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      // Carregar os chamados do usuário atual
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

    // Filtro de busca (com debounce)
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

  void _onSearchChanged(String value) {
    // Cancelar timer anterior
    _debounceTimer?.cancel();

    // Iniciar novo timer (300ms de debounce)
    _debounceTimer = Timer(const Duration(milliseconds: 300), () {
      _aplicarFiltros();
    });
  }

  String truncate(String text, [int maxLength = 35]) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength - 3)}...';
  }

  // Função para traduzir status do enum para texto exibido
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

  // Função para traduzir prioridade do enum para texto exibido
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

  // Função para formatar data e hora
  String _formatarData(DateTime date) {
    return DateFormat('dd/MM/yyyy').format(date);
  }

  String _formatarHora(DateTime date) {
    return DateFormat('HH:mm').format(date);
  }

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_isLoading)
              _buildLoadingState()
            else if (_errorMessage.isNotEmpty)
              _buildErrorState()
            else
              _buildContent(context),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingState() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(),
          SizedBox(height: 20),
          Text('Carregando chamados...', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, color: Colors.red, size: 60),
          const SizedBox(height: 20),
          Text(
            _errorMessage,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.red),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: _carregarChamados,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.indigo,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text(
              'Tentar novamente',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContent(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    // Detectar tipo de dispositivo
    final bool isMobile = screenWidth < 600;
    final bool isTablet = screenWidth >= 600 && screenWidth < 900;

    // Ajustar dimensões baseadas no dispositivo
    final double tableHeight =
        isMobile ? screenHeight * 0.5 : screenHeight * 0.6;
    final double titleColumnWidth = isMobile ? 80 : 90; // Reduzido
    final double titleCellWidth = isMobile ? 150 : (isTablet ? 200 : 250);
    final double priorityColumnWidth = isMobile ? 80 : 90;
    final double statusColumnWidth = isMobile ? 100 : 110;
    final double columnSpacing = isMobile ? 8 : 12; // Reduzido espaçamento
    final double headingFontSize = isMobile ? 12 : (isTablet ? 13 : 14);
    final double cellFontSize = isMobile ? 11 : (isTablet ? 12 : 14);
    final double statusIconSize = isMobile ? 16 : 18;
    final int titleMaxLength = isMobile ? 25 : (isTablet ? 35 : 40);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Título com botão de atualizar ao lado
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Meus Chamados',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color.fromARGB(255, 46, 61, 163),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: Colors.indigo,
                borderRadius: BorderRadius.circular(8),
              ),
              child: IconButton(
                onPressed: _carregarChamados,
                icon: const Icon(Icons.refresh, color: Colors.white, size: 20),
                tooltip: 'Atualizar lista',
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // Filtros
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
                            style: TextStyle(fontSize: isMobile ? 12 : 14),
                          ),
                        );
                      }).toList(),
                  onChanged: (value) {
                    setState(() {
                      statusFilter = value!;
                      _aplicarFiltros();
                    });
                  },
                ),
              ),
            ),
            const SizedBox(width: 8),

            // Filtro de Prioridade
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
                            style: TextStyle(fontSize: isMobile ? 12 : 14),
                          ),
                        );
                      }).toList(),
                  onChanged: (value) {
                    setState(() {
                      prioridadeFilter = value!;
                      _aplicarFiltros();
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
                    horizontal: 12,
                    vertical: isMobile ? 10 : 12,
                  ),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: Colors.grey.shade400),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: Colors.grey.shade400),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Colors.indigo),
                  ),
                  isDense: true,
                ),
                onChanged: _onSearchChanged,
              ),
            ),
          ],
        ),

        const SizedBox(height: 20),

        // Contador de resultados
        if (_filteredChamados.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Text(
              '${_filteredChamados.length} chamado${_filteredChamados.length != 1 ? 's' : ''} encontrado${_filteredChamados.length != 1 ? 's' : ''}',
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: isMobile ? 12 : 14,
              ),
            ),
          ),

        // Tabela de chamados - RESPONSIVA
        Container(
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey.shade300),
            borderRadius: BorderRadius.circular(12),
          ),
          child:
              _filteredChamados.isEmpty
                  ? Container(
                    padding: const EdgeInsets.all(40),
                    height: 200,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.inbox_outlined,
                          size: 60,
                          color: Colors.grey,
                        ),
                        const SizedBox(height: 20),
                        const Text(
                          'Nenhum chamado encontrado',
                          style: TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          statusFilter != 'Todos' ||
                                  prioridadeFilter != 'Todas' ||
                                  searchController.text.isNotEmpty
                              ? 'Tente ajustar os filtros'
                              : 'Você ainda não possui chamados',
                          textAlign: TextAlign.center,
                          style: const TextStyle(color: Colors.grey),
                        ),
                      ],
                    ),
                  )
                  : SizedBox(
                    height: tableHeight,
                    child: SingleChildScrollView(
                      scrollDirection: Axis.vertical,
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: DataTable(
                          showCheckboxColumn: false,
                          columnSpacing: columnSpacing, // Espaçamento reduzido
                          headingRowHeight: 50,
                          dataRowMinHeight: 60,
                          dataRowMaxHeight: 80,
                          columns: [
                            DataColumn(
                              label: SizedBox(
                                width:
                                    titleColumnWidth, // Coluna de data/hora mais estreita
                                child: Text(
                                  'Atualizado',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: headingFontSize,
                                  ),
                                ),
                              ),
                            ),
                            DataColumn(
                              label: SizedBox(
                                width: titleCellWidth,
                                child: Text(
                                  'Título',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: headingFontSize,
                                  ),
                                ),
                              ),
                            ),
                            DataColumn(
                              label: SizedBox(
                                width: priorityColumnWidth,
                                child: Text(
                                  'Prioridade',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: headingFontSize,
                                  ),
                                ),
                              ),
                            ),
                            DataColumn(
                              label: SizedBox(
                                width: statusColumnWidth,
                                child: Text(
                                  'Status',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: headingFontSize,
                                  ),
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

                            // Função para obter cor da prioridade
                            Color _getPrioridadeColor(String prioridadeEnum) {
                              final prioridade =
                                  prioridadeEnum.toString().split('.').last;
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

                            return DataRow(
                              onSelectChanged: (selected) {
                                if (selected != null && selected) {
                                  Navigator.pushNamed(
                                    context,
                                    '/chamado_detalhado',
                                    arguments: chamado.id,
                                  );
                                }
                              },
                              cells: [
                                // Coluna Atualizado - Mais compacta
                                DataCell(
                                  Container(
                                    width: titleColumnWidth,
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          _formatarData(chamado.updateDate),
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: cellFontSize,
                                          ),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        Text(
                                          _formatarHora(chamado.updateDate),
                                          style: TextStyle(
                                            fontSize: cellFontSize - 1,
                                          ),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                // Coluna Título
                                DataCell(
                                  SizedBox(
                                    width: titleCellWidth,
                                    child: Tooltip(
                                      message: chamado.title,
                                      child: Text(
                                        truncate(chamado.title, titleMaxLength),
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: cellFontSize,
                                        ),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                  ),
                                ),
                                // Coluna Prioridade
                                DataCell(
                                  Center(
                                    child: Container(
                                      padding: EdgeInsets.symmetric(
                                        horizontal: isMobile ? 8 : 10,
                                        vertical: isMobile ? 3 : 4,
                                      ),
                                      decoration: BoxDecoration(
                                        color: _getPrioridadeColor(
                                          chamado.prioridade.toString(),
                                        ).withAlpha(25),
                                        borderRadius: BorderRadius.circular(20),
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
                                          fontSize: isMobile ? 10 : 12,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                // Coluna Status
                                DataCell(
                                  Center(
                                    child: Row(
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
                                        const SizedBox(width: 6),
                                        Flexible(
                                          child: Text(
                                            statusTexto,
                                            style: TextStyle(
                                              color: statusColor,
                                              fontWeight: FontWeight.bold,
                                              fontSize: isMobile ? 10 : 12,
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
        const SizedBox(height: 20),
      ],
    );
  }
}
