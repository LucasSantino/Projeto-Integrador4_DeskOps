import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';
import '../widgets/drawer_tecnico.dart';

class MeusChamadosTecnico extends StatelessWidget {
  const MeusChamadosTecnico({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      drawer: const DrawerTecnico(),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: const [
            Text(
              'Meus Chamados Técnico',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 12),
            Text('Lista de chamados do técnico aqui'),
          ],
        ),
      ),
    );
  }
}
