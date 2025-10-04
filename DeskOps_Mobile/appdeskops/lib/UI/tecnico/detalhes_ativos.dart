import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';
import '../widgets/drawer_tecnico.dart';

class DetalhesAtivos extends StatelessWidget {
  const DetalhesAtivos({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      drawer: DrawerTecnico(),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Text(
              'Detalhes de Ativos',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 12),
            Text('Conteúdo dos detalhes de ativos aqui'),
          ],
        ),
      ),
    );
  }
}
