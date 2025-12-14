import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:url_launcher/url_launcher.dart';
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
  bool showResultDialog = false;

  @override
  void dispose() {
    cameraController.dispose();
    super.dispose();
  }

  void _onQRCodeDetected(BarcodeCapture capture) {
    final barcodes = capture.barcodes;
    
    if (barcodes.isNotEmpty && isScanning) {
      final String? qrData = barcodes.first.rawValue;
      
      setState(() {
        isScanning = false;
        qrCodeResult = qrData;
        showResultDialog = true;
      });

      cameraController.stop();
    }
  }

  void _restartScanning() {
    setState(() {
      isScanning = true;
      qrCodeResult = null;
      showResultDialog = false;
    });
    cameraController.start();
  }

  void _toggleTorch() {
    setState(() {
      isTorchOn = !isTorchOn;
    });
    cameraController.toggleTorch();
  }

  QRCodeType _getQRCodeType(String data) {
    if (data.isEmpty) return QRCodeType.text;
    
    if (data.startsWith('http://') || data.startsWith('https://')) {
      return QRCodeType.url;
    }
    
    if (RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$').hasMatch(data)) {
      return QRCodeType.email;
    }
    
    final cleanPhone = data.replaceAll(RegExp(r'[\s\-\(\)\+]'), '');
    if (RegExp(r'^[\d]{10,15}$').hasMatch(cleanPhone)) {
      return QRCodeType.phone;
    }
    
    if (data.startsWith('ATIVO_') || 
        data.startsWith('ativo_') ||
        data.startsWith('ASSET_') ||
        RegExp(r'^[A-Za-z0-9_\-]{5,50}$').hasMatch(data)) {
      return QRCodeType.asset;
    }
    
    return QRCodeType.text;
  }

  void _handleQRCodeAction(String data) {
    final type = _getQRCodeType(data);
    
    switch (type) {
      case QRCodeType.url:
        _launchURL(data);
        break;
      case QRCodeType.email:
        _launchEmail(data);
        break;
      case QRCodeType.phone:
        _launchPhone(data);
        break;
      case QRCodeType.asset:
        _navigateToAssetDetails(data);
        break;
      case QRCodeType.text:
        _showTextContent(data);
        break;
    }
    
    _restartScanning();
  }

  void _launchURL(String url) async {
  try {
    print('🔗 URL recebida: $url');
    
    // Garante que a URL tenha o formato correto
    String urlCorrigida = url;
    
    // Se a URL não começar com http:// ou https://, adiciona https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlCorrigida = 'https://$url';
      print('🔗 URL corrigida: $urlCorrigida');
    }
    
    final Uri uri = Uri.parse(urlCorrigida);
    print('🔗 URI final: $uri');
    
    // Verifica se pode abrir a URL
    if (await canLaunchUrl(uri)) {
      print('✅ Abrindo URL no navegador...');
      await launchUrl(
        uri,
        mode: LaunchMode.externalApplication, // Força abrir no navegador externo
      );
    } else {
      print('❌ Não foi possível abrir a URL');
      _showError('Não foi possível abrir: $urlCorrigida');
    }
  } catch (e) {
    print('❌ Erro ao abrir URL: $e');
    _showError('Erro: $e');
  }
}

  void _launchEmail(String email) async {
    final Uri uri = Uri.parse('mailto:$email');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      _showError('Não foi possível abrir o e-mail: $email');
    }
  }

  void _launchPhone(String phone) async {
    final Uri uri = Uri.parse('tel:$phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      _showError('Não foi possível fazer a ligação: $phone');
    }
  }

  void _navigateToAssetDetails(String assetData) {
    // Navega para DetalhesAtivos sem parâmetros (mantém funcionamento atual)
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const DetalhesAtivos(),
      ),
    );
    
    // Mostra os dados do ativo identificado
    _showSnackbar('Ativo identificado: $assetData');
  }

  void _showTextContent(String text) {
    _showSnackbar('Conteúdo: $text');
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _showSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      drawer: const DrawerTecnico(),
      child: Stack(
        children: [
          MobileScanner(
            controller: cameraController,
            onDetect: _onQRCodeDetected,
          ),

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

          Positioned(
            bottom: 120,
            left: 20,
            right: 20,
            child: Column(
              children: [
                const Text(
                  "Leitor de QR Code",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  isScanning 
                    ? "Aponte para qualquer QR Code" 
                    : "QR Code identificado!",
                  style: const TextStyle(fontSize: 16, color: Colors.white),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),

          Positioned(
            bottom: 40,
            left: 20,
            right: 20,
            child: SizedBox(
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
                  isScanning ? "Aguardando leitura..." : "Ler Outro QR Code",
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),

          if (showResultDialog && qrCodeResult != null)
            _buildResultDialog(qrCodeResult!),
        ],
      ),
    );
  }

  Widget _buildResultDialog(String data) {
    final type = _getQRCodeType(data);
    
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          width: MediaQuery.of(context).size.width * 0.85,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                _getIconForType(type),
                size: 48,
                color: _getColorForType(type),
              ),
              const SizedBox(height: 16),
              Text(
                _getTitleForType(type),
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: SelectableText(
                  data,
                  style: const TextStyle(fontSize: 14),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 20),
              
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => _handleQRCodeAction(data),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _getColorForType(type),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: Text(
                    _getActionTextForType(type),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              
              const SizedBox(height: 8),
              
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: _restartScanning,
                  child: const Text('Ler Outro QR Code'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getIconForType(QRCodeType type) {
    switch (type) {
      case QRCodeType.url:
        return Icons.link;
      case QRCodeType.email:
        return Icons.email;
      case QRCodeType.phone:
        return Icons.phone;
      case QRCodeType.asset:
        return Icons.inventory_2;
      case QRCodeType.text:
        return Icons.text_fields;
    }
  }

  Color _getColorForType(QRCodeType type) {
    switch (type) {
      case QRCodeType.url:
        return Colors.blue;
      case QRCodeType.email:
        return Colors.green;
      case QRCodeType.phone:
        return Colors.purple;
      case QRCodeType.asset:
        return Colors.orange;
      case QRCodeType.text:
        return Colors.grey;
    }
  }

  String _getTitleForType(QRCodeType type) {
    switch (type) {
      case QRCodeType.url:
        return 'URL Encontrada';
      case QRCodeType.email:
        return 'E-mail Encontrado';
      case QRCodeType.phone:
        return 'Telefone Encontrado';
      case QRCodeType.asset:
        return 'Ativo Identificado';
      case QRCodeType.text:
        return 'Texto Lido';
    }
  }

  String _getActionTextForType(QRCodeType type) {
    switch (type) {
      case QRCodeType.url:
        return 'Abrir no Navegador';
      case QRCodeType.email:
        return 'Enviar E-mail';
      case QRCodeType.phone:
        return 'Fazer Ligação';
      case QRCodeType.asset:
        return 'Ver Detalhes do Ativo';
      case QRCodeType.text:
        return 'OK';
    }
  }
}

enum QRCodeType {
  url,
  email,
  phone,
  asset,
  text,
}