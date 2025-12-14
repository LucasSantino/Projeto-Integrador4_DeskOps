import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../widgets/mainLayout.dart';
import '../widgets/drawer_tecnico.dart';
import '../../../api/services/chamado_service.dart';
import '../../../api/models/chamado_model.dart';

class MeusChamadosTecnico extends StatefulWidget {
  const MeusChamadosTecnico({super.key});

  @override
  State<MeusChamadosTecnico> createState() => _MeusChamadosTecnicoState();
}

class _MeusChamadosTecnicoState extends State<MeusChamadosTecnico> {
  final TextEditingController searchController = TextEditingController();
  String statusFilter = 'Todos';
  String prioridadeFilter = 'Todas';

  // Variáveis para carregar os chamados
  List<Chamado> _chamados = [];
  bool _isLoading = true;
  String _errorMessage = '';
  final ChamadoService _chamadoService = ChamadoService();

  int? hoveredRowIndex;

  @override
  void initState() {
    super.initState();
    _carregarChamados();
  }

  Future<void> _carregarChamados() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      // Buscar chamados atribuídos ao técnico logado
      print('🔍 Buscando chamados do técnico...');
      final todosChamados = await _chamadoService.getChamados();

      // Filtrar apenas chamados atribuídos ao técnico
      // CORREÇÃO: Verificar apenas se employee não é null
      final chamadosAtribuidos =
          todosChamados.where((chamado) {
            return chamado.employee != null;
          }).toList();

      print('✅ Encontrados ${chamadosAtribuidos.length} chamados atribuídos');

      setState(() {
        _chamados = chamadosAtribuidos;
        _isLoading = false;
      });
    } catch (e) {
      print('❌ Erro ao carregar chamados: $e');
      setState(() {
        _isLoading = false;
        _errorMessage = 'Erro ao carregar chamados: ${e.toString()}';
      });
    }
  }

  String truncate(String text, [int maxLength = 25]) {
    if (text.length <= maxLength) return text;
    return '${text.substring(0, maxLength - 3)}...';
  }

  // Função para obter cor do status
  Color _getStatusColor(String status) {
    final statusLower = status.toLowerCase();
    if (statusLower.contains('aguardando')) {
      return Colors.amber.shade700;
    } else if (statusLower.contains('andamento')) {
      return Colors.blue;
    } else if (statusLower.contains('concluído') ||
        statusLower.contains('concluido')) {
      return Colors.green;
    } else if (statusLower.contains('cancelado')) {
      return Colors.red;
    } else {
      return Colors.grey;
    }
  }

  // Função para obter ícone do status
  IconData _getStatusIcon(String status) {
    final statusLower = status.toLowerCase();
    if (statusLower.contains('aguardando')) {
      return Icons.hourglass_empty;
    } else if (statusLower.contains('andamento')) {
      return Icons.autorenew;
    } else if (statusLower.contains('concluído') ||
        statusLower.contains('concluido')) {
      return Icons.check_circle_outline;
    } else if (statusLower.contains('cancelado')) {
      return Icons.cancel_outlined;
    } else {
      return Icons.help_outline;
    }
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

  // Função para obter cor da prioridade
  Color _getPrioridadeColor(String prioridade) {
    switch (prioridade.toLowerCase()) {
      case 'alta':
        return Colors.red;
      case 'média':
        return Colors.orange;
      case 'médio':
        return Colors.orange;
      case 'baixa':
        return Colors.green;
      case 'baixo':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  // Função para obter cor de fundo da prioridade
  Color _getPrioridadeBackgroundColor(String prioridade) {
    final color = _getPrioridadeColor(prioridade);
    return color.withAlpha(25);
  }

  @override
  Widget build(BuildContext context) {
    // Usando MediaQuery para detectar tamanho da tela
    final screenWidth = MediaQuery.of(context).size.width;

    // Definindo breakpoints para diferentes tamanhos de tela
    final bool isTablet = screenWidth >= 600;
    final bool isLargeTablet = screenWidth >= 900;
    final bool isDesktop = screenWidth >= 1200;

    // Ajustes baseados no tamanho da tela
    final double titleFontSize = isLargeTablet ? 28 : (isTablet ? 26 : 24);
    final double backFontSize = isTablet ? 18 : 16;
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

    // Filtrar chamados com base nos filtros e pesquisa
    final filteredChamados =
        _chamados.where((chamado) {
          final titulo = chamado.title.toLowerCase();
          final status = _traduzirStatus(chamado.status.toString());
          final prioridade = _traduzirPrioridade(chamado.prioridade.toString());

          final matchesStatus =
              statusFilter == 'Todos' ||
              status.toLowerCase() == statusFilter.toLowerCase();
          final matchesPrioridade =
              prioridadeFilter == 'Todas' ||
              prioridade.toLowerCase() == prioridadeFilter.toLowerCase();
          final matchesSearch =
              searchController.text.isEmpty ||
              titulo.contains(searchController.text.toLowerCase());

          return matchesStatus && matchesPrioridade && matchesSearch;
        }).toList();

    return MainLayout(
      drawer: const DrawerTecnico(),
      child:
          _isLoading
              ? const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 16),
                    Text(
                      "Carregando seus chamados...",
                      style: TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              )
              : _errorMessage.isNotEmpty
              ? Center(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error, size: 60, color: Colors.red),
                      const SizedBox(height: 20),
                      Text(
                        _errorMessage,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 16, color: Colors.red),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: _carregarChamados,
                        child: const Text('Tentar novamente'),
                      ),
                    ],
                  ),
                ),
              )
              : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Botão Voltar com responsividade (FICA ACIMA, SEPARADO)
                  GestureDetector(
                    onTap: () {
                      Navigator.pushReplacementNamed(
                        context,
                        '/lista_chamados',
                      );
                    },
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.arrow_back,
                          color: const Color.fromARGB(255, 0, 0, 0),
                          size: isTablet ? 20 : 18,
                        ),
                        SizedBox(width: isTablet ? 6 : 4),
                        Text(
                          'Voltar',
                          style: TextStyle(
                            fontSize: backFontSize,
                            fontWeight: FontWeight.bold,
                            color: const Color.fromARGB(255, 0, 0, 0),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Linha com Título e Botão de Atualizar
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Título da página
                      Text(
                        'Meus Chamados',
                        style: TextStyle(
                          fontSize: titleFontSize,
                          fontWeight: FontWeight.bold,
                          color: const Color.fromARGB(255, 46, 61, 163),
                        ),
                      ),

                      // BOTÃO DE ATUALIZAR ADICIONADO AQUI
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

                  // Contador de chamados
                  Text(
                    'Total: ${_chamados.length} chamado(s) atribuído(s)',
                    style: const TextStyle(fontSize: 14, color: Colors.grey),
                  ),

                  const SizedBox(height: 20),

                  // Filtros e pesquisa
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
                                      style: TextStyle(
                                        fontSize: filterFontSize,
                                      ),
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
                                      style: TextStyle(
                                        fontSize: filterFontSize,
                                      ),
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
                            hintText: 'Pesquisar por título...',
                            contentPadding: EdgeInsets.symmetric(
                              horizontal: searchPadding,
                              vertical: searchPadding,
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            isDense: true,
                            suffixIcon: IconButton(
                              icon: const Icon(Icons.search),
                              onPressed: () {
                                setState(() {});
                              },
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

                  // Indicador de resultados filtrados
                  if (searchController.text.isNotEmpty ||
                      statusFilter != 'Todos' ||
                      prioridadeFilter != 'Todas')
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Text(
                        'Mostrando ${filteredChamados.length} de ${_chamados.length} chamado(s)',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),

                  // Tabela de chamados
                  Expanded(
                    child:
                        _chamados.isEmpty
                            ? Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.assignment,
                                    size: 80,
                                    color: Colors.grey,
                                  ),
                                  const SizedBox(height: 20),
                                  const Text(
                                    'Nenhum chamado atribuído',
                                    style: TextStyle(
                                      fontSize: 18,
                                      color: Colors.grey,
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  const Text(
                                    'Você ainda não tem chamados atribuídos a você.',
                                    style: TextStyle(color: Colors.grey),
                                    textAlign: TextAlign.center,
                                  ),
                                  const SizedBox(height: 20),
                                  ElevatedButton(
                                    onPressed: _carregarChamados,
                                    child: const Text('Atualizar lista'),
                                  ),
                                ],
                              ),
                            )
                            : SingleChildScrollView(
                              scrollDirection: Axis.vertical,
                              child: Container(
                                decoration: BoxDecoration(
                                  border: Border.all(
                                    color: Colors.grey.shade300,
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: SingleChildScrollView(
                                  scrollDirection:
                                      isTablet
                                          ? Axis.vertical
                                          : Axis.horizontal,
                                  child: ConstrainedBox(
                                    constraints: BoxConstraints(
                                      minWidth:
                                          isTablet
                                              ? screenWidth * 0.9
                                              : screenWidth,
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
                                        if (isTablet)
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
                                      rows: List.generate(filteredChamados.length, (
                                        index,
                                      ) {
                                        final chamado = filteredChamados[index];
                                        final status = _traduzirStatus(
                                          chamado.status.toString(),
                                        );
                                        final prioridade = _traduzirPrioridade(
                                          chamado.prioridade.toString(),
                                        );

                                        final statusColor = _getStatusColor(
                                          status,
                                        );
                                        final statusIcon = _getStatusIcon(
                                          status,
                                        );
                                        final prioridadeColor =
                                            _getPrioridadeColor(prioridade);
                                        final prioridadeBgColor =
                                            _getPrioridadeBackgroundColor(
                                              prioridade,
                                            );

                                        // Formatar data de atualização
                                        final updateDate = chamado.updateDate;
                                        final dataStr =
                                            updateDate != null
                                                ? DateFormat(
                                                  'dd/MM/yyyy',
                                                ).format(updateDate)
                                                : '';
                                        final horaStr =
                                            updateDate != null
                                                ? DateFormat(
                                                  'HH:mm',
                                                ).format(updateDate)
                                                : '';

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
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                children: [
                                                  Text(
                                                    dataStr,
                                                    style: TextStyle(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      fontSize:
                                                          isTablet ? 15 : 14,
                                                    ),
                                                    overflow:
                                                        TextOverflow.ellipsis,
                                                  ),
                                                  Text(
                                                    horaStr,
                                                    style: TextStyle(
                                                      fontSize:
                                                          isTablet ? 14 : 13,
                                                    ),
                                                    overflow:
                                                        TextOverflow.ellipsis,
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
                                                              : (isTablet
                                                                  ? 250
                                                                  : 200)),
                                                ),
                                                child: Column(
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                  mainAxisAlignment:
                                                      MainAxisAlignment.center,
                                                  children: [
                                                    Text(
                                                      truncate(
                                                        chamado.title,
                                                        titleMaxLength,
                                                      ),
                                                      style: TextStyle(
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        fontSize:
                                                            isTablet ? 15 : 14,
                                                      ),
                                                      maxLines: 2,
                                                      overflow:
                                                          TextOverflow.ellipsis,
                                                    ),
                                                    if (chamado.asset?.name !=
                                                        null)
                                                      Padding(
                                                        padding:
                                                            const EdgeInsets.only(
                                                              top: 4,
                                                            ),
                                                        child: Text(
                                                          'Ativo: ${chamado.asset!.name}',
                                                          style: TextStyle(
                                                            fontSize: 11,
                                                            color:
                                                                Colors
                                                                    .grey
                                                                    .shade600,
                                                          ),
                                                          maxLines: 1,
                                                          overflow:
                                                              TextOverflow
                                                                  .ellipsis,
                                                        ),
                                                      ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                            // Coluna Prioridade (apenas em tablets)
                                            if (isTablet)
                                              DataCell(
                                                Center(
                                                  child: Container(
                                                    padding:
                                                        EdgeInsets.symmetric(
                                                          horizontal:
                                                              isLargeTablet
                                                                  ? 12
                                                                  : 8,
                                                          vertical:
                                                              isLargeTablet
                                                                  ? 6
                                                                  : 4,
                                                        ),
                                                    decoration: BoxDecoration(
                                                      color: prioridadeBgColor,
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            20,
                                                          ),
                                                      border: Border.all(
                                                        color: prioridadeColor,
                                                        width: 1,
                                                      ),
                                                    ),
                                                    child: Text(
                                                      prioridade,
                                                      style: TextStyle(
                                                        color: prioridadeColor,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        fontSize:
                                                            statusFontSize,
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
                                                        status,
                                                        style: TextStyle(
                                                          color: statusColor,
                                                          fontWeight:
                                                              FontWeight.bold,
                                                          fontSize:
                                                              statusFontSize,
                                                        ),
                                                        overflow:
                                                            TextOverflow
                                                                .ellipsis,
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
