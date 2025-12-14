import 'package:flutter/material.dart';

class DrawerTecnico extends StatelessWidget {
  const DrawerTecnico({super.key});

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
            const SizedBox(height: 10),

            // Lista de itens com efeito visual
            _AnimatedDrawerItem(
              icon: Icons.dashboard,
              label: 'Dashboard',
              onTap: (context) => Navigator.pushNamed(context, '/dashboard'),
            ),
            _AnimatedDrawerItem(
              icon: Icons.list,
              label: 'Meus Chamados',
              onTap:
                  (context) =>
                      Navigator.pushNamed(context, '/chamados_tecnico'),
            ),

            _AnimatedDrawerItem(
              icon: Icons.qr_code,
              label: 'QR Code',
              onTap: (context) => Navigator.pushNamed(context, '/leitor_qrcode'),
            ),

            _AnimatedDrawerItem(
              icon: Icons.person,
              label: 'Perfil',
              onTap:
                  (context) => Navigator.pushNamed(context, '/perfil_tecnico'),
            ),

            const Spacer(),

            // Item Sair
            _AnimatedDrawerItem(
              icon: Icons.logout,
              label: 'Sair',
              onTap:
                  (context) => Navigator.pushNamedAndRemoveUntil(
                    context,
                    '/login',
                    (route) => false,
                  ),
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
}

// Widget animado para os itens do Drawer
class _AnimatedDrawerItem extends StatefulWidget {
  final IconData icon;
  final String label;
  final void Function(BuildContext) onTap;

  const _AnimatedDrawerItem({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  State<_AnimatedDrawerItem> createState() => _AnimatedDrawerItemState();
}

class _AnimatedDrawerItemState extends State<_AnimatedDrawerItem> {
  bool _isPressed = false;

  void _handleTapDown(_) => setState(() => _isPressed = true);
  void _handleTapUp(_) => setState(() => _isPressed = false);
  void _handleTapCancel() => setState(() => _isPressed = false);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => widget.onTap(context),
      onTapDown: _handleTapDown,
      onTapUp: _handleTapUp,
      onTapCancel: _handleTapCancel,
      child: AnimatedScale(
        scale: _isPressed ? 0.95 : 1.0,
        duration: const Duration(milliseconds: 100),
        curve: Curves.easeOut,
        child: MouseRegion(
          cursor: SystemMouseCursors.click,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(8)),
            child: Row(
              children: [
                Icon(widget.icon, color: Colors.white),
                const SizedBox(width: 16),
                Text(
                  widget.label,
                  style: const TextStyle(color: Colors.white, fontSize: 16),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
