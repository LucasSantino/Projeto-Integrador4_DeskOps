import 'package:flutter/material.dart';
import 'appBar.dart';
import 'drawer.dart';

class MainLayout extends StatelessWidget {
  final Widget child;

  const MainLayout({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: CustomAppBar(
        onDrawerTap: () => Scaffold.of(context).openEndDrawer(),
        onNotificationTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Notificações em breve!")),
          );
        },
      ),
      endDrawer: const CustomDrawer(),
      body: Column(
        children: [
          // Container branco com borda arredondada
          Expanded(
            child: Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: child,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
