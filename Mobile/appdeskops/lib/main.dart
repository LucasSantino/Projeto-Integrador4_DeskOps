import 'package:flutter/material.dart';

// Importando telas de login
import 'ui/widgets/login/splashscreen.dart';
import 'ui/widgets/login/login.dart';
import 'ui/widgets/login/cadastro.dart';

// Importando telas do cliente
import 'ui/widgets/cliente/meus_chamados.dart' as clienteChamados;
import 'ui/widgets/cliente/novo_chamado.dart';
import 'ui/widgets/cliente/chamado_detalhado.dart';
import 'ui/widgets/cliente/perfil.dart' as clientePerfil;

// Importando telas do técnico
import 'ui/widgets/tecnico/dashboard.dart';
import 'ui/widgets/tecnico/detalhes_ativos.dart';
import 'ui/widgets/tecnico/meus_chamados.dart' as tecnicoChamados;
import 'ui/widgets/tecnico/perfil.dart' as tecnicoPerfil;
import 'ui/widgets/tecnico/qrcode.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DeskOps',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        // Rotas de login
        '/': (context) => const SplashScreen(),
        '/login': (context) => const Login(),
        '/cadastro': (context) => const Cadastro(),

        // Rotas do cliente
        '/meus_chamados': (context) => const clienteChamados.MeusChamados(),
        '/novo_chamado': (context) => const NovoChamado(),
        '/chamado_detalhado': (context) => const ChamadoDetalhado(),
        '/perfil_cliente': (context) => const clientePerfil.Perfil(),

        // Rotas do técnico
        '/dashboard': (context) => const Dashboard(),
        '/detalhes_ativos': (context) => const DetalhesAtivos(),
        '/meus_chamados_tecnico': (context) => const tecnicoChamados.MeusChamados(),
        '/perfil_tecnico': (context) => const tecnicoPerfil.Perfil(),
        '/qrcode': (context) => const QRCode(),
      },
    );
  }
}
