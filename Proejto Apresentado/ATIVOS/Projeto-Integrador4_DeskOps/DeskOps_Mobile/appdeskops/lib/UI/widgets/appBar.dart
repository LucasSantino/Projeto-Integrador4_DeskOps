import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback? onDrawerTap;
  final VoidCallback? onNotificationTap;
  final bool hasUnreadNotifications; // indica se há notificações não lidas

  const CustomAppBar({
    super.key,
    this.onDrawerTap,
    this.onNotificationTap,
    this.hasUnreadNotifications = false,
  });

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

              // Ícone de notificações à direita com bolinha de alerta
              Stack(
                children: [
                  IconButton(
                    icon: const Icon(Icons.notifications, color: Colors.white),
                    onPressed: () {
                      // Executa callback extra (se houver)
                      try {
                        onNotificationTap?.call();
                      } catch (_) {}
                      // Navega para a tela de notificações
                      Navigator.pushNamed(context, '/notificacoes');
                    },
                  ),
                  if (hasUnreadNotifications)
                    Positioned(
                      right: 12,
                      top: 12,
                      child: Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                ],
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
