import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';

class Perfil extends StatelessWidget {
  const Perfil({super.key});

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
              'Meu perfil',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.indigo, // dark blue
              ),
            ),

            const SizedBox(height: 20),

            // Card com informações
            Container(
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
                      const Text(
                        "Nome Completo do Usuário",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 28),

                  // Informações
                  const Text(
                    "Email",
                    style: TextStyle(color: Colors.black54),
                  ),
                  const SizedBox(height: 4),
                  const Text("usuario@email.com"),
                  const SizedBox(height: 14),

                  const Text(
                    "Data de Nascimento",
                    style: TextStyle(color: Colors.black54),
                  ),
                  const SizedBox(height: 4),
                  const Text("01/01/2000"),
                  const SizedBox(height: 14),

                  const Text(
                    "CPF",
                    style: TextStyle(color: Colors.black54),
                  ),
                  const SizedBox(height: 4),
                  const Text("000.000.000-00"),
                  const SizedBox(height: 14),

                  const Text(
                    "Telefone",
                    style: TextStyle(color: Colors.black54),
                  ),
                  const SizedBox(height: 4),
                  const Text("(00) 00000-0000"),
                  const SizedBox(height: 14),

                  const Text(
                    "Endereço",
                    style: TextStyle(color: Colors.black54),
                  ),
                  const SizedBox(height: 4),
                  const Text("Rua Exemplo, 123"),
                  const SizedBox(height: 14),

                  const Text(
                    "Senha",
                    style: TextStyle(color: Colors.black54),
                  ),
                  const SizedBox(height: 4),
                  const Text("********"),

                  const SizedBox(height: 28),

                  // Botão Editar
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
                        // ação editar
                      },
                      icon: const Icon(Icons.edit, color: Colors.white),
                      label: const Text(
                        "Editar Informações",
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
