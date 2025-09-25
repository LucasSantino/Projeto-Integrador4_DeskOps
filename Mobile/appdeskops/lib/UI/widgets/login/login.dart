import 'package:flutter/material.dart';

class Login extends StatelessWidget {
  const Login({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.black,
      body: Column(
        children: [
          // Parte superior preta com imagem
          Container(
            width: size.width,
            height: size.height * 0.20, // 35% da tela
            color: Colors.black,
            child: Center(
              child: Image.asset(
                'assets/images/logodeskops.png',
                width: size.width * 0.99,
                fit: BoxFit.contain,
              ),
            ),
          ),

          // Parte inferior branca com bordas arredondadas
          Expanded(
            child: Container(
              width: size.width,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Text(
                      'Bem-vindo!',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 20),
                    // Aqui futuramente iremos adicionar os campos de login
                    Text('Campos de login vão aqui'),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
