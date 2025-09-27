import 'package:flutter/material.dart';
import '../widgets/mainlayout.dart';

class MeusChamados extends StatelessWidget {
  const MeusChamados({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text(
            'Meus Chamados',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 20),
          Text(
            'Aqui será exibida a lista de chamados do cliente.',
            style: TextStyle(fontSize: 16),
          ),
        ],
      ),
    );
  }
}
