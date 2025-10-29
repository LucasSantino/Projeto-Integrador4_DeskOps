import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../widgets/mainLayout.dart';
import '../widgets/drawer_tecnico.dart';
import 'detalhes_ativos.dart';

class LeitorQrcode extends StatefulWidget {
  const LeitorQrcode({super.key});

  @override
  State<LeitorQrcode> createState() => _LeitorQrcodeState();
}

class _LeitorQrcodeState extends State<LeitorQrcode> {
  MobileScannerController cameraController = MobileScannerController();
  String? qrCodeResult;
  bool isScanning = true;
  bool isTorchOn = false;

  @override
  void dispose() {
    cameraController.dispose();
    super.dispose();
  }

  void _onQRCodeDetected(BarcodeCapture capture) {
    final barcodes = capture.barcodes;
    
    if (barcodes.isNotEmpty && isScanning) {
      setState(() {
        isScanning = false;
        qrCodeResult = barcodes.first.rawValue;
      });

      // Mostra o resultado e navega após um breve delay
      _showResultAndNavigate(qrCodeResult!);
    }
  }

  void _showResultAndNavigate(String result) {
    // Mostra snackbar com o resultado
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('QR Code lido: $result'),
        duration: const Duration(seconds: 2),
      ),
    );

    // Navega para a tela de detalhes após 2 segundos
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const DetalhesAtivos(),
          ),
        );
      }
    });
  }

  void _restartScanning() {
    setState(() {
      isScanning = true;
      qrCodeResult = null;
    });
  }

  void _toggleTorch() {
    setState(() {
      isTorchOn = !isTorchOn;
    });
    cameraController.toggleTorch();
  }

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      drawer: const DrawerTecnico(),
      child: Stack(
        children: [
          // Scanner de QR Code substituindo o container cinza
          MobileScanner(
            controller: cameraController,
            onDetect: _onQRCodeDetected,
          ),

          // Overlay com a área de leitura (quadrado central)
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

          // Botão de flash no canto superior direito
          Positioned(
            top: 40,
            right: 20,
            child: IconButton(
              onPressed: _toggleTorch,
              icon: Icon(
                isTorchOn ? Icons.flash_on : Icons.flash_off,
                color: Colors.white,
              ),
              style: IconButton.styleFrom(
                backgroundColor: Colors.black38,
                padding: const EdgeInsets.all(12),
              ),
            ),
          ),

          // Botão para trocar câmera (frontal/traseira)
          Positioned(
            top: 40,
            left: 20,
            child: IconButton(
              onPressed: () {
                cameraController.switchCamera();
              },
              icon: const Icon(Icons.cameraswitch, color: Colors.white),
              style: IconButton.styleFrom(
                backgroundColor: Colors.black38,
                padding: const EdgeInsets.all(12),
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
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  isScanning 
                    ? "Aponte para o QR Code" 
                    : "QR Code identificado!",
                  style: const TextStyle(fontSize: 16, color: Colors.white),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: isScanning ? null : _restartScanning,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isScanning ? Colors.grey : Colors.black,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      isScanning ? "Aguardando leitura..." : "Ler outro QR Code",
                      style: const TextStyle(
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