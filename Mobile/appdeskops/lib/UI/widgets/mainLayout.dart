import 'package:flutter/material.dart';
import 'appbar.dart';
import 'drawer.dart';

class MainLayout extends StatelessWidget {
  final Widget child;
  final VoidCallback? onNotificationTap;

  // GlobalKey para controlar o Scaffold
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  MainLayout({super.key, required this.child, this.onNotificationTap});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor:
          Colors.black, // fundo do Scaffold para destacar as bordas
      drawer: const CustomDrawer(),
      body: Column(
        children: [
          // AppBar preta
          CustomAppBar(
            onDrawerTap: () {
              _scaffoldKey.currentState?.openDrawer();
            },
            onNotificationTap: onNotificationTap ?? () {},
          ),

          // Container branco com bordas arredondadas e clip
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
