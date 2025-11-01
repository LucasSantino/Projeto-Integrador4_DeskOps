import 'package:flutter/material.dart';

class CustomDrawer extends StatelessWidget {
  CustomDrawer({super.key});

  // Função para confirmar a saída
  Future<void> _confirmarSaida(BuildContext context) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder:
          (context) => AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            title: const Text(
              "Confirmar Saída",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.indigo,
              ),
            ),
            content: const Text(
              "Deseja realmente sair da aplicação?",
              style: TextStyle(color: Colors.black87),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text(
                  "Cancelar",
                  style: TextStyle(color: Colors.grey),
                ),
              ),
              ElevatedButton(
                onPressed: () => Navigator.pop(context, true),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text(
                  "Sair",
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ],
          ),
    );

    if (confirm == true) {
      Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
    }
  }

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
            /*
            // Linha branca separadora
            Container(
              width: double.infinity,
              height: 1,
              color: Colors.white,
              margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            ),
            */
            const SizedBox(height: 10),

            // Lista de itens com efeito visual
            _AnimatedDrawerItem(
              icon: Icons.list,
              label: 'Meus Chamados',
              onTap:
                  (context) => Navigator.pushNamed(context, '/meus_chamados'),
            ),
            _AnimatedDrawerItem(
              icon: Icons.add,
              label: 'Novo Chamado',
              onTap: (context) => Navigator.pushNamed(context, '/novo_chamado'),
            ),
            _AnimatedDrawerItem(
              icon: Icons.person,
              label: 'Perfil',
              onTap:
                  (context) => Navigator.pushNamed(context, '/perfil_cliente'),
            ),

            const Spacer(),

            // Item Sair - ATUALIZADO COM CONFIRMAÇÃO
            _AnimatedDrawerItem(
              icon: Icons.logout,
              label: 'Sair',
              onTap: _confirmarSaida,
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
