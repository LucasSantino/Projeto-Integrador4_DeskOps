import 'package:flutter/material.dart';

class NovoChamado extends StatelessWidget {
  const NovoChamado({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Novo Chamado')),
      body: const Center(child: Text('Novo Chamado')),
    );
  }
}
