import 'package:flutter/material.dart';
import '../widgets/mainlayout.dart';

class NovoChamado extends StatefulWidget {
  const NovoChamado({super.key});

  @override
  State<NovoChamado> createState() => _NovoChamadoState();
}

class _NovoChamadoState extends State<NovoChamado> {
  final TextEditingController tituloController = TextEditingController();
  final TextEditingController descricaoController = TextEditingController();

  String? categoriaSelecionada;
  String? imagemSelecionada; // Nome do arquivo (simulação)

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Novo Chamado',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.indigo, // dark/blue
              ),
            ),
            const SizedBox(height: 20),

            // Card de Informações
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

                  // Campo Título
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

                  // Campo Descrição
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

                  // Campo Categoria
                  const Text("Categoria de Serviço"),
                  DropdownButtonFormField<String>(
                    value: categoriaSelecionada,
                    items: const [
                      DropdownMenuItem(
                        value: "Erro de Rede",
                        child: Text("Erro de Rede"),
                      ),
                      DropdownMenuItem(
                        value: "Problema em Impressora",
                        child: Text("Problema em Impressora"),
                      ),
                      DropdownMenuItem(
                        value: "Falha de Sistema",
                        child: Text("Falha de Sistema"),
                      ),
                    ],
                    onChanged: (value) {
                      setState(() {
                        categoriaSelecionada = value;
                      });
                    },
                    decoration: InputDecoration(
                      border: InputBorder.none,
                      hintText: "Selecione a categoria de atendimento",
                      hintStyle: TextStyle(color: Colors.grey.shade400),
                    ),
                  ),
                  Divider(color: Colors.grey.shade300),

                  const SizedBox(height: 12),

                  // Campo Anexar Imagem
                  const Text("Anexar Imagem"),
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: () {
                      // Aqui no futuro pode abrir FilePicker
                      setState(() {
                        imagemSelecionada = "screenshot.png"; // simulação
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 12,
                        horizontal: 16,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade200,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.upload_file, color: Colors.black54),
                          const SizedBox(width: 8),
                          const Text(
                            "Selecionar imagem",
                            style: TextStyle(color: Colors.black54),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    imagemSelecionada ?? "Nenhuma imagem selecionada",
                    style: const TextStyle(color: Colors.black54, fontSize: 13),
                  ),
                  Divider(color: Colors.grey.shade300),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Card de Resumo
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

                  const Text("Detalhes"),
                  Text(
                    tituloController.text.isEmpty
                        ? "Título do chamado"
                        : tituloController.text,
                    style: const TextStyle(color: Colors.black54),
                  ),
                  const SizedBox(height: 12),

                  const Text("Categoria de Serviço"),
                  Text(
                    categoriaSelecionada ?? "Nenhuma selecionada",
                    style: const TextStyle(color: Colors.black54),
                  ),
                  const SizedBox(height: 12),

                  const Text("Imagem"),
                  Text(
                    imagemSelecionada ?? "Nenhuma imagem anexada",
                    style: const TextStyle(color: Colors.black54),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Botão Criar Chamado
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Ação de criar chamado
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.grey.shade600,
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
}
