import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import '../widgets/mainlayout.dart';
import 'meus_chamados.dart';

class NovoChamado extends StatefulWidget {
  const NovoChamado({super.key});

  @override
  State<NovoChamado> createState() => _NovoChamadoState();
}

class _NovoChamadoState extends State<NovoChamado> {
  final TextEditingController tituloController = TextEditingController();
  final TextEditingController descricaoController = TextEditingController();

  String? categoriaSelecionada;
  String? prioridadeSelecionada;
  String? ativoSelecionado;
  File? imagemSelecionada;

  final ImagePicker _picker = ImagePicker();

  // Lista de ativos simulados
  final List<String> ativos = [
    "Notebook Dell - LAB01",
    "Projetor Epson - SALA01",
    "Impressora HP - ESCRITORIO",
    "Computador Desktop - LAB02",
    "Tablet Samsung - AREA_COMUM",
    "Monitor LG - ESCRITORIO02",
    "Switch Cisco - REDE01",
    "Roteador TP-Link - SALA02",
  ];

  // Lista de ambientes simulados
  final List<String> ambientes = [
    "Sala de Reunião",
    "Escritório",
    "Área Comum",
    "Laboratório",
    "Auditório",
    "Copa",
    "Sala de Aula",
    "Biblioteca",
  ];

  // Função para validar se todos os campos obrigatórios estão preenchidos
  bool _validarCampos() {
    return tituloController.text.isNotEmpty &&
        descricaoController.text.isNotEmpty &&
        ativoSelecionado != null &&
        categoriaSelecionada != null &&
        prioridadeSelecionada != null;
  }

  // Função para mostrar o popup de confirmação simples
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
                // Ícone de confirmação
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

                // Título
                const Text(
                  "Confirmar Criação",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 12),

                // Mensagem
                const Text(
                  "Tem certeza que deseja criar este chamado?",
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.black54, fontSize: 16),
                ),
                const SizedBox(height: 24),

                // Botões
                Row(
                  children: [
                    // Botão Cancelar
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
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

                    // Botão Confirmar
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          _criarChamado();
                          Navigator.of(context).pop();
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

  // Função para mostrar erro de validação
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

  // Função para criar o chamado (simulada)
  void _criarChamado() {
    // Simulação de criação do chamado
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.green.shade600,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        content: const Row(
          children: [
            Icon(Icons.check_circle, color: Colors.white, size: 24),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                "Chamado criado com sucesso!",
                style: TextStyle(
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

    // Navegar de volta após um delay
    Future.delayed(const Duration(milliseconds: 2200), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const MeusChamados()),
      );
    });
  }

  Future<void> selecionarImagem({required bool daCamera}) async {
    final XFile? imagem = await _picker.pickImage(
      source: daCamera ? ImageSource.camera : ImageSource.gallery,
    );
    if (imagem != null) {
      setState(() {
        imagemSelecionada = File(imagem.path);
      });
    }
  }

  void mostrarOpcoesImagem() {
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
    List<String> ativosFiltrados = List.from(ativos);
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
      builder:
          (context) => StatefulBuilder(
            builder: (context, setModalState) {
              return Container(
                padding: const EdgeInsets.all(16),
                height: MediaQuery.of(context).size.height * 0.8,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Campo de pesquisa
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
                      onChanged: (value) {
                        setModalState(() {
                          if (value.isEmpty) {
                            ativosFiltrados = List.from(ativos);
                          } else {
                            ativosFiltrados =
                                ativos
                                    .where(
                                      (ativo) => ativo.toLowerCase().contains(
                                        value.toLowerCase(),
                                      ),
                                    )
                                    .toList();
                          }
                        });
                      },
                    ),
                    const SizedBox(height: 16),

                    // Lista de ativos
                    Expanded(
                      child:
                          ativosFiltrados.isEmpty
                              ? const Center(
                                child: Text(
                                  'Nenhum ativo encontrado',
                                  style: TextStyle(color: Colors.grey),
                                ),
                              )
                              : ListView.builder(
                                itemCount: ativosFiltrados.length,
                                itemBuilder: (context, index) {
                                  final ativo = ativosFiltrados[index];
                                  return ListTile(
                                    leading: const Icon(
                                      Icons.devices,
                                      color: Colors.black54,
                                    ),
                                    title: Text(ativo),
                                    onTap: () {
                                      setState(() {
                                        ativoSelecionado = ativo;
                                      });
                                      Navigator.pop(context);
                                    },
                                  );
                                },
                              ),
                    ),
                    const SizedBox(height: 16),

                    // Botão cancelar
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
    List<String> ambientesFiltrados = List.from(ambientes);
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
      builder:
          (context) => StatefulBuilder(
            builder: (context, setModalState) {
              return Container(
                padding: const EdgeInsets.all(16),
                height: MediaQuery.of(context).size.height * 0.8,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Campo de pesquisa
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
                      onChanged: (value) {
                        setModalState(() {
                          if (value.isEmpty) {
                            ambientesFiltrados = List.from(ambientes);
                          } else {
                            ambientesFiltrados =
                                ambientes
                                    .where(
                                      (ambiente) => ambiente
                                          .toLowerCase()
                                          .contains(value.toLowerCase()),
                                    )
                                    .toList();
                          }
                        });
                      },
                    ),
                    const SizedBox(height: 16),

                    // Lista de ambientes
                    Expanded(
                      child:
                          ambientesFiltrados.isEmpty
                              ? const Center(
                                child: Text(
                                  'Nenhum ambiente encontrado',
                                  style: TextStyle(color: Colors.grey),
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
                                    title: Text(ambiente),
                                    onTap: () {
                                      setState(() {
                                        categoriaSelecionada = ambiente;
                                      });
                                      Navigator.pop(context);
                                    },
                                  );
                                },
                              ),
                    ),
                    const SizedBox(height: 16),

                    // Botão cancelar
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

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Botão Voltar
            InkWell(
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const MeusChamados()),
                );
              },
              child: Row(
                children: const [
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

            // Título
            const Text(
              'Novo Chamado',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.indigo,
              ),
            ),
            const SizedBox(height: 20),

            // Card Informações
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
                    "Informações",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    "Insira as informações abaixo para realizar o cadastro",
                    style: TextStyle(fontSize: 14, color: Colors.black54),
                  ),
                  const SizedBox(height: 16),

                  // Título
                  const Text("Título"),
                  TextField(
                    controller: tituloController,
                    decoration: InputDecoration(
                      border: InputBorder.none,
                      hintText: "Digite o título do chamado",
                      hintStyle: TextStyle(color: Colors.grey.shade400),
                    ),
                  ),
                  Divider(color: Colors.grey.shade300),
                  const SizedBox(height: 12),

                  // Descrição
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

                  // Seletor de Ativos
                  const Text("Ativo"),
                  InkWell(
                    onTap: _mostrarSelecaoAtivos,
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      width: double.infinity,
                      child: Row(
                        children: [
                          const Icon(Icons.devices, color: Colors.grey),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              ativoSelecionado ?? "Selecionar ativo",
                              style: TextStyle(
                                color:
                                    ativoSelecionado != null
                                        ? Colors.black
                                        : Colors.grey.shade400,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const Icon(Icons.arrow_drop_down, color: Colors.grey),
                        ],
                      ),
                    ),
                  ),
                  Divider(color: Colors.grey.shade300),
                  const SizedBox(height: 12),

                  // Ambiente
                  const Text("Ambiente"),
                  InkWell(
                    onTap: _mostrarSelecaoAmbientes,
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      width: double.infinity,
                      child: Row(
                        children: [
                          const Icon(Icons.location_on, color: Colors.grey),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              categoriaSelecionada ?? "Selecionar ambiente",
                              style: TextStyle(
                                color:
                                    categoriaSelecionada != null
                                        ? Colors.black
                                        : Colors.grey.shade400,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const Icon(Icons.arrow_drop_down, color: Colors.grey),
                        ],
                      ),
                    ),
                  ),
                  Divider(color: Colors.grey.shade300),
                  const SizedBox(height: 12),

                  // Prioridade
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
                      onChanged: (value) {
                        setState(() {
                          prioridadeSelecionada = value;
                        });
                      },
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

                  // Anexo de imagem
                  const Text("Anexar Imagem"),
                  InkWell(
                    onTap: mostrarOpcoesImagem,
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      width: double.infinity,
                      child: Row(
                        children: [
                          const Icon(Icons.attach_file, color: Colors.grey),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              imagemSelecionada != null
                                  ? imagemSelecionada!.path.split('/').last
                                  : "Selecionar imagem",
                              style: TextStyle(
                                color:
                                    imagemSelecionada != null
                                        ? Colors.black
                                        : Colors.grey.shade400,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  Divider(color: Colors.grey.shade300),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Card Resumo
            ValueListenableBuilder<TextEditingValue>(
              valueListenable: tituloController,
              builder: (context, tituloValue, child) {
                return ValueListenableBuilder<TextEditingValue>(
                  valueListenable: descricaoController,
                  builder: (context, descricaoValue, child) {
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
                            "Resumo",
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Título
                          const Text("Título"),
                          Text(
                            tituloValue.text.isEmpty
                                ? "Título do chamado"
                                : tituloValue.text,
                            style: const TextStyle(color: Colors.black54),
                          ),
                          const SizedBox(height: 12),

                          // Descrição
                          const Text("Descrição"),
                          Text(
                            descricaoValue.text.isEmpty
                                ? "Descrição do chamado"
                                : descricaoValue.text,
                            style: const TextStyle(color: Colors.black54),
                          ),
                          const SizedBox(height: 12),

                          // Ativo
                          const Text("Ativo"),
                          Text(
                            ativoSelecionado ?? "Nenhum selecionado",
                            style: const TextStyle(color: Colors.black54),
                          ),
                          const SizedBox(height: 12),

                          // Ambiente
                          const Text("Ambiente"),
                          Text(
                            categoriaSelecionada ?? "Nenhum selecionado",
                            style: const TextStyle(color: Colors.black54),
                          ),
                          const SizedBox(height: 12),

                          // Prioridade
                          const Text("Prioridade"),
                          Text(
                            prioridadeSelecionada ?? "Nenhuma selecionada",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: _getPrioridadeColor(prioridadeSelecionada),
                            ),
                          ),
                          const SizedBox(height: 12),

                          // Imagem
                          const Text("Imagem"),
                          if (imagemSelecionada != null) ...[
                            Text(
                              imagemSelecionada!.path.split('/').last,
                              style: const TextStyle(color: Colors.black54),
                            ),
                            const SizedBox(height: 8),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.file(
                                imagemSelecionada!,
                                height: 100,
                                fit: BoxFit.cover,
                              ),
                            ),
                          ] else
                            const Text(
                              "Nenhuma imagem selecionada",
                              style: TextStyle(color: Colors.black54),
                            ),
                        ],
                      ),
                    );
                  },
                );
              },
            ),

            const SizedBox(height: 20),

            // Botão Criar Chamado
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _mostrarPopupConfirmacao,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 0, 0, 0),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  "Criar Chamado",
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Função para obter cor baseada na prioridade
  Color _getPrioridadeColor(String? prioridade) {
    switch (prioridade) {
      case 'Alta':
        return Colors.red;
      case 'Médio':
        return Colors.orange;
      case 'Baixo':
        return Colors.green;
      default:
        return Colors.black54;
    }
  }
}
