import 'package:flutter/material.dart';

class CustomDrawer extends StatelessWidget {
  // Removido const
  CustomDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.black,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header do Drawer
            Container(
              width: double.infinity,
              color: Colors.black,
              padding: const EdgeInsets.all(20),
              child: Center(
                child: Image.asset(
                  'assets/images/logodeskops.png',
                  width: 180,
                  fit: BoxFit.contain,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Item 1: Meus Chamados
            ListTile(
              leading: const Icon(Icons.list, color: Colors.white),
              title: const Text(
                'Meus Chamados',
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
              onTap: () {
                Navigator.pop(context); // Fecha o drawer
                Navigator.pushNamed(context, '/meus_chamados');
              },
            ),

            // Item 2: Novo Chamado
            ListTile(
              leading: const Icon(Icons.add, color: Colors.white),
              title: const Text(
                'Novo Chamado',
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/novo_chamado');
              },
            ),

            // Item 3: Perfil
            ListTile(
              leading: const Icon(Icons.person, color: Colors.white),
              title: const Text(
                'Perfil',
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/perfil_cliente');
              },
            ),

            const Spacer(),

            // Rodapé (opcional)
            Padding(
              padding: const EdgeInsets.all(20),
              child: Text(
                'DeskOps v1.0',
                style: TextStyle(color: Colors.grey.shade400, fontSize: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
