import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback? onDrawerTap;
  final VoidCallback? onNotificationTap;

  const CustomAppBar({
    super.key,
    this.onDrawerTap,
    this.onNotificationTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black,
      padding: const EdgeInsets.symmetric(horizontal: 15),
      child: SafeArea(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Ícone de notificações à esquerda
            IconButton(
              icon: const Icon(Icons.notifications, color: Colors.white),
              onPressed: onNotificationTap ?? () {},
            ),

            // Logo central
            Image.asset(
              'assets/images/logodeskops.png',
              width: 120,
              fit: BoxFit.contain,
            ),

            // Ícone do drawer à direita
            IconButton(
              icon: const Icon(Icons.menu, color: Colors.white),
              onPressed: onDrawerTap ?? () {},
            ),
          ],
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(70);
}
