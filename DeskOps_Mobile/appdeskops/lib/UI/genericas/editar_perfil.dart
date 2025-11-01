import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import '../widgets/mainLayout.dart';

class EditarPerfil extends StatefulWidget {
  const EditarPerfil({super.key});

  @override
  State<EditarPerfil> createState() => _EditarPerfilState();
}

class _EditarPerfilState extends State<EditarPerfil> {
  final TextEditingController nomeController = TextEditingController(
    text: "Lucas Santino da Silva",
  );
  final TextEditingController emailController = TextEditingController(
    text: "usuario@email.com",
  );
  final TextEditingController cargoController = TextEditingController(
    text: "Desenvolvedor",
  );
  final TextEditingController nascimentoController = TextEditingController(
    text: "01/01/2000",
  );
  final TextEditingController cpfController = TextEditingController(
    text: "000.000.000-00",
  );
  final TextEditingController telefoneController = TextEditingController(
    text: "(00) 00000-0000",
  );
  final TextEditingController enderecoController = TextEditingController(
    text: "Rua Exemplo, 123",
  );
  final TextEditingController senhaController = TextEditingController(
    text: "********",
  );
  final TextEditingController confirmarSenhaController = TextEditingController(
    text: "********",
  );

  final ImagePicker _picker = ImagePicker();
  File? _imagemSelecionada;
  bool _mostrarSenha = false;
  bool _mostrarConfirmarSenha = false;

  Future<void> _selecionarImagem() async {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white, // Fundo branco
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library, color: Colors.indigo),
                title: const Text('Escolher da galeria'),
                onTap: () async {
                  Navigator.of(context).pop();
                  final XFile? imagem = await _picker.pickImage(
                    source: ImageSource.gallery,
                    imageQuality: 80,
                  );
                  if (imagem != null) {
                    setState(() {
                      _imagemSelecionada = File(imagem.path);
                    });
                  }
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt, color: Colors.indigo),
                title: const Text('Tirar foto'),
                onTap: () async {
                  Navigator.of(context).pop();
                  final XFile? imagem = await _picker.pickImage(
                    source: ImageSource.camera,
                    imageQuality: 80,
                  );
                  if (imagem != null) {
                    setState(() {
                      _imagemSelecionada = File(imagem.path);
                    });
                  }
                },
              ),
              ListTile(
                leading: const Icon(Icons.cancel, color: Colors.red),
                title: const Text('Cancelar'),
                onTap: () => Navigator.of(context).pop(),
              ),
            ],
          ),
        );
      },
    );
  }

  void _mostrarDialogoConfirmacao() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.white, // Fundo branco
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Row(
                  children: [
                    Icon(Icons.check_circle, color: Colors.green, size: 24),
                    SizedBox(width: 8),
                    Text(
                      "Confirmação",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.indigo,
                        fontSize: 18,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text(
                  "Tem certeza que deseja salvar as alterações do perfil?",
                  style: TextStyle(fontSize: 16),
                  textAlign: TextAlign.left,
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child: const Text(
                        "Cancelar",
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pop(); // Fecha o diálogo
                        Navigator.pop(context); // Volta para a tela anterior
                        // Aqui você pode adicionar a lógica para salvar os dados
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color.fromARGB(255, 0, 0, 0),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        "Confirmar",
                        style: TextStyle(color: Colors.white),
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

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Botão Voltar
              TextButton.icon(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.arrow_back, color: Colors.black),
                label: const Text(
                  "Voltar",
                  style: TextStyle(color: Colors.black),
                ),
              ),

              const SizedBox(height: 10),

              // Título
              const Text(
                'Editar Perfil',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.indigo,
                ),
              ),

              const SizedBox(height: 20),

              // Card estilo chamados
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 22,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: Colors.grey.shade300, width: 1),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0x269E9E9E),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Foto com opção de upload
                    Row(
                      children: [
                        GestureDetector(
                          onTap: _selecionarImagem,
                          child: Stack(
                            children: [
                              CircleAvatar(
                                radius: 40,
                                backgroundImage:
                                    _imagemSelecionada != null
                                        ? FileImage(_imagemSelecionada!)
                                        : const AssetImage(
                                              'assets/images/user.jpg',
                                            )
                                            as ImageProvider,
                              ),
                              Positioned(
                                bottom: 0,
                                right: 0,
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: const BoxDecoration(
                                    color: Colors.indigo,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.camera_alt,
                                    color: Colors.white,
                                    size: 16,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 18),
                        Expanded(
                          child: TextField(
                            controller: nomeController,
                            decoration: const InputDecoration(
                              labelText: "Nome Completo",
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // Campos editáveis - espaçamento reduzido
                    _campo("Email", emailController),
                    const SizedBox(height: 12),
                    _campo("Cargo", cargoController),
                    const SizedBox(height: 12),
                    _campo("Data de Nascimento", nascimentoController),
                    const SizedBox(height: 12),
                    _campo("CPF", cpfController),
                    const SizedBox(height: 12),
                    _campo("Telefone", telefoneController),
                    const SizedBox(height: 12),
                    _campo("Endereço", enderecoController),
                    const SizedBox(height: 12),

                    // Campo Senha com ícone de visualização
                    TextField(
                      controller: senhaController,
                      obscureText: !_mostrarSenha,
                      decoration: InputDecoration(
                        labelText: "Senha",
                        labelStyle: const TextStyle(color: Colors.black54),
                        border: InputBorder.none,
                        suffixIcon: IconButton(
                          icon: Icon(
                            _mostrarSenha
                                ? Icons.visibility
                                : Icons.visibility_off,
                            color: Colors.grey,
                          ),
                          onPressed: () {
                            setState(() {
                              _mostrarSenha = !_mostrarSenha;
                            });
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Campo Confirmar Senha
                    TextField(
                      controller: confirmarSenhaController,
                      obscureText: !_mostrarConfirmarSenha,
                      decoration: InputDecoration(
                        labelText: "Confirmar Senha",
                        labelStyle: const TextStyle(color: Colors.black54),
                        border: InputBorder.none,
                        suffixIcon: IconButton(
                          icon: Icon(
                            _mostrarConfirmarSenha
                                ? Icons.visibility
                                : Icons.visibility_off,
                            color: Colors.grey,
                          ),
                          onPressed: () {
                            setState(() {
                              _mostrarConfirmarSenha = !_mostrarConfirmarSenha;
                            });
                          },
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Botão Salvar
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.black,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        onPressed: _mostrarDialogoConfirmacao,
                        icon: const Icon(Icons.save, color: Colors.white),
                        label: const Text(
                          "Salvar Alterações",
                          style: TextStyle(color: Colors.white, fontSize: 16),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _campo(
    String label,
    TextEditingController controller, {
    bool senha = false,
  }) {
    return TextField(
      controller: controller,
      obscureText: senha,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.black54),
        border: InputBorder.none,
      ),
    );
  }
}
