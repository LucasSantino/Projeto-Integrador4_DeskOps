import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';

class EditarPerfil extends StatefulWidget {
  const EditarPerfil({super.key});

  @override
  State<EditarPerfil> createState() => _EditarPerfilState();
}

class _EditarPerfilState extends State<EditarPerfil> {
  final TextEditingController nomeController = TextEditingController(text: "Nome Completo do Usuário");
  final TextEditingController emailController = TextEditingController(text: "usuario@email.com");
  final TextEditingController nascimentoController = TextEditingController(text: "01/01/2000");
  final TextEditingController cpfController = TextEditingController(text: "000.000.000-00");
  final TextEditingController telefoneController = TextEditingController(text: "(00) 00000-0000");
  final TextEditingController enderecoController = TextEditingController(text: "Rua Exemplo, 123");
  final TextEditingController senhaController = TextEditingController(text: "********");

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Botão Voltar
            TextButton.icon(
              onPressed: () {
                Navigator.pop(context);
              },
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

            // Card com campos editáveis
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 0),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.2),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
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
                  TextField(
                    controller: emailController,
                    decoration: const InputDecoration(
                      labelText: "Email",
                      border: InputBorder.none,
                    ),
                  ),
                  const SizedBox(height: 14),

                  TextField(
                    controller: nascimentoController,
                    decoration: const InputDecoration(
                      labelText: "Data de Nascimento",
                      border: InputBorder.none,
                    ),
                  ),
                  const SizedBox(height: 14),

                  TextField(
                    controller: cpfController,
                    decoration: const InputDecoration(
                      labelText: "CPF",
                      border: InputBorder.none,
                    ),
                  ),
                  const SizedBox(height: 14),

                  TextField(
                    controller: telefoneController,
                    decoration: const InputDecoration(
                      labelText: "Telefone",
                      border: InputBorder.none,
                    ),
                  ),
                  const SizedBox(height: 14),

                  TextField(
                    controller: enderecoController,
                    decoration: const InputDecoration(
                      labelText: "Endereço",
                      border: InputBorder.none,
                    ),
                  ),
                  const SizedBox(height: 14),

                  TextField(
                    controller: senhaController,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: "Senha",
                      border: InputBorder.none,
                    ),
                  ),

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
                      onPressed: () {
                        // ação salvar alterações
                        Navigator.pop(context); // voltar após salvar (temporário)
                      },
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
    );
  }
}
