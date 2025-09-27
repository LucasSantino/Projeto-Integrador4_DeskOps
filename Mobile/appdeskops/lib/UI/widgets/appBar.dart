import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback onDrawerTap;
  final VoidCallback onNotificationTap;

  const CustomAppBar({
    super.key,
    required this.onDrawerTap,
    required this.onNotificationTap,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.black,
      elevation: 0,
      automaticallyImplyLeading: false,
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Ícone de notificação à esquerda
          IconButton(
            icon: const Icon(Icons.notifications, color: Colors.white),
            onPressed: onNotificationTap,
          ),

          // Logo no centro
          Expanded(
            child: Center(
              child: Image.asset(
                'assets/images/logodeskops.png',
                height: 40,
                fit: BoxFit.contain,
              ),
            ),
          ),

          // Ícone do Drawer à direita
          IconButton(
            icon: const Icon(Icons.menu, color: Colors.white),
            onPressed: onDrawerTap,
          ),
        ],
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(60);
}
