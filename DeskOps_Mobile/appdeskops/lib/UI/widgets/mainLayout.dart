import 'package:flutter/material.dart';
import 'appbar.dart';
import 'drawer.dart'; // Drawer padrão (cliente)

class MainLayout extends StatelessWidget {
  final Widget child;
  final VoidCallback? onNotificationTap;
  final Widget? drawer; // Drawer pode ser substituído por outro

  // GlobalKey para controlar o Scaffold
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  MainLayout({
    super.key,
    required this.child,
    this.onNotificationTap,
    this.drawer,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.black,
      drawer:
          drawer ?? CustomDrawer(), // Usa o drawer padrão se nenhum for passado
      body: Column(
        children: [
          // AppBar preta
          CustomAppBar(
            onDrawerTap: () {
              _scaffoldKey.currentState?.openDrawer(); // Abre o drawer lateral
            },
            onNotificationTap: onNotificationTap,
          ),

          // Container branco com bordas arredondadas
          Expanded(
            child: ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(30),
                topRight: Radius.circular(30),
              ),
              child: Container(
                width: double.infinity,
                color: Colors.white,
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: child,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
