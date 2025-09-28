import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';

class ChamadoDetalhado extends StatelessWidget {
  const ChamadoDetalhado({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text(
            'Chamado detalhado',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
