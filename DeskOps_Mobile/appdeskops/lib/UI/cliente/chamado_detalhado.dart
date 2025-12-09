import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../widgets/mainLayout.dart';
import 'meus_chamados.dart';
import 'editar_chamado.dart';
import '../../../api/services/chamado_service.dart';
import '../../../api/models/chamado_model.dart';

class ChamadoDetalhado extends StatefulWidget {
  const ChamadoDetalhado({super.key});

  @override
  State<ChamadoDetalhado> createState() => _ChamadoDetalhadoState();
}

class _ChamadoDetalhadoState extends State<ChamadoDetalhado> {
  bool mostrarImagemFullscreen = false;
  String? imagemChamadoUrl;

  // Variáveis para carregar o chamado
  Chamado? _chamado;
  bool _isLoading = true;
  String _errorMessage = '';
  final ChamadoService _chamadoService = ChamadoService();

  int _chamadoId = 0; // Variável para armazenar o ID do chamado

  @override
  void initState() {
    super.initState();

    // Tentar obter o ID do chamado dos argumentos da rota
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _obterIdDoChamado(context);
    });
  }

  void _obterIdDoChamado(BuildContext context) {
    // Tentar obter o ID dos argumentos da rota
    final modalRoute = ModalRoute.of(context);
    if (modalRoute != null) {
      final settings = modalRoute.settings;
      if (settings.arguments != null) {
        if (settings.arguments is int) {
          setState(() {
            _chamadoId = settings.arguments as int;
          });
          _carregarChamado();
          return;
        }
      }
    }

    // Se não conseguir obter o ID dos argumentos, usar um padrão
    // OU buscar da lista de chamados
    _buscarPrimeiroChamado();
  }

  Future<void> _buscarPrimeiroChamado() async {
    try {
      print('🔍 Buscando lista de chamados...');
      final todosChamados = await _chamadoService.getChamados();
      if (todosChamados.isNotEmpty) {
        setState(() {
          _chamadoId = todosChamados.first.id!;
        });
        _carregarChamado();
      } else {
        setState(() {
          _isLoading = false;
          _errorMessage = 'Nenhum chamado encontrado.';
        });
      }
    } catch (e) {
      print('❌ Erro ao buscar chamados: $e');
      setState(() {
        _isLoading = false;
        _errorMessage = 'Erro ao buscar chamados: ${e.toString()}';
      });
    }
  }

  Future<void> _carregarChamado() async {
    if (_chamadoId == 0) {
      setState(() {
        _isLoading = false;
        _errorMessage = 'ID do chamado não especificado.';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      print('📥 Carregando chamado ID: $_chamadoId');
      final chamado = await _chamadoService.getChamadoById(_chamadoId);
      print('✅ Chamado carregado com sucesso: ${chamado.id}');
      setState(() {
        _chamado = chamado;
        _isLoading = false;
      });
    } catch (e) {
      print('❌ Erro ao carregar chamado: $e');
      setState(() {
        _isLoading = false;
        _errorMessage = 'Erro ao carregar chamado: ${e.toString()}';
      });
    }
  }

  // Função para obter cor baseada na prioridade
  Color _getPrioridadeColor(String prioridade) {
    switch (prioridade.toLowerCase()) {
      case 'alta':
        return Colors.red;
      case 'média':
        return Colors.orange;
      case 'baixa':
        return Colors.green;
      default:
        return Colors.black54;
    }
  }

  // Função para obter cor de fundo baseada na prioridade
  Color _getPrioridadeBackgroundColor(String prioridade) {
    switch (prioridade.toLowerCase()) {
      case 'alta':
        return Colors.red.shade100;
      case 'média':
        return Colors.orange.shade100;
      case 'baixa':
        return Colors.green.shade100;
      default:
        return Colors.grey.shade100;
    }
  }

  // Função para obter cor do status
  Color _getStatusColor(String status) {
    final statusLower = status.toLowerCase();
    if (statusLower.contains('aguardando')) {
      return Colors.orange;
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

  // Função para obter cor de fundo do status
  Color _getStatusBackgroundColor(String status) {
    final statusLower = status.toLowerCase();
    if (statusLower.contains('aguardando')) {
      return Colors.orange.shade100;
    } else if (statusLower.contains('andamento')) {
      return Colors.blue.shade100;
    } else if (statusLower.contains('concluído') ||
        statusLower.contains('concluido')) {
      return Colors.green.shade100;
    } else if (statusLower.contains('cancelado')) {
      return Colors.red.shade100;
    } else {
      return Colors.grey.shade100;
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

  // Função para confirmar o encerramento do chamado
  Future<void> _confirmarEncerramento() async {
    if (_chamado == null || _chamado!.id == null) return;

    final confirm = await showDialog<bool>(
      context: context,
      builder:
          (context) => AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            title: const Text(
              "Encerrar Chamado",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.indigo,
              ),
            ),
            content: const Text(
              "Deseja realmente encerrar este chamado? Esta ação marcará o chamado como cancelado.",
              style: TextStyle(color: Colors.black87),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text(
                  "Cancelar",
                  style: TextStyle(color: Colors.grey),
                ),
              ),
              ElevatedButton(
                onPressed: () => Navigator.pop(context, true),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  "Encerrar",
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ],
          ),
    );

    if (confirm == true) {
      try {
        setState(() {
          _isLoading = true;
        });

        // Chamar a API para cancelar o chamado
        await _chamadoService.encerrarChamado(_chamado!.id!);

        // Recarregar os dados do chamado
        await _carregarChamado();

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Chamado encerrado com sucesso!"),
            backgroundColor: Colors.green,
          ),
        );
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Erro ao encerrar chamado: $e"),
            backgroundColor: Colors.red,
          ),
        );
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  // Formatar data e hora
  String _formatarDataHora(DateTime? date) {
    if (date == null) return 'Não informado';
    return DateFormat('dd/MM/yyyy HH:mm').format(date);
  }

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
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
                        onPressed: _carregarChamado,
                        child: const Text('Tentar novamente'),
                      ),
                    ],
                  ),
                ),
              )
              : _chamado == null
              ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 60,
                      color: Colors.grey,
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Chamado não encontrado',
                      style: TextStyle(fontSize: 18, color: Colors.grey),
                    ),
                    const SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const MeusChamados(),
                          ),
                        );
                      },
                      child: const Text('Voltar para Meus Chamados'),
                    ),
                  ],
                ),
              )
              : _buildDetalhesChamado(context, _chamado!),
    );
  }

  Widget _buildDetalhesChamado(BuildContext context, Chamado chamado) {
    // Traduzir status e prioridade
    final statusTexto = _traduzirStatus(chamado.status.toString());
    final prioridadeTexto = _traduzirPrioridade(chamado.prioridade.toString());

    // Obter a URL da imagem, se houver
    final imagemUrl = chamado.photo;

    return Stack(
      children: [
        SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Botão voltar
              GestureDetector(
                onTap: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const MeusChamados(),
                    ),
                  );
                },
                child: const Row(
                  children: [
                    Icon(Icons.arrow_back, color: Colors.black),
                    SizedBox(width: 4),
                    Text(
                      "Voltar",
                      style: TextStyle(fontSize: 16, color: Colors.black),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Título com botão editar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Chamado detalhado',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.indigo,
                    ),
                  ),
                  TextButton.icon(
                    onPressed: () {
                      // Navegar para a tela de edição
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder:
                              (context) => EditarChamado(
                                tituloInicial: chamado.title,
                                descricaoInicial: chamado.description,
                                categoriaInicial: chamado.categoria ?? '',
                                prioridadeInicial: prioridadeTexto,
                                imagemInicial: null,
                                imagemUrl: imagemUrl,
                              ),
                        ),
                      ).then((value) {
                        // Se a edição foi bem sucedida, recarregar os dados
                        if (value == true) {
                          _carregarChamado();
                        }
                      });
                    },
                    icon: const Icon(Icons.edit, color: Colors.indigo),
                    label: const Text(
                      'Editar',
                      style: TextStyle(color: Colors.indigo),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Botão Encerrar
              if (chamado.status.toString() != 'StatusChamados.CANCELADO' &&
                  chamado.status.toString() != 'StatusChamados.CONCLUIDO')
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      _confirmarEncerramento();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      "Cancelar Chamado",
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                )
              else
                Container(), // Não exibe o botão se já estiver cancelado ou concluído
              const SizedBox(height: 20),

              // Card Chamado
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // ID e Status
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "ID: ${chamado.id ?? 'N/A'}",
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        // Status com Stack
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: _getStatusBackgroundColor(statusTexto),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                _getStatusIcon(statusTexto.toLowerCase()),
                                color: _getStatusColor(
                                  statusTexto.toLowerCase(),
                                ),
                                size: 16,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                statusTexto,
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: _getStatusColor(
                                    statusTexto.toLowerCase(),
                                  ),
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    Text(
                      chamado.title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),

                    const Text(
                      "Descrição",
                      style: TextStyle(color: Colors.black54),
                    ),
                    Text(chamado.description),
                    const SizedBox(height: 12),

                    // Ambiente (categoria)
                    const Text(
                      "Ambiente",
                      style: TextStyle(color: Colors.black54),
                    ),
                    Text(chamado.categoria ?? 'Não informado'),
                    const SizedBox(height: 12),

                    // Ativo (asset)
                    const Text(
                      "Ativo",
                      style: TextStyle(color: Colors.black54),
                    ),
                    Row(
                      children: [
                        Icon(
                          Icons.devices,
                          color: Colors.grey.shade600,
                          size: 16,
                        ),
                        const SizedBox(width: 8),
                        Text(chamado.asset?.name ?? 'Não informado'),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Prioridade com Stack
                    const Text(
                      "Prioridade",
                      style: TextStyle(color: Colors.black54),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: _getPrioridadeBackgroundColor(prioridadeTexto),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.arrow_upward,
                            color: _getPrioridadeColor(prioridadeTexto),
                            size: 16,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            prioridadeTexto,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: _getPrioridadeColor(prioridadeTexto),
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),

                    const Text(
                      "Imagem",
                      style: TextStyle(color: Colors.black54),
                    ),
                    if (imagemUrl != null && imagemUrl.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            mostrarImagemFullscreen = true;
                            imagemChamadoUrl = imagemUrl;
                          });
                        },
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            imagemUrl,
                            height: 120,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            loadingBuilder: (context, child, loadingProgress) {
                              if (loadingProgress == null) return child;
                              return Container(
                                height: 120,
                                color: Colors.grey.shade200,
                                child: const Center(
                                  child: CircularProgressIndicator(),
                                ),
                              );
                            },
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                height: 120,
                                color: Colors.grey.shade200,
                                child: const Center(
                                  child: Icon(
                                    Icons.broken_image,
                                    color: Colors.grey,
                                    size: 40,
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    ] else
                      const Text(
                        "Nenhuma imagem anexada",
                        style: TextStyle(color: Colors.black54),
                      ),
                    const SizedBox(height: 12),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Criado em",
                              style: TextStyle(color: Colors.black54),
                            ),
                            Text(_formatarDataHora(chamado.updateDate)),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Atualizado em",
                              style: TextStyle(color: Colors.black54),
                            ),
                            Text(_formatarDataHora(chamado.updateDate)),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    const Text(
                      "Cliente",
                      style: TextStyle(color: Colors.black54),
                    ),
                    Text(chamado.creator.name),
                    Text(chamado.creator.email),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Card Técnico (se houver técnico atribuído)
              if (chamado.employee != null)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Técnico Responsável",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(chamado.employee!.name),
                      Text(chamado.employee!.email),
                    ],
                  ),
                ),
            ],
          ),
        ),

        // Overlay imagem fullscreen
        if (mostrarImagemFullscreen && imagemChamadoUrl != null)
          Positioned.fill(
            child: Container(
              color: Colors.black.withOpacity(0.9),
              child: Stack(
                children: [
                  Center(
                    child: Image.network(
                      imagemChamadoUrl!,
                      fit: BoxFit.contain,
                      errorBuilder: (context, error, stackTrace) {
                        return const Center(
                          child: Text(
                            'Erro ao carregar imagem',
                            style: TextStyle(color: Colors.white),
                          ),
                        );
                      },
                    ),
                  ),
                  Positioned(
                    top: 40,
                    right: 20,
                    child: IconButton(
                      icon: const Icon(
                        Icons.close,
                        color: Colors.white,
                        size: 32,
                      ),
                      onPressed: () {
                        setState(() {
                          mostrarImagemFullscreen = false;
                        });
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
