import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';
import '../widgets/drawer_tecnico.dart';
import 'detalhes_ativos.dart'; // Import da tela de destino

class LeitorQrcode extends StatelessWidget {
  const LeitorQrcode({super.key});

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      drawer: const DrawerTecnico(),
      child: Stack(
        children: [
          // Fundo cinza provisório ocupando todo o container branco
          Container(
            width: double.infinity,
            height: double.infinity,
            color: Colors.grey.shade300,
          ),

          // Quadrado central "aberto" simulando a área de leitura
          Center(
            child: Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                color: Colors.transparent,
                border: Border.all(color: Colors.white, width: 3),
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),

          // Texto e botão abaixo
          Positioned(
            bottom: 40,
            left: 20,
            right: 20,
            child: Column(
              children: [
                const Text(
                  "QR Code",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  "Área de leitura de QR Code",
                  style: TextStyle(fontSize: 16, color: Colors.black54),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: () {
                      // Redireciona para detalhes_ativos.dart
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const DetalhesAtivos(),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      "Confirmar",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
