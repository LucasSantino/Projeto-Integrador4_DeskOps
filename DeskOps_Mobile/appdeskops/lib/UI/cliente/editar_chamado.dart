import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import '../widgets/mainlayout.dart';
import 'chamado_detalhado.dart'; // NOVO: importar a tela de detalhes

class EditarChamado extends StatefulWidget {
  final String tituloInicial;
  final String descricaoInicial;
  final String? categoriaInicial;
  final String? prioridadeInicial;
  final File? imagemInicial;

  const EditarChamado({
    super.key,
    required this.tituloInicial,
    required this.descricaoInicial,
    this.categoriaInicial,
    this.prioridadeInicial,
    this.imagemInicial,
  });

  @override
  State<EditarChamado> createState() => _EditarChamadoState();
}

class _EditarChamadoState extends State<EditarChamado> {
  late TextEditingController tituloController;
  late TextEditingController descricaoController;

  String? categoriaSelecionada;
  String? prioridadeSelecionada;
  File? imagemSelecionada;

  final ImagePicker _picker = ImagePicker();

  // Listas para os dropdowns
  final List<String> ambientes = [
    "Sala de Reunião",
    "Escritório",
    "Área Comum",
    "Laboratório",
  ];

  final List<String> prioridades = ["Alta", "Médio", "Baixo"];

  @override
  void initState() {
    super.initState();
    tituloController = TextEditingController(text: widget.tituloInicial);
    descricaoController = TextEditingController(text: widget.descricaoInicial);
    categoriaSelecionada = widget.categoriaInicial;
    prioridadeSelecionada = widget.prioridadeInicial;
    imagemSelecionada = widget.imagemInicial;
  }

  // Função para obter cor baseada na prioridade
  Color _getPrioridadeColor(String? prioridade) {
    switch (prioridade?.toLowerCase()) {
      case 'alta':
        return Colors.red;
      case 'médio':
        return Colors.orange;
      case 'baixo':
        return Colors.green;
      default:
        return Colors.black54;
    }
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

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Botão Voltar - CORRIGIDO: volta para ChamadoDetalhado
            InkWell(
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ChamadoDetalhado(), // CORREÇÃO
                  ),
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
              'Editar Chamado',
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
                    "Edite as informações abaixo do chamado",
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
                    onChanged: (value) => setState(() {}),
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
                    onChanged: (value) => setState(() {}),
                  ),
                  Divider(color: Colors.grey.shade300),
                  const SizedBox(height: 12),

                  // Ambiente
                  const Text("Ambiente"),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: DropdownButtonFormField<String>(
                      value: categoriaSelecionada,
                      items:
                          ambientes.map((ambiente) {
                            return DropdownMenuItem<String>(
                              value: ambiente,
                              child: Text(ambiente),
                            );
                          }).toList(),
                      onChanged: (value) {
                        setState(() {
                          categoriaSelecionada = value;
                        });
                      },
                      decoration: InputDecoration(
                        border: InputBorder.none,
                        hintText: "Selecione o ambiente",
                        hintStyle: TextStyle(color: Colors.grey.shade400),
                      ),
                      dropdownColor: Colors.white,
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
                      items:
                          prioridades.map((prioridade) {
                            return DropdownMenuItem<String>(
                              value: prioridade,
                              child: Text(prioridade),
                            );
                          }).toList(),
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
                    "Resumo",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),

                  // Título
                  const Text("Título"),
                  Text(
                    tituloController.text.isEmpty
                        ? "Título do chamado"
                        : tituloController.text,
                    style: const TextStyle(color: Colors.black54),
                  ),
                  const SizedBox(height: 12),

                  // Descrição
                  const Text("Descrição"),
                  Text(
                    descricaoController.text.isEmpty
                        ? "Descrição do chamado"
                        : descricaoController.text,
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
            ),

            const SizedBox(height: 20),

            // Botão Salvar Alterações - CORRIGIDO: volta para ChamadoDetalhado
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Aqui você pode implementar a função de salvar alterações
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder:
                          (context) => const ChamadoDetalhado(), // CORREÇÃO
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 0, 0, 0),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  "Salvar Alterações",
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
