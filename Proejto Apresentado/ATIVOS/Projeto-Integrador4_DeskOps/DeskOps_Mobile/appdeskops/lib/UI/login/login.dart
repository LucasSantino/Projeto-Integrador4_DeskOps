import 'package:flutter/material.dart';
import '../../../api/services/auth_service.dart';
import '../../../core/config.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> with SingleTickerProviderStateMixin {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _isLoading = false;
  late AnimationController _animationController;
  final AuthService _authService = AuthService();

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
    
    print('URL do backend: ${ApiConfig.baseUrl}');
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final String email = _emailController.text.trim();
    final String password = _passwordController.text.trim();

    // Validação básica
    if (email.isEmpty || password.isEmpty) {
      _showErrorDialog('Por favor, preencha todos os campos');
      return;
    }

    if (!email.contains('@')) {
      _showErrorDialog('Por favor, insira um email válido');
      return;
    }

    // Iniciar loading
    setState(() {
      _isLoading = true;
    });

    // Mostrar popup de loading
    _showLoadingDialog();

    try {
      print('Tentando login com: $email');
      
      // Chamada real para a API - REMOVIDA A VARIÁVEL response DESNECESSÁRIA
      await _authService.login(email, password);
      
      print('Login bem-sucedido!');
      
      // Obter dados do usuário
      final userData = await _authService.getCurrentUser();
      
      // Obter role usando o novo método
      final role = await _authService.getCurrentUserRole();
      
      print('DEBUG - Dados do usuário:');
      print('  Role: $role');
      print('  Dados completos: $userData');
      
      // Verificar se o usuário está ativo
      final isActive = userData?['is_active'] ?? false;
      if (!isActive) {
        throw Exception('Usuário não ativo. Aguarde aprovação do administrador.');
      }

      // Fechar popup de loading
      if (mounted) {
        Navigator.of(context, rootNavigator: true).pop();
        _animationController.stop();
      }

      // Navegar conforme o role do usuário
      _navigateByRole(role, userData);

    } catch (e) {
      print('Erro no login: $e');
      
      // Fechar popup de loading
      if (mounted) {
        Navigator.of(context, rootNavigator: true).pop();
        _animationController.stop();
      }

      // Tratamento de erros específicos
      String errorMessage = 'Erro ao fazer login';
      
      if (e.toString().contains('Timeout')) {
        errorMessage = 'Tempo de conexão excedido. Verifique sua internet.';
      } else if (e.toString().contains('401')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (e.toString().contains('403') || e.toString().contains('não ativo')) {
        errorMessage = 'Usuário não aprovado. Aguarde aprovação do administrador.';
      } else if (e.toString().contains('Network is unreachable')) {
        errorMessage = 'Sem conexão com a internet';
      } else if (e.toString().contains('Connection refused')) {
        errorMessage = 'Não foi possível conectar ao servidor';
      } else {
        errorMessage = 'Erro: $e';
      }

      _showErrorDialog(errorMessage);
    } finally {
      // Parar loading
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _navigateByRole(String role, Map<String, dynamic>? userData) {
    print('Navegando para role: $role');
    
    // Verificação de segurança
    if (userData == null) {
      _showErrorDialog('Erro ao obter dados do usuário');
      return;
    }
    
    // Verificar se o usuário está ativo
    if (userData['is_active'] == false) {
      _showErrorDialog('Sua conta está aguardando aprovação do administrador.');
      return;
    }
    
    // Mapeamento de roles para rotas
    switch (role.toLowerCase()) {
      case 'usuario':
        print('Redirecionando para meus_chamados');
        Navigator.pushReplacementNamed(context, '/meus_chamados');
        break;
      case 'tecnico':
        print('Redirecionando para lista_chamados');
        Navigator.pushReplacementNamed(context, '/lista_chamados');
        break;
      case 'admin':
        print('Redirecionando para dashboard');
        Navigator.pushReplacementNamed(context, '/dashboard');
        break;
      case 'pendente':
        _showErrorDialog('Sua conta está aguardando aprovação do administrador.');
        break;
      default:
        // Se não tiver role definido, verificar is_staff
        if (userData['is_staff'] == true) {
          Navigator.pushReplacementNamed(context, '/lista_chamados');
        } else {
          Navigator.pushReplacementNamed(context, '/meus_chamados');
        }
        break;
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        title: const Text(
          'Erro',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.red,
          ),
        ),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK', style: TextStyle(color: Colors.grey)),
          ),
        ],
      ),
    );
  }

  void _showLoadingDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      barrierColor: const Color.fromRGBO(0, 0, 0, 0.54),
      builder: (context) => PopScope(
        canPop: false,
        child: Dialog(
          backgroundColor: Colors.transparent,
          elevation: 0,
          child: Container(
            padding: const EdgeInsets.all(30),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: const Color.fromRGBO(0, 0, 0, 0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Imagem girando
                RotationTransition(
                  turns: Tween(begin: 0.0, end: 1.0).animate(
                    CurvedAnimation(
                      parent: _animationController,
                      curve: Curves.linear,
                    ),
                  ),
                  child: Image.asset(
                    'assets/images/iconedeskops.png',
                    width: 120,
                    height: 120,
                    fit: BoxFit.contain,
                  ),
                ),
                const SizedBox(height: 20),
                const Text(
                  'Conectando...',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 10),
                const Text(
                  'Autenticando com o servidor',
                  style: TextStyle(fontSize: 14, color: Colors.black54),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );

    // Iniciar animação de rotação
    _animationController.repeat();
  }

  void _togglePasswordVisibility() {
    setState(() {
      _obscurePassword = !_obscurePassword;
    });
  }

  Future<void> _testConnection() async {
    try {
      print('Testando conexão com: ${ApiConfig.baseUrl}');
      _showSuccessDialog('Backend configurado!\n${ApiConfig.baseUrl}');
    } catch (e) {
      _showErrorDialog('Erro na conexão: $e');
    }
  }

  void _showSuccessDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        title: const Text(
          'Informação',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.green,
          ),
        ),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK', style: TextStyle(color: Colors.grey)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.black,
      body: LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            physics: const ClampingScrollPhysics(),
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: constraints.maxHeight),
              child: Column(
                children: [
                  // Parte superior preta com imagem
                  Container(
                    width: size.width,
                    height: constraints.maxHeight * 0.25,
                    color: Colors.black,
                    child: Stack(
                      children: [
                        Center(
                          child: Padding(
                            padding: const EdgeInsets.only(top: 30),
                            child: Image.asset(
                              'assets/images/logodeskops.png',
                              width: size.width * 0.99,
                              fit: BoxFit.contain,
                            ),
                          ),
                        ),
                        // Botão de teste de conexão (apenas para debug)
                        Positioned(
                          top: 10,
                          right: 10,
                          child: IconButton(
                            icon: const Icon(Icons.wifi_find, color: Colors.white),
                            onPressed: _testConnection,
                            tooltip: 'Testar conexão',
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Parte inferior branca com bordas arredondadas
                  Container(
                    width: size.width,
                    constraints: BoxConstraints(
                      minHeight: constraints.maxHeight * 0.75,
                    ),
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(30),
                        topRight: Radius.circular(30),
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          // 1º Container - Login
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(color: Colors.grey.shade300),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color.fromRGBO(0, 0, 0, 0.1),
                                  blurRadius: 5,
                                  offset: const Offset(0, 3),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Bem-vindo ao Portal',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  'Entre usando seu email e senha cadastrados',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.black54,
                                  ),
                                ),
                                const SizedBox(height: 20),

                                // Campo Email
                                const Text(
                                  'Email',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: Color.fromARGB(255, 78, 78, 78),
                                  ),
                                ),
                                const SizedBox(height: 5),
                                TextField(
                                  controller: _emailController,
                                  keyboardType: TextInputType.emailAddress,
                                  decoration: const InputDecoration(
                                    hintText: 'Digite seu email',
                                    border: UnderlineInputBorder(),
                                    focusedBorder: UnderlineInputBorder(
                                      borderSide: BorderSide(
                                        color: Color.fromARGB(255, 224, 223, 223),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 15),

                                // Campo Password
                                const Text(
                                  'Senha',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                    color: Color.fromARGB(255, 78, 78, 78),
                                  ),
                                ),
                                const SizedBox(height: 5),
                                TextField(
                                  controller: _passwordController,
                                  obscureText: _obscurePassword,
                                  decoration: InputDecoration(
                                    hintText: 'Digite sua senha',
                                    border: const UnderlineInputBorder(),
                                    focusedBorder: const UnderlineInputBorder(
                                      borderSide: BorderSide(color: Colors.black),
                                    ),
                                    suffixIcon: IconButton(
                                      icon: Icon(
                                        _obscurePassword
                                            ? Icons.visibility_off
                                            : Icons.visibility,
                                        color: Colors.grey,
                                      ),
                                      onPressed: _togglePasswordVisibility,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 20),

                                // Botão Login
                                SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton(
                                    onPressed: _isLoading ? null : _login,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.black,
                                      padding: const EdgeInsets.symmetric(vertical: 15),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                    ),
                                    child: _isLoading
                                        ? const SizedBox(
                                            height: 20,
                                            width: 20,
                                            child: CircularProgressIndicator(
                                              strokeWidth: 2,
                                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                            ),
                                          )
                                        : const Text(
                                            'Entrar',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                            ),
                                          ),
                                  ),
                                ),
                                
                                // Link para esqueci a senha
                                const SizedBox(height: 10),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: TextButton(
                                    onPressed: () {
                                      _showErrorDialog('Entre em contato com o administrador para redefinir sua senha.');
                                    },
                                    child: const Text(
                                      'Esqueci minha senha',
                                      style: TextStyle(
                                        color: Colors.grey,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 20),

                          // 2º Container - Criar Conta
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(color: Colors.grey.shade300),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color.fromRGBO(0, 0, 0, 0.1),
                                  blurRadius: 5,
                                  offset: const Offset(0, 3),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Ainda não tem uma conta?',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  'Cadastre agora mesmo',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.black54,
                                  ),
                                ),
                                const SizedBox(height: 20),
                                SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton(
                                    onPressed: _isLoading
                                        ? null
                                        : () {
                                            Navigator.pushNamed(context, '/cadastro');
                                          },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.grey.shade300,
                                      padding: const EdgeInsets.symmetric(vertical: 15),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                    ),
                                    child: const Text(
                                      'Criar Conta',
                                      style: TextStyle(
                                        color: Colors.black,
                                        fontSize: 16,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}