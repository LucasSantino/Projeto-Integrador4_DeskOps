import 'package:flutter/material.dart';

class CustomDrawer extends StatelessWidget {
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
                  'assets/images/iconedeskops.png',
                  width: 180,
                  fit: BoxFit.contain,
                ),
              ),
            ),

            // Linha branca separadora
            Container(
              width: double.infinity,
              height: 1,
              color: Colors.white,
              margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            ),

            const SizedBox(height: 10),

            // Lista de itens com efeito visual
            _drawerItem(
              context,
              icon: Icons.list,
              label: 'Meus Chamados',
              routeName: '/meus_chamados',
            ),
            _drawerItem(
              context,
              icon: Icons.add,
              label: 'Novo Chamado',
              routeName: '/novo_chamado',
            ),
            _drawerItem(
              context,
              icon: Icons.person,
              label: 'Perfil',
              routeName: '/perfil_cliente',
            ),

            const Spacer(),

            // Item Sair
            _drawerItem(
              context,
              icon: Icons.logout,
              label: 'Sair',
              routeName: '/login',
              isLogout: true,
            ),

            // Rodapé
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

  Widget _drawerItem(
    BuildContext context, {
    required IconData icon,
    required String label,
    required String routeName,
    bool isLogout = false,
  }) {
    return InkWell(
      onTap: () {
        Navigator.pop(context);
        if (isLogout) {
          Navigator.pushNamedAndRemoveUntil(
            context,
            routeName,
            (route) => false,
          );
        } else {
          Navigator.pushNamed(context, routeName);
        }
      },
      splashColor: Colors.white24, // efeito ao tocar
      highlightColor: Colors.white10, // efeito ao manter pressionado
      hoverColor: Colors.white12, // efeito ao passar mouse (web/desktop)
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            Icon(icon, color: Colors.white),
            const SizedBox(width: 16),
            Text(
              label,
              style: const TextStyle(color: Colors.white, fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
