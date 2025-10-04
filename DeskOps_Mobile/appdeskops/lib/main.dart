import 'package:flutter/material.dart';

// Importando telas de login
import 'ui/login/splashscreen.dart';
import 'ui/login/login.dart';
import 'ui/login/cadastro.dart';

// Importando telas do cliente
import 'ui/cliente/meus_chamados.dart' as clienteChamados;
import 'ui/cliente/novo_chamado.dart';
import 'ui/cliente/chamado_detalhado.dart';
import 'ui/cliente/editar_chamado.dart';

// Importando telas do técnico
import 'ui/tecnico/dashboard.dart';
import 'ui/tecnico/detalhes_ativos.dart';
import 'ui/tecnico/meus_chamados.dart' as tecnicoChamados;
import 'ui/tecnico/qrcode.dart';

// Importando telas genéricas (comuns a todos os usuários)
import 'ui/genericas/perfil.dart' as perfilGenerico;
import 'ui/genericas/editar_perfil.dart' as editarPerfilGenerico;
import 'ui/genericas/notificacao.dart' as notificacaoGenerica;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DeskOps',
      theme: ThemeData(primarySwatch: Colors.blue),
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
        '/perfil_cliente': (context) => const perfilGenerico.Perfil(),
        '/editar_chamado': (context) => const EditarChamado(
        tituloInicial: '',
        descricaoInicial: '',
      ),

        // Rotas do técnico
        '/dashboard': (context) => const Dashboard(),
        '/detalhes_ativos': (context) => const DetalhesAtivos(),
        '/meus_chamados_tecnico':
            (context) => const tecnicoChamados.MeusChamados(),
        '/perfil_tecnico': (context) => const perfilGenerico.Perfil(),
        '/qrcode': (context) => const QRCode(),

        // Rotas genéricas (comuns a todos os usuários)
        '/editar_perfil':
            (context) => const editarPerfilGenerico.EditarPerfil(),
        '/notificacoes': (context) => const notificacaoGenerica.Notificacao(),
      },
    );
  }
}
