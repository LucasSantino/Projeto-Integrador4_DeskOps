import 'package:flutter/material.dart';
import '../widgets/mainlayout.dart';

class NovoChamado extends StatelessWidget {
  const NovoChamado({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text(
            'Novo Chamado',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
