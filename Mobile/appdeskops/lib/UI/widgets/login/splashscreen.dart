import 'dart:async';
import 'package:flutter/material.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  double _opacity = 0.0;

  @override
  void initState() {
    super.initState();

    // Inicia a animação de fade-in
    Timer(const Duration(milliseconds: 100), () {
      setState(() {
        _opacity = 1.0;
      });
    });

    // Timer para navegar para a tela de login após 3 segundos
    Timer(const Duration(seconds: 3), () {
      Navigator.pushReplacementNamed(context, '/login');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SizedBox.expand(
        child: AnimatedOpacity(
          opacity: _opacity,
          duration: const Duration(seconds: 3), 
          curve: Curves.easeIn,
          child: Image.asset(
            'assets/images/logodeskops.png',
            fit: BoxFit.contain,
          ),
        ),
      ),
    );
  }
}
