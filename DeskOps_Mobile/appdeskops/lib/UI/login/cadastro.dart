import 'package:flutter/material.dart';
import '../../../api/services/auth_service.dart';

class Cadastro extends StatefulWidget {
  const Cadastro({super.key});

  @override
  State<Cadastro> createState() => _CadastroState();
}

class _CadastroState extends State<Cadastro> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _dtNascimentoController = TextEditingController();
  final TextEditingController _cpfController = TextEditingController();
  final TextEditingController _enderecoController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _isLoading = false;
  
  final AuthService _authService = AuthService();

  // Máscaras para os campos
  void _applyMasks() {
    // Máscara para CPF
    _cpfController.addListener(() {
      final text = _cpfController.text.replaceAll(RegExp(r'[^\d]'), '');
      if (text.length <= 11) {
        String maskedText = text;
        if (text.length > 9) {
          maskedText = '${text.substring(0, 3)}.${text.substring(3, 6)}.${text.substring(6, 9)}-${text.substring(9)}';
        } else if (text.length > 6) {
          maskedText = '${text.substring(0, 3)}.${text.substring(3, 6)}.${text.substring(6)}';
        } else if (text.length > 3) {
          maskedText = '${text.substring(0, 3)}.${text.substring(3)}';
        }
        if (maskedText != _cpfController.text) {
          _cpfController.value = _cpfController.value.copyWith(
            text: maskedText,
            selection: TextSelection.collapsed(offset: maskedText.length),
          );
        }
      }
    });

    // Máscara para data
    _dtNascimentoController.addListener(() {
      final text = _dtNascimentoController.text.replaceAll(RegExp(r'[^\d]'), '');
      if (text.length <= 8) {
        String maskedText = text;
        if (text.length > 4) {
          maskedText = '${text.substring(0, 2)}/${text.substring(2, 4)}/${text.substring(4)}';
        } else if (text.length > 2) {
          maskedText = '${text.substring(0, 2)}/${text.substring(2)}';
        }
        if (maskedText != _dtNascimentoController.text) {
          _dtNascimentoController.value = _dtNascimentoController.value.copyWith(
            text: maskedText,
            selection: TextSelection.collapsed(offset: maskedText.length),
          );
        }
      }
    });
  }

  @override
  void initState() {
    super.initState();
    _applyMasks();
  }

  @override
  void dispose() {
    _cpfController.dispose();
    _dtNascimentoController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _enderecoController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  // Função para confirmar o cadastro
  Future<void> _confirmarCadastro() async {
    // Validar se as senhas coincidem
    if (_passwordController.text != _confirmPasswordController.text) {
      _showErrorDialog("As senhas não coincidem. Por favor, verifique e tente novamente.");
      return;
    }

    // Validar campos obrigatórios
    if (_nameController.text.isEmpty ||
        _emailController.text.isEmpty ||
        _dtNascimentoController.text.isEmpty ||
        _cpfController.text.isEmpty ||
        _enderecoController.text.isEmpty ||
        _passwordController.text.isEmpty) {
      _showErrorDialog("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validação de email
    final emailRegex = RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    if (!emailRegex.hasMatch(_emailController.text)) {
      _showErrorDialog("Por favor, insira um email válido.");
      return;
    }

    // Validação de data (DD/MM/AAAA)
    final dateRegex = RegExp(r'^\d{2}/\d{2}/\d{4}$');
    if (!dateRegex.hasMatch(_dtNascimentoController.text)) {
      _showErrorDialog("Data de nascimento inválida. Use o formato DD/MM/AAAA.");
      return;
    }

    // Validar data real
    try {
      final parts = _dtNascimentoController.text.split('/');
      final day = int.parse(parts[0]);
      final month = int.parse(parts[1]);
      final year = int.parse(parts[2]);
      
      if (month < 1 || month > 12) {
        _showErrorDialog("Mês inválido. Deve ser entre 01 e 12.");
        return;
      }
      if (day < 1 || day > 31) {
        _showErrorDialog("Dia inválido. Deve ser entre 01 e 31.");
        return;
      }
      if (year < 1900 || year > DateTime.now().year - 10) {
        _showErrorDialog("Ano inválido. Você deve ter pelo menos 10 anos.");
        return;
      }
    } catch (e) {
      _showErrorDialog("Data inválida. Use números para dia, mês e ano.");
      return;
    }

    // Validação de CPF (apenas formato, não validação matemática)
    final cpfClean = _cpfController.text.replaceAll(RegExp(r'[^\d]'), '');
    if (cpfClean.length != 11) {
      _showErrorDialog("CPF inválido. Deve conter 11 dígitos.");
      return;
    }

    // Validação de senha
    if (_passwordController.text.length < 6) {
      _showErrorDialog("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: const Text(
          "Confirmar Cadastro",
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.indigo),
        ),
        content: const Text(
          "Deseja realmente criar sua conta?\n\nApós o cadastro, aguarde a aprovação do administrador para acessar o sistema.",
          style: TextStyle(color: Colors.black87),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text("Cancelar", style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.black,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text("Confirmar", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      setState(() {
        _isLoading = true;
      });

      try {
        print('📡 Iniciando processo de cadastro...');
        
        // Chamar o método de registro e usar a resposta
        await _authService.register(
          name: _nameController.text,
          email: _emailController.text,
          cpf: _cpfController.text,
          dtNascimento: _dtNascimentoController.text,
          endereco: _enderecoController.text,
          password: _passwordController.text,
        );

        // Se chegou aqui, o registro foi bem-sucedido
        setState(() {
          _isLoading = false;
        });

        // Mostrar mensagem de sucesso
        _showSuccessDialog();

      } catch (e) {
        setState(() {
          _isLoading = false;
        });

        // Mostrar mensagem de erro
        _showErrorDialog("Erro ao cadastrar: $e");
        print('❌ Erro no cadastro: $e');
      }
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: const Text(
          "Erro no Cadastro",
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red),
        ),
        content: Text(message, style: const TextStyle(color: Colors.black87)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("OK", style: TextStyle(color: Colors.grey)),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: const Text(
          "Cadastro Realizado!",
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 60),
            const SizedBox(height: 16),
            const Text(
              "Sua conta foi criada com sucesso!",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              "Status: ${_getStatusText()}",
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 14,
                color: Colors.black54,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              "Aguarde a aprovação do administrador para acessar o sistema.",
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.black87),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Fecha o dialog
              Navigator.pushReplacementNamed(context, '/login'); // Vai para login
            },
            child: const Text(
              "Ir para Login",
              style: TextStyle(
                color: Colors.indigo,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getStatusText() {
    return "Pendente de Aprovação";
  }

  void _togglePasswordVisibility() {
    setState(() {
      _obscurePassword = !_obscurePassword;
    });
  }

  void _toggleConfirmPasswordVisibility() {
    setState(() {
      _obscureConfirmPassword = !_obscureConfirmPassword;
    });
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.black,
      body: Column(
        children: [
          // Parte superior preta com imagem
          Container(
            width: size.width,
            height: size.height * 0.22,
            color: Colors.black,
            child: Center(
              child: Padding(
                padding: const EdgeInsets.only(top: 30),
                child: Image.asset(
                  'assets/images/logodeskops.png',
                  width: size.width * 0.99,
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),

          // Parte inferior branca com bordas arredondadas
          Expanded(
            child: Container(
              width: size.width,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  children: [
                    // 1º Container - Cadastro
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: Colors.grey.shade300),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.shade200,
                            blurRadius: 5,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Crie sua conta',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                          const SizedBox(height: 5),
                          const Text(
                            'Insira as suas informações abaixo',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.black54,
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Campos roláveis
                          SizedBox(
                            height: 280,
                            child: SingleChildScrollView(
                              child: Column(
                                children: [
                                  _buildField(
                                    'Nome *',
                                    'Digite seu nome completo',
                                    controller: _nameController,
                                  ),
                                  _buildField(
                                    'Email *',
                                    'exemplo@email.com',
                                    controller: _emailController,
                                    keyboardType: TextInputType.emailAddress,
                                  ),
                                  _buildField(
                                    'Data de Nascimento *',
                                    'DD/MM/AAAA',
                                    controller: _dtNascimentoController,
                                  ),
                                  _buildField(
                                    'CPF *',
                                    '000.000.000-00',
                                    controller: _cpfController,
                                    keyboardType: TextInputType.number,
                                  ),
                                  _buildField(
                                    'Endereço *',
                                    'Digite seu endereço completo',
                                    controller: _enderecoController,
                                  ),
                                  _buildPasswordField(
                                    'Senha *',
                                    'Mínimo 6 caracteres',
                                    controller: _passwordController,
                                    obscureText: _obscurePassword,
                                    onToggleVisibility: _togglePasswordVisibility,
                                  ),
                                  _buildPasswordField(
                                    'Confirmar Senha *',
                                    'Digite a senha novamente',
                                    controller: _confirmPasswordController,
                                    obscureText: _obscureConfirmPassword,
                                    onToggleVisibility: _toggleConfirmPasswordVisibility,
                                  ),
                                ],
                              ),
                            ),
                          ),

                          const SizedBox(height: 20),

                          // Botão Cadastrar
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _isLoading ? null : _confirmarCadastro,
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
                                      'Cadastrar',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 16,
                                      ),
                                    ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 10),

                    // 2º Container - Já tem conta
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border.all(color: Colors.grey.shade300),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.shade200,
                            blurRadius: 5,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Já tem uma conta?',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Faça login para acessar',
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
                                      Navigator.pushReplacementNamed(context, '/login');
                                    },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.grey.shade300,
                                padding: const EdgeInsets.symmetric(vertical: 15),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                              child: const Text(
                                'Entrar',
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
          ),
        ],
      ),
    );
  }

  // Função para construir campos de forma padronizada
  Widget _buildField(
    String label,
    String hint, {
    required TextEditingController controller,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 5),
          TextField(
            controller: controller,
            keyboardType: keyboardType,
            decoration: InputDecoration(
              hintText: hint,
              border: const UnderlineInputBorder(),
              focusedBorder: const UnderlineInputBorder(
                borderSide: BorderSide(color: Colors.black),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Função para construir campos de senha com ícone de olho
  Widget _buildPasswordField(
    String label,
    String hint, {
    required TextEditingController controller,
    required bool obscureText,
    required VoidCallback onToggleVisibility,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 5),
          TextField(
            controller: controller,
            obscureText: obscureText,
            decoration: InputDecoration(
              hintText: hint,
              border: const UnderlineInputBorder(),
              focusedBorder: const UnderlineInputBorder(
                borderSide: BorderSide(color: Colors.black),
              ),
              suffixIcon: IconButton(
                icon: Icon(
                  obscureText ? Icons.visibility_off : Icons.visibility,
                  color: Colors.grey,
                ),
                onPressed: onToggleVisibility,
              ),
            ),
          ),
        ],
      ),
    );
  }
}