import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';

class EditarPerfil extends StatefulWidget {
  const EditarPerfil({super.key});

  @override
  State<EditarPerfil> createState() => _EditarPerfilState();
}

class _EditarPerfilState extends State<EditarPerfil> {
  final TextEditingController nomeController = TextEditingController(
    text: "Nome Completo do Usuário",
  );
  final TextEditingController emailController = TextEditingController(
    text: "usuario@email.com",
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
                      color: Colors.grey.withOpacity(0.15),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Foto e nome
                    Row(
                      children: [
                        const CircleAvatar(
                          radius: 40,
                          backgroundImage: AssetImage('assets/images/user.jpg'),
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

                    const SizedBox(height: 28),

                    // Campos editáveis
                    _campo("Email", emailController),
                    _campo("Data de Nascimento", nascimentoController),
                    _campo("CPF", cpfController),
                    _campo("Telefone", telefoneController),
                    _campo("Endereço", enderecoController),
                    _campo("Senha", senhaController, senha: true),

                    const SizedBox(height: 28),

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
                        onPressed: () => Navigator.pop(context),
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
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: TextField(
        controller: controller,
        obscureText: senha,
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(color: Colors.black54),
          border: InputBorder.none,
        ),
      ),
    );
  }
}
