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
  File? imagemSelecionada;

  final ImagePicker _picker = ImagePicker();

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

                  // Ambiente (antiga Categoria)
                  const Text("Ambiente"),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: DropdownButtonFormField<String>(
                      value: categoriaSelecionada,
                      items: const [
                        DropdownMenuItem(
                          value: "Sala de Reunião",
                          child: Text("Sala de Reunião"),
                        ),
                        DropdownMenuItem(
                          value: "Escritório",
                          child: Text("Escritório"),
                        ),
                        DropdownMenuItem(
                          value: "Área Comum",
                          child: Text("Área Comum"),
                        ),
                        DropdownMenuItem(
                          value: "Laboratório",
                          child: Text("Laboratório"),
                        ),
                      ],
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

                  // Prioridade (NOVO)
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

            // Card Resumo (ATUALIZADO)
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

                  // Prioridade (NOVO) - CORRIGIDO
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

            // Botão Criar Chamado
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {},
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
