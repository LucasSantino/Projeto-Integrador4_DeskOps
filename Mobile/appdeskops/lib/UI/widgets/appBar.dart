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
                        width:
                            constraints.maxWidth *
                            0.99, // ocupação do espaço disponível
                        fit: BoxFit.contain,
                      );
                    },
                  ),
                ),
              ),

              // Ícone de notificações à direita
              IconButton(
                icon: const Icon(Icons.notifications, color: Colors.white),
                onPressed: onNotificationTap ?? () {},
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
