import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../widgets/mainLayout.dart';
import '../widgets/drawer_tecnico.dart';
import '../tecnico/chamadosTecnico.dart';
import '../../../api/services/chamado_service.dart';
import '../../../api/models/chamado_model.dart';

class ChamadoDetalhadoTecnico extends StatefulWidget {
  const ChamadoDetalhadoTecnico({super.key});

  @override
  State<ChamadoDetalhadoTecnico> createState() =>
      _ChamadoDetalhadoTecnicoState();
}

class _ChamadoDetalhadoTecnicoState extends State<ChamadoDetalhadoTecnico> {
  bool mostrarImagemFullscreen = false;
  String? imagemChamadoUrl;

  // Variáveis para carregar o chamado
  Chamado? _chamado;
  bool _isLoading = true;
  String _errorMessage = '';
  final ChamadoService _chamadoService = ChamadoService();

  int _chamadoId = 0;

  // Variável para status local (não integrado)
  String _statusLocal = "Aguardando";

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _obterIdDoChamado(context);
    });
  }

  void _obterIdDoChamado(BuildContext context) {
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

    _buscarPrimeiroChamado();
  }

  Future<void> _buscarPrimeiroChamado() async {
    try {
      print('🔍 Buscando lista de chamados para técnico...');
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

      // Traduzir o status do backend para o formato local
      final statusTexto = _traduzirStatus(chamado.status.toString());

      setState(() {
        _chamado = chamado;
        _statusLocal = statusTexto;
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
      case 'médio':
        return Colors.orange;
      case 'baixa':
        return Colors.green;
      case 'baixo':
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
      case 'médio':
        return Colors.orange.shade100;
      case 'baixa':
        return Colors.green.shade100;
      case 'baixo':
        return Colors.green.shade100;
      default:
        return Colors.grey.shade100;
    }
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

  // Função para obter cor de fundo do status
  Color _getStatusBackgroundColor(String status) {
    final statusLower = status.toLowerCase();
    if (statusLower.contains('aguardando')) {
      return Colors.yellow.shade100;
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

  // Função para atribuir chamado (DESATIVADA - apenas visual)
  void _atribuirChamado() {
    setState(() {
      _statusLocal = "Em Andamento";
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Chamado atribuído (visualmente)!"),
        backgroundColor: Colors.blue,
        duration: Duration(seconds: 2),
      ),
    );
  }

  // Função para alterar status (DESATIVADA - apenas visual)
  void _alterarStatus(String novoStatus) {
    setState(() {
      _statusLocal = novoStatus;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Status alterado para $novoStatus (visualmente)"),
        backgroundColor: Colors.blue,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  // Função para confirmar a conclusão (DESATIVADA - apenas visual)
  Future<void> _confirmarConclusao() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder:
          (context) => AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            title: const Text(
              "Concluir Chamado",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.indigo,
              ),
            ),
            content: const Text(
              "Deseja realmente marcar este chamado como concluído?",
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
                  backgroundColor: Color(0xFF065f46),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  "Concluir",
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ],
          ),
    );

    if (confirm == true) {
      setState(() {
        _statusLocal = "Concluído";
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Chamado concluído (visualmente)!"),
          backgroundColor: Colors.green,
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  // Função para reabrir chamado (DESATIVADA - apenas visual)
  void _reabrirChamado() {
    setState(() {
      _statusLocal = "Em Andamento";
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Chamado reaberto (visualmente)!"),
        backgroundColor: Colors.blue,
        duration: Duration(seconds: 2),
      ),
    );
  }

  // Formatar data e hora
  String _formatarDataHora(DateTime? date) {
    if (date == null) return 'Não informado';
    return DateFormat('dd/MM/yyyy HH:mm').format(date);
  }

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      drawer: const DrawerTecnico(),
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
                            builder: (context) => const MeusChamadosTecnico(),
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
    final statusBackend = _traduzirStatus(chamado.status.toString());
    final prioridadeTexto = _traduzirPrioridade(chamado.prioridade.toString());
    final imagemUrl = chamado.photo;

    // Usar status local para a interface
    final statusTexto = _statusLocal;

    return Stack(
      children: [
        SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Botão voltar
                GestureDetector(
                  onTap: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const MeusChamadosTecnico(),
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

                // Título
                const Text(
                  'Chamado Detalhado',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.indigo,
                  ),
                ),
                const SizedBox(height: 16),

                // Seção de ações para o técnico (APENAS VISUAL)
                if (statusTexto == "Aguardando") ...[
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
                          "Atribuir Chamado",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          "Este chamado está aguardando atribuição",
                          style: TextStyle(color: Colors.black54, fontSize: 14),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: _atribuirChamado, // Apenas visual
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.black,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(6),
                              ),
                            ),
                            icon: const Icon(
                              Icons.person_add,
                              color: Colors.white,
                              size: 20,
                            ),
                            label: const Text(
                              "Atribuir para Mim",
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "Status real no sistema: $statusBackend",
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // Seção para chamado em andamento (APENAS VISUAL)
                if (statusTexto == "Em Andamento") ...[
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
                          "Gerenciar Chamado",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          "Chamado em andamento",
                          style: TextStyle(color: Colors.black54, fontSize: 14),
                        ),
                        const SizedBox(height: 12),

                        // Botão Concluir
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: _confirmarConclusao, // Apenas visual
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFF065f46),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(6),
                              ),
                            ),
                            icon: const Icon(
                              Icons.check_circle,
                              color: Colors.white,
                              size: 20,
                            ),
                            label: const Text(
                              "Marcar como Concluído",
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),

                        // Dropdown para alterar status (APENAS VISUAL)
                        DropdownButtonFormField<String>(
                          value: statusTexto,
                          decoration: InputDecoration(
                            labelText: "Alterar Status",
                            labelStyle: const TextStyle(color: Colors.black54),
                            filled: true,
                            fillColor: Colors.white,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(6),
                              borderSide: BorderSide(
                                color: Colors.grey.shade400,
                              ),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(6),
                              borderSide: BorderSide(
                                color: Colors.grey.shade400,
                              ),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(6),
                              borderSide: const BorderSide(
                                color: Colors.indigo,
                              ),
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 8,
                            ),
                          ),
                          dropdownColor: Colors.white,
                          icon: const Icon(
                            Icons.arrow_drop_down,
                            color: Colors.black,
                          ),
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 14,
                          ),
                          items:
                              [
                                    "Aguardando",
                                    "Em Andamento",
                                    "Concluído",
                                    "Cancelado",
                                  ]
                                  .map(
                                    (status) => DropdownMenuItem(
                                      value: status,
                                      child: Text(
                                        status,
                                        style: const TextStyle(
                                          color: Colors.black,
                                        ),
                                      ),
                                    ),
                                  )
                                  .toList(),
                          onChanged: (novoStatus) {
                            if (novoStatus != null) {
                              if (novoStatus == "Concluído") {
                                _confirmarConclusao();
                              } else {
                                _alterarStatus(novoStatus);
                              }
                            }
                          },
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "Status real no sistema: $statusBackend",
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // Seção para chamado concluído (APENAS VISUAL)
                if (statusTexto == "Concluído") ...[
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
                          "Chamado Concluído",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          "Este chamado foi finalizado",
                          style: TextStyle(color: Colors.black54, fontSize: 14),
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: _reabrirChamado, // Apenas visual
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFF856404),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(6),
                              ),
                            ),
                            icon: const Icon(
                              Icons.refresh,
                              color: Colors.white,
                              size: 20,
                            ),
                            label: const Text(
                              "Reabrir Chamado",
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w600,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          "Status real no sistema: $statusBackend",
                          style: const TextStyle(
                            color: Colors.grey,
                            fontSize: 12,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // Card Chamado (dados reais do backend)
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
                      // ID e Status (mostra status REAL do backend)
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
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: _getStatusBackgroundColor(
                                    statusBackend,
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      _getStatusIcon(statusBackend),
                                      color: _getStatusColor(statusBackend),
                                      size: 16,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      statusBackend,
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: _getStatusColor(statusBackend),
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                "Status visual: $_statusLocal",
                                style: const TextStyle(
                                  fontSize: 10,
                                  color: Colors.grey,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ],
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

                      const Text(
                        "Ambiente",
                        style: TextStyle(color: Colors.black54),
                      ),
                      Text(chamado.categoria ?? 'Não informado'),
                      const SizedBox(height: 12),

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
                              loadingBuilder: (
                                context,
                                child,
                                loadingProgress,
                              ) {
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
                              Text(_formatarDataHora(chamado.dtCriacao)),
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
