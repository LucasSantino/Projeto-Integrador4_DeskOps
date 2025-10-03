import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback? onDrawerTap;
  final VoidCallback? onNotificationTap;

  const CustomAppBar({super.key, this.onDrawerTap, this.onNotificationTap});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black,
      padding: const EdgeInsets.symmetric(horizontal: 15),
      child: SafeArea(
        child: SizedBox(
          height: preferredSize.height,
          child: Row(
            children: [
              // Ícone do drawer à esquerda
              IconButton(
                icon: const Icon(Icons.menu, color: Colors.white),
                onPressed: onDrawerTap ?? () {},
              ),

              // Espaço flexível para a logo central
              Expanded(
                child: Center(
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      return Image.asset(
                        'assets/images/logodeskops.png',
                        width: constraints.maxWidth * 0.99,
                        fit: BoxFit.contain,
                      );
                    },
                  ),
                ),
              ),

              // Ícone de notificações à direita
              IconButton(
                icon: const Icon(Icons.notifications, color: Colors.white),
                onPressed: () {
                  // Executa callback extra (se houver)
                  try {
                    onNotificationTap?.call();
                  } catch (_) {
                    // silencia qualquer erro do callback (opcional)
                  }
                  // Navega para a tela de notificações (rota deve existir em main.dart)
                  Navigator.pushNamed(context, '/notificacoes');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(70);
}
