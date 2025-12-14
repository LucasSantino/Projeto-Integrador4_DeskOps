import 'package:flutter/material.dart';
import 'dart:io';
import 'dart:typed_data'; // Adicionado para Uint8List
import 'package:image_picker/image_picker.dart';
import '../widgets/mainlayout.dart';
import 'meus_chamados.dart';
import '../../api/services/chamado_service.dart';
import '../../api/services/ativo_service.dart';
import '../../api/services/environment_service.dart';
import '../../api/models/ativo_model.dart';
import '../../api/models/environment_model.dart';
import '../../api/models/status_models.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class NovoChamado extends StatefulWidget {
  const NovoChamado({super.key});

  @override
  State<NovoChamado> createState() => _NovoChamadoState();
}

class _NovoChamadoState extends State<NovoChamado> {
  final TextEditingController tituloController = TextEditingController();
  final TextEditingController descricaoController = TextEditingController();

  Ativo? ativoSelecionado;
  Environment? ambienteSelecionado;
  String? prioridadeSelecionada;
  File? imagemSelecionada;
  Uint8List? _webImageBytes;
  String? _webImageName;

  final ImagePicker _picker = ImagePicker();
  
  final ChamadoService _chamadoService = ChamadoService();
  final AtivoService _ativoService = AtivoService();
  final EnvironmentService _environmentService = EnvironmentService();
  
  List<Ativo> _ativos = [];
  List<Environment> _ambientes = [];
  bool _carregandoAtivos = false;
  bool _carregandoAmbientes = false;

  @override
  void initState() {
    super.initState();
    _carregarDadosIniciais();
  }

  Future<void> _carregarDadosIniciais() async {
    try {
      await _carregarAmbientes();
      await _carregarAtivos();
    } catch (e) {
      print('Erro ao carregar dados iniciais: $e');
      _mostrarSnackbarErro('Erro ao carregar dados do sistema');
    }
  }

  Future<void> _carregarAtivos() async {
    try {
      setState(() => _carregandoAtivos = true);
      final ativos = await _ativoService.getAtivosDisponiveis();
      setState(() => _ativos = ativos);
      print('✅ ${ativos.length} ativos carregados');
    } catch (e) {
      print('❌ Erro ao carregar ativos: $e');
      _mostrarSnackbarErro('Erro ao carregar ativos: ${e.toString()}');
    } finally {
      setState(() => _carregandoAtivos = false);
    }
  }

  Future<void> _carregarAmbientes() async {
    try {
      setState(() => _carregandoAmbientes = true);
      final ambientes = await _environmentService.getEnvironments();
      setState(() => _ambientes = ambientes);
      print('✅ ${ambientes.length} ambientes carregados');
    } catch (e) {
      print('❌ Erro ao carregar ambientes: $e');
      _mostrarSnackbarErro('Erro ao carregar ambientes: ${e.toString()}');
    } finally {
      setState(() => _carregandoAmbientes = false);
    }
  }

  bool _validarCampos() {
    return tituloController.text.isNotEmpty &&
        descricaoController.text.isNotEmpty &&
        ativoSelecionado != null &&
        ambienteSelecionado != null &&
        prioridadeSelecionada != null;
  }

  void _mostrarPopupConfirmacao() {
    if (!_validarCampos()) {
      _mostrarErroValidacao();
      return;
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: Colors.green.shade50,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.check_circle,
                    color: Colors.green.shade600,
                    size: 40,
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  "Confirmar Criação",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  "Tem certeza que deseja criar este chamado?",
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.black54, fontSize: 16),
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.of(context).pop(),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.grey.shade700,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          side: BorderSide(color: Colors.grey.shade300),
                        ),
                        child: const Text("Cancelar"),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                          _criarChamado();
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color.fromARGB(255, 0, 0, 0),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text("Confirmar"),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _mostrarErroValidacao() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.red.shade600,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        content: const Row(
          children: [
            Icon(Icons.error_outline, color: Colors.white, size: 24),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                "Preencha todos os campos obrigatórios!",
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  Future<void> _criarChamado() async {
    try {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(
          child: CircularProgressIndicator(),
        ),
      );

      String prioridadeBackend = _converterPrioridadeParaBackend(prioridadeSelecionada!);
      
      final novoChamado = await _chamadoService.createChamado(
        title: tituloController.text,
        description: descricaoController.text,
        prioridade: prioridadeBackend,
        assetId: ativoSelecionado!.id!,
        environmentId: ambienteSelecionado!.id,
        categoria: ambienteSelecionado!.name,
        imagem: kIsWeb ? null : imagemSelecionada, // Web não envia imagem local
      );

      Navigator.of(context).pop();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: Colors.green.shade600,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          content: Row(
            children: [
              const Icon(Icons.check_circle, color: Colors.white, size: 24),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  "Chamado #${novoChamado.id} criado com sucesso!",
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          duration: const Duration(seconds: 2),
        ),
      );

      Future.delayed(const Duration(milliseconds: 2200), () {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MeusChamados()),
        );
      });
      
    } catch (e) {
      Navigator.of(context).pop();
      print('❌ Erro ao criar chamado: $e');
      _mostrarSnackbarErro('Erro ao criar chamado: ${e.toString()}');
    }
  }

  String _converterPrioridadeParaBackend(String prioridadeFrontend) {
    switch (prioridadeFrontend) {
      case 'Alta':
        return 'ALTA';
      case 'Médio':
        return 'MEDIA';
      case 'Baixo':
        return 'BAIXA';
      default:
        return 'MEDIA';
    }
  }

  void _mostrarSnackbarErro(String mensagem) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.red.shade600,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        content: Row(
          children: [
            const Icon(Icons.error_outline, color: Colors.white, size: 24),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                mensagem.length > 100 ? '${mensagem.substring(0, 100)}...' : mensagem,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
        duration: const Duration(seconds: 4),
      ),
    );
  }

  Future<void> selecionarImagem({required bool daCamera}) async {
    try {
      final XFile? imagem = await _picker.pickImage(
        source: daCamera ? ImageSource.camera : ImageSource.gallery,
        imageQuality: 85,
        maxWidth: 800,
      );
      if (imagem != null) {
        if (kIsWeb) {
          // Para Web, armazenar bytes e nome
          final bytes = await imagem.readAsBytes();
          setState(() {
            _webImageBytes = bytes;
            _webImageName = imagem.name;
            imagemSelecionada = null;
          });
        } else {
          // Para mobile, usar File normalmente
          setState(() {
            imagemSelecionada = File(imagem.path);
            _webImageBytes = null;
            _webImageName = null;
          });
        }
      }
    } catch (e) {
      print('Erro ao selecionar imagem: $e');
      _mostrarSnackbarErro('Erro ao selecionar imagem');
    }
  }

  void mostrarOpcoesImagem() {
    // No Web, o image_picker funciona apenas com ImageSource.gallery
    if (kIsWeb) {
      selecionarImagem(daCamera: false);
      return;
    }

    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Selecionar da galeria'),
                onTap: () {
                  Navigator.of(context).pop();
                  selecionarImagem(daCamera: false);
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('Tirar foto'),
                onTap: () {
                  Navigator.of(context).pop();
                  selecionarImagem(daCamera: true);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _mostrarSelecaoAtivos() {
    if (_carregandoAtivos) return;

    List<Ativo> ativosFiltrados = List.from(_ativos);
    TextEditingController pesquisaController = TextEditingController();

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(16),
          topRight: Radius.circular(16),
        ),
      ),
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) {
          void filtrarAtivos(String value) {
            if (value.isEmpty) {
              setModalState(() => ativosFiltrados = List.from(_ativos));
            } else {
              setModalState(() {
                ativosFiltrados = _ativos.where((ativo) {
                  return ativo.name.toLowerCase().contains(value.toLowerCase()) ||
                      ativo.description.toLowerCase().contains(value.toLowerCase());
                }).toList();
              });
            }
          }

          return Container(
            padding: const EdgeInsets.all(16),
            height: MediaQuery.of(context).size.height * 0.8,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: pesquisaController,
                  decoration: InputDecoration(
                    hintText: 'Pesquisar ativo...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  onChanged: filtrarAtivos,
                ),
                const SizedBox(height: 16),

                if (_carregandoAtivos)
                  const Expanded(child: Center(child: CircularProgressIndicator()))
                else
                  Expanded(
                    child: ativosFiltrados.isEmpty
                        ? const Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.devices_other, size: 60, color: Colors.grey),
                                SizedBox(height: 16),
                                Text(
                                  'Nenhum ativo encontrado',
                                  style: TextStyle(color: Colors.grey),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            itemCount: ativosFiltrados.length,
                            itemBuilder: (context, index) {
                              final ativo = ativosFiltrados[index];
                              return ListTile(
                                leading: Icon(
                                  _getIconPorTipoAtivo(ativo.name),
                                  color: Colors.black54,
                                ),
                                title: Text(ativo.name),
                                subtitle: Text(
                                  _truncarDescricao('${ativo.environment.name} - ${ativo.description}'),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                trailing: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: _getStatusColor(ativo.status),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    _getStatusTexto(ativo.status),
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                onTap: () {
                                  setState(() => ativoSelecionado = ativo);
                                  Navigator.pop(context);
                                },
                              );
                            },
                          ),
                  ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('Cancelar'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _mostrarSelecaoAmbientes() {
    if (_carregandoAmbientes) return;

    List<Environment> ambientesFiltrados = List.from(_ambientes);
    TextEditingController pesquisaController = TextEditingController();

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(16),
          topRight: Radius.circular(16),
        ),
      ),
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) {
          void filtrarAmbientes(String value) {
            if (value.isEmpty) {
              setModalState(() => ambientesFiltrados = List.from(_ambientes));
            } else {
              setModalState(() {
                ambientesFiltrados = _ambientes.where((ambiente) {
                  return ambiente.name.toLowerCase().contains(value.toLowerCase()) ||
                      ambiente.description.toLowerCase().contains(value.toLowerCase());
                }).toList();
              });
            }
          }

          return Container(
            padding: const EdgeInsets.all(16),
            height: MediaQuery.of(context).size.height * 0.8,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: pesquisaController,
                  decoration: InputDecoration(
                    hintText: 'Pesquisar ambiente...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  onChanged: filtrarAmbientes,
                ),
                const SizedBox(height: 16),

                if (_carregandoAmbientes)
                  const Expanded(child: Center(child: CircularProgressIndicator()))
                else
                  Expanded(
                    child: ambientesFiltrados.isEmpty
                        ? const Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.location_on, size: 60, color: Colors.grey),
                                SizedBox(height: 16),
                                Text(
                                  'Nenhum ambiente encontrado',
                                  style: TextStyle(color: Colors.grey),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            itemCount: ambientesFiltrados.length,
                            itemBuilder: (context, index) {
                              final ambiente = ambientesFiltrados[index];
                              return ListTile(
                                leading: const Icon(
                                  Icons.location_on,
                                  color: Colors.black54,
                                ),
                                title: Text(ambiente.name),
                                subtitle: Text(
                                  _truncarDescricao(ambiente.description),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                onTap: () {
                                  setState(() => ambienteSelecionado = ambiente);
                                  Navigator.pop(context);
                                },
                              );
                            },
                          ),
                  ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text('Cancelar'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  String _truncarDescricao(String descricao) {
    if (descricao.isEmpty) return "Sem descrição";
    if (descricao.length <= 50) return descricao;
    return '${descricao.substring(0, 47)}...';
  }

  IconData _getIconPorTipoAtivo(String nomeAtivo) {
    final nome = nomeAtivo.toLowerCase();
    if (nome.contains('notebook') || nome.contains('laptop')) {
      return Icons.laptop;
    } else if (nome.contains('projetor')) {
      return Icons.video_label;
    } else if (nome.contains('impressora')) {
      return Icons.print;
    } else if (nome.contains('computador') || nome.contains('desktop')) {
      return Icons.computer;
    } else if (nome.contains('tablet')) {
      return Icons.tablet;
    } else if (nome.contains('monitor')) {
      return Icons.monitor;
    } else if (nome.contains('switch') || nome.contains('roteador')) {
      return Icons.router;
    } else {
      return Icons.devices_other;
    }
  }

  Color _getStatusColor(StatusAtivos status) {
    switch (status) {
      case StatusAtivos.ATIVO:
        return Colors.green;
      case StatusAtivos.EM_MANUTENCAO:
        return Colors.orange;
      case StatusAtivos.DESATIVADO:
        return Colors.red;
    }
  }

  String _getStatusTexto(StatusAtivos status) {
    switch (status) {
      case StatusAtivos.ATIVO:
        return 'Ativo';
      case StatusAtivos.EM_MANUTENCAO:
        return 'Manutenção';
      case StatusAtivos.DESATIVADO:
        return 'Desativado';
    }
  }

  Widget _buildImagePreview() {
    if (kIsWeb) {
      if (_webImageBytes != null) {
        return ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.memory(
            _webImageBytes!,
            height: 100,
            width: double.infinity,
            fit: BoxFit.cover,
          ),
        );
      }
    } else {
      if (imagemSelecionada != null) {
        return ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.file(
            imagemSelecionada!,
            height: 100,
            width: double.infinity,
            fit: BoxFit.cover,
          ),
        );
      }
    }
    return Container();
  }

  Widget _buildImagePreviewResumo() {
    if (kIsWeb) {
      if (_webImageBytes != null) {
        return Column(
          children: [
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.memory(
                _webImageBytes!,
                height: 80,
                fit: BoxFit.cover,
              ),
            ),
          ],
        );
      }
    } else {
      if (imagemSelecionada != null) {
        return Column(
          children: [
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.file(
                imagemSelecionada!,
                height: 80,
                fit: BoxFit.cover,
              ),
            ),
          ],
        );
      }
    }
    return const SizedBox();
  }

  bool _hasImageSelected() {
    if (kIsWeb) {
      return _webImageBytes != null;
    } else {
      return imagemSelecionada != null;
    }
  }

  String _getImageName() {
    if (kIsWeb) {
      return _webImageName ?? "Imagem selecionada";
    } else {
      return imagemSelecionada?.path.split('/').last ?? "Imagem selecionada";
    }
  }

  void _clearImage() {
    setState(() {
      imagemSelecionada = null;
      _webImageBytes = null;
      _webImageName = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            InkWell(
              onTap: () => Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => const MeusChamados()),
              ),
              child: const Row(
                children: [
                  Icon(Icons.arrow_back, color: Color.fromARGB(255, 8, 8, 8)),
                  SizedBox(width: 6),
                  Text(
                    "Voltar",
                    style: TextStyle(
                      color: Color.fromARGB(255, 0, 0, 0),
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Novo Chamado',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.indigo,
              ),
            ),
            const SizedBox(height: 20),
            _buildCardInformacoes(),
            const SizedBox(height: 20),
            _buildCardResumo(),
            const SizedBox(height: 20),
            _buildBotaoCriar(),
          ],
        ),
      ),
    );
  }

  Widget _buildCardInformacoes() {
    return Container(
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
            "Informações",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 4),
          const Text(
            "Insira as informações abaixo para realizar o cadastro",
            style: TextStyle(fontSize: 14, color: Colors.black54),
          ),
          const SizedBox(height: 16),
          _buildCampoTexto("Título", tituloController, "Digite o título do chamado"),
          _buildCampoDescricao(),
          _buildSeletorAtivos(),
          _buildSeletorAmbientes(),
          _buildSeletorPrioridade(),
          _buildAnexoImagem(),
        ],
      ),
    );
  }

  Widget _buildCampoTexto(String label, TextEditingController controller, String hint) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label),
        TextField(
          controller: controller,
          decoration: InputDecoration(
            border: InputBorder.none,
            hintText: hint,
            hintStyle: TextStyle(color: Colors.grey.shade400),
          ),
        ),
        Divider(color: Colors.grey.shade300),
        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildCampoDescricao() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Descrição"),
        TextField(
          controller: descricaoController,
          maxLines: 4,
          decoration: InputDecoration(
            border: InputBorder.none,
            hintText: "Digite a descrição do chamado",
            hintStyle: TextStyle(color: Colors.grey.shade400),
          ),
        ),
        Divider(color: Colors.grey.shade300),
        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildSeletorAtivos() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Ativo"),
        InkWell(
          onTap: _carregandoAtivos ? null : _mostrarSelecaoAtivos,
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 12),
            width: double.infinity,
            child: Row(
              children: [
                const Icon(Icons.devices, color: Colors.grey),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    ativoSelecionado?.name ?? "Selecionar ativo",
                    style: TextStyle(
                      color: ativoSelecionado != null ? Colors.black : Colors.grey.shade400,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (_carregandoAtivos)
                  const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                else
                  const Icon(Icons.arrow_drop_down, color: Colors.grey),
              ],
            ),
          ),
        ),
        Divider(color: Colors.grey.shade300),
        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildSeletorAmbientes() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Ambiente"),
        InkWell(
          onTap: _carregandoAmbientes ? null : _mostrarSelecaoAmbientes,
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 12),
            width: double.infinity,
            child: Row(
              children: [
                const Icon(Icons.location_on, color: Colors.grey),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    ambienteSelecionado?.name ?? "Selecionar ambiente",
                    style: TextStyle(
                      color: ambienteSelecionado != null ? Colors.black : Colors.grey.shade400,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (_carregandoAmbientes)
                  const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                else
                  const Icon(Icons.arrow_drop_down, color: Colors.grey),
              ],
            ),
          ),
        ),
        Divider(color: Colors.grey.shade300),
        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildSeletorPrioridade() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Prioridade"),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(4),
          ),
          child: DropdownButtonFormField<String>(
            value: prioridadeSelecionada,
            items: const [
              DropdownMenuItem(value: "Alta", child: Text("Alta")),
              DropdownMenuItem(value: "Médio", child: Text("Médio")),
              DropdownMenuItem(value: "Baixo", child: Text("Baixo")),
            ],
            onChanged: (value) => setState(() => prioridadeSelecionada = value),
            decoration: InputDecoration(
              border: InputBorder.none,
              hintText: "Selecione a prioridade",
              hintStyle: TextStyle(color: Colors.grey.shade400),
            ),
            dropdownColor: Colors.white,
          ),
        ),
        Divider(color: Colors.grey.shade300),
        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildAnexoImagem() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Anexar Imagem (Opcional)"),
        InkWell(
          onTap: mostrarOpcoesImagem,
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 12),
            width: double.infinity,
            child: Row(
              children: [
                Icon(Icons.attach_file, color: _hasImageSelected() ? Colors.blue : Colors.grey),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    _hasImageSelected() 
                      ? _getImageName()
                      : kIsWeb ? "Upload de imagem (Web)" : "Selecionar imagem",
                    style: TextStyle(
                      color: _hasImageSelected() ? Colors.blue : Colors.grey.shade400,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ),
        if (_hasImageSelected()) ...[
          const SizedBox(height: 8),
          _buildImagePreview(),
          const SizedBox(height: 8),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: _clearImage,
              child: const Text('Remover imagem', style: TextStyle(color: Colors.red)),
            ),
          ),
        ],
        Divider(color: Colors.grey.shade300),
      ],
    );
  }

  Widget _buildCardResumo() {
    return Container(
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
          const Text("Resumo", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          _buildItemResumo("Título", tituloController.text),
          _buildItemResumo("Descrição", descricaoController.text),
          _buildItemResumo("Ativo", ativoSelecionado?.name),
          _buildItemResumo("Ambiente", ambienteSelecionado?.name),
          _buildPrioridadeResumo(),
          _buildImagemResumo(),
        ],
      ),
    );
  }

  Widget _buildItemResumo(String label, String? valor) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("$label: ", style: const TextStyle(fontWeight: FontWeight.bold)),
          Text(valor ?? "Não informado", style: const TextStyle(color: Colors.black54)),
        ],
      )
    );
  }

  Widget _buildPrioridadeResumo() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          const Text("Prioridade: ", style: TextStyle(fontWeight: FontWeight.bold)),
          Text(
            prioridadeSelecionada ?? "Não selecionada",
            style: TextStyle(
              color: _getPrioridadeColor(prioridadeSelecionada),
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      )
    );
  }

  Widget _buildImagemResumo() {
    if (_hasImageSelected()) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Imagem: ", style: TextStyle(fontWeight: FontWeight.bold)),
          Text(
            _getImageName(), 
            style: const TextStyle(color: Colors.black54)
          ),
          _buildImagePreviewResumo(),
        ],
      );
    } else {
      return const Text(
        "Imagem: Nenhuma imagem selecionada", 
        style: TextStyle(color: Colors.grey)
      );
    }
  }

  Widget _buildBotaoCriar() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _validarCampos() ? _mostrarPopupConfirmacao : null,
        style: ElevatedButton.styleFrom(
          backgroundColor: _validarCampos() ? const Color.fromARGB(255, 0, 0, 0) : Colors.grey,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
        child: const Text("Criar Chamado", style: TextStyle(color: Colors.white)),
      ),
    );
  }

  Color _getPrioridadeColor(String? prioridade) {
    switch (prioridade) {
      case 'Alta':
        return Colors.red;
      case 'Médio':
        return Colors.orange;
      case 'Baixo':
        return Colors.green;
    }
    return Colors.black54;
  }
}