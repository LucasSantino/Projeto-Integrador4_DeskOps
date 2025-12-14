import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import '../widgets/mainLayout.dart';
import '../../../api/services/user_service.dart';
import '../../../api/services/auth_service.dart';

class EditarPerfil extends StatefulWidget {
  const EditarPerfil({super.key});

  @override
  State<EditarPerfil> createState() => _EditarPerfilState();
}

class _EditarPerfilState extends State<EditarPerfil> {
  final AuthService _authService = AuthService();
  final UserService _userService = UserService();
  final ImagePicker _picker = ImagePicker();

  // Controllers para os campos do formulário
  final TextEditingController _nomeController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _cargoController = TextEditingController();
  final TextEditingController _nascimentoController = TextEditingController();
  final TextEditingController _cpfController = TextEditingController();
  final TextEditingController _enderecoController = TextEditingController();
  final TextEditingController _senhaController = TextEditingController();
  final TextEditingController _confirmarSenhaController =
      TextEditingController();

  // Campos para a senha atual - importante para alteração
  final TextEditingController _senhaAtualController = TextEditingController();

  File? _imagemSelecionada;
  bool _mostrarSenha = false;
  bool _mostrarConfirmarSenha = false;
  bool _mostrarSenhaAtual = false;
  bool _isLoading = true;
  bool _isSaving = false;
  String _errorMessage = '';

  Map<String, dynamic>? _userData;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      final userData = await _authService.getCurrentUser();
      if (userData != null) {
        _userData = userData;
        _preencherCampos(userData);
      } else {
        final profileData = await _userService.getUserProfile();
        _userData = profileData;
        _preencherCampos(profileData);
        await _authService.updateLocalUserData(profileData);
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Erro ao carregar dados: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _preencherCampos(Map<String, dynamic> userData) {
    // Preencher campos principais
    _nomeController.text = userData['name'] ?? '';
    _emailController.text = userData['email'] ?? '';
    _cargoController.text = userData['role'] ?? '';
    _enderecoController.text = userData['endereco'] ?? '';

    // Formatar data de nascimento
    if (userData['dt_nascimento'] != null) {
      try {
        final date = DateTime.parse(userData['dt_nascimento']);
        _nascimentoController.text = DateFormat('dd/MM/yyyy').format(date);
      } catch (e) {
        _nascimentoController.text =
            userData['dt_nascimento']?.toString() ?? '';
      }
    }

    // Formatar CPF
    if (userData['cpf'] != null) {
      final cpf = userData['cpf'].toString();
      final cleaned = cpf.replaceAll(RegExp(r'[^\d]'), '');
      if (cleaned.length == 11) {
        _cpfController.text =
            '${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9)}';
      } else {
        _cpfController.text = cpf;
      }
    }

    // **IMPORTANTE**: Não preencher os campos de senha por questões de segurança
    // A senha só deve ser preenchida pelo usuário quando quiser alterá-la
    _senhaController.clear();
    _confirmarSenhaController.clear();
    _senhaAtualController.clear();
  }

  Future<void> _selecionarImagem() async {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library, color: Colors.indigo),
                title: const Text('Escolher da galeria'),
                onTap: () async {
                  Navigator.of(context).pop();
                  final XFile? imagem = await _picker.pickImage(
                    source: ImageSource.gallery,
                    imageQuality: 80,
                  );
                  if (imagem != null) {
                    setState(() {
                      _imagemSelecionada = File(imagem.path);
                    });
                  }
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt, color: Colors.indigo),
                title: const Text('Tirar foto'),
                onTap: () async {
                  Navigator.of(context).pop();
                  final XFile? imagem = await _picker.pickImage(
                    source: ImageSource.camera,
                    imageQuality: 80,
                  );
                  if (imagem != null) {
                    setState(() {
                      _imagemSelecionada = File(imagem.path);
                    });
                  }
                },
              ),
              ListTile(
                leading: const Icon(Icons.cancel, color: Colors.red),
                title: const Text('Cancelar'),
                onTap: () => Navigator.of(context).pop(),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _salvarAlteracoes() async {
    // Validar se todos os campos obrigatórios estão preenchidos
    if (_nomeController.text.isEmpty || _emailController.text.isEmpty) {
      _showErrorDialog('Nome e email são obrigatórios');
      return;
    }

    // Validar senhas se foram preenchidas
    if (_senhaController.text.isNotEmpty ||
        _confirmarSenhaController.text.isNotEmpty) {
      if (_senhaController.text != _confirmarSenhaController.text) {
        _showErrorDialog('As novas senhas não coincidem');
        return;
      }
      if (_senhaController.text.length < 6) {
        _showErrorDialog('A nova senha deve ter pelo menos 6 caracteres');
        return;
      }
      if (_senhaAtualController.text.isEmpty) {
        _showErrorDialog(
          'Para alterar a senha, é necessário informar a senha atual',
        );
        return;
      }
    }

    setState(() {
      _isSaving = true;
    });

    try {
      // Converter data para formato YYYY-MM-DD
      String? formattedDate;
      if (_nascimentoController.text.isNotEmpty) {
        try {
          final parts = _nascimentoController.text.split('/');
          if (parts.length == 3) {
            formattedDate = '${parts[2]}-${parts[1]}-${parts[0]}';
          }
        } catch (e) {
          print('⚠️ Erro ao formatar data: $e');
        }
      }

      // Atualizar dados básicos
      final updatedData = await _userService.updateUserProfile(
        name: _nomeController.text.trim(),
        email: _emailController.text.trim(),
        endereco: _enderecoController.text.trim(),
        dtNascimento: formattedDate,
      );

      // Se há nova senha, tentar alterar
      if (_senhaController.text.isNotEmpty &&
          _senhaAtualController.text.isNotEmpty) {
        try {
          await _userService.changePassword(
            currentPassword: _senhaAtualController.text,
            newPassword: _senhaController.text,
          );
          print('✅ Senha alterada com sucesso');
        } catch (e) {
          print('⚠️ Erro ao alterar senha: $e');
          // Mostrar aviso, mas continuar com sucesso dos outros dados
          _showSuccessDialog(
            'Dados atualizados, mas a senha não foi alterada. Verifique se a senha atual está correta.',
          );
          await _authService.updateLocalUserData(updatedData);
          Navigator.pop(context);
          return;
        }
      }

      // Atualizar dados locais
      await _authService.updateLocalUserData(updatedData);

      // Mostrar sucesso
      _showSuccessDialog('Perfil atualizado com sucesso!');
    } catch (e) {
      _showErrorDialog('Erro ao salvar alterações: $e');
    } finally {
      setState(() {
        _isSaving = false;
      });
    }
  }

  void _showErrorDialog(String message) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            title: const Text(
              "Erro",
              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red),
            ),
            content: Text(message),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text("OK", style: TextStyle(color: Colors.grey)),
              ),
            ],
          ),
    );
  }

  void _showSuccessDialog(String message) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder:
          (context) => AlertDialog(
            backgroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            title: const Text(
              "Sucesso!",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.green,
              ),
            ),
            content: Text(message),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  Navigator.of(context).pop();
                },
                child: const Text("OK", style: TextStyle(color: Colors.indigo)),
              ),
            ],
          ),
    );
  }

  void _mostrarDialogoConfirmacao() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Row(
                  children: [
                    Icon(Icons.check_circle, color: Colors.green, size: 24),
                    SizedBox(width: 8),
                    Text(
                      "Confirmação",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.indigo,
                        fontSize: 18,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Text(
                  "Tem certeza que deseja salvar as alterações do perfil?",
                  style: TextStyle(fontSize: 16),
                  textAlign: TextAlign.left,
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child: const Text(
                        "Cancelar",
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                        _salvarAlteracoes();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: const Text(
                        "Confirmar",
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return MainLayout(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Botão Voltar
              TextButton.icon(
                onPressed: () => Navigator.pop(context),
                icon: const Icon(Icons.arrow_back, color: Colors.black),
                label: const Text(
                  "Voltar",
                  style: TextStyle(color: Colors.black),
                ),
              ),

              const SizedBox(height: 10),

              // Título
              const Text(
                'Editar Perfil',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.indigo,
                ),
              ),

              if (_errorMessage.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 10),
                  child: Text(
                    _errorMessage,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),

              const SizedBox(height: 20),

              // Card estilo chamados
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 22,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: Colors.grey.shade300, width: 1),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0x269E9E9E),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child:
                    _isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Foto com opção de upload
                            Row(
                              children: [
                                GestureDetector(
                                  onTap: _selecionarImagem,
                                  child: Stack(
                                    children: [
                                      CircleAvatar(
                                        radius: 40,
                                        backgroundImage:
                                            _imagemSelecionada != null
                                                ? FileImage(_imagemSelecionada!)
                                                : (_userData?['foto_user'] !=
                                                            null &&
                                                        _userData!['foto_user']
                                                            .toString()
                                                            .isNotEmpty
                                                    ? NetworkImage(
                                                      _userData!['foto_user']
                                                          .toString(),
                                                    )
                                                    : const AssetImage(
                                                          'assets/images/user.jpg',
                                                        )
                                                        as ImageProvider),
                                      ),
                                      Positioned(
                                        bottom: 0,
                                        right: 0,
                                        child: Container(
                                          padding: const EdgeInsets.all(4),
                                          decoration: const BoxDecoration(
                                            color: Colors.indigo,
                                            shape: BoxShape.circle,
                                          ),
                                          child: const Icon(
                                            Icons.camera_alt,
                                            color: Colors.white,
                                            size: 16,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 18),
                                Expanded(
                                  child: TextField(
                                    controller: _nomeController,
                                    decoration: const InputDecoration(
                                      labelText: "Nome Completo",
                                      border: InputBorder.none,
                                    ),
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(height: 20),

                            // Campos editáveis - espaçamento reduzido
                            _campo("Email", _emailController),
                            const SizedBox(height: 12),
                            _campo("Cargo", _cargoController, enabled: false),
                            const SizedBox(height: 12),
                            _campo(
                              "Data de Nascimento (DD/MM/AAAA)",
                              _nascimentoController,
                              hint: "Ex: 01/01/2000",
                            ),
                            const SizedBox(height: 12),
                            _campo("CPF", _cpfController, enabled: false),
                            const SizedBox(height: 12),
                            _campo("Endereço", _enderecoController),
                            const SizedBox(height: 12),

                            // Seção de alteração de senha
                            const Divider(),
                            const SizedBox(height: 12),
                            const Text(
                              "Alterar Senha (opcional)",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.black54,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              "Deixe em branco para manter a senha atual",
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey,
                              ),
                            ),
                            const SizedBox(height: 12),

                            // Campo Senha Atual (para verificação)
                            TextField(
                              controller: _senhaAtualController,
                              obscureText: !_mostrarSenhaAtual,
                              decoration: InputDecoration(
                                labelText: "Senha Atual",
                                labelStyle: const TextStyle(
                                  color: Colors.black54,
                                ),
                                border: InputBorder.none,
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _mostrarSenhaAtual
                                        ? Icons.visibility
                                        : Icons.visibility_off,
                                    color: Colors.grey,
                                  ),
                                  onPressed: () {
                                    setState(() {
                                      _mostrarSenhaAtual = !_mostrarSenhaAtual;
                                    });
                                  },
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),

                            // Campo Nova Senha
                            TextField(
                              controller: _senhaController,
                              obscureText: !_mostrarSenha,
                              decoration: InputDecoration(
                                labelText: "Nova Senha",
                                labelStyle: const TextStyle(
                                  color: Colors.black54,
                                ),
                                border: InputBorder.none,
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _mostrarSenha
                                        ? Icons.visibility
                                        : Icons.visibility_off,
                                    color: Colors.grey,
                                  ),
                                  onPressed: () {
                                    setState(() {
                                      _mostrarSenha = !_mostrarSenha;
                                    });
                                  },
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),

                            // Campo Confirmar Nova Senha
                            TextField(
                              controller: _confirmarSenhaController,
                              obscureText: !_mostrarConfirmarSenha,
                              decoration: InputDecoration(
                                labelText: "Confirmar Nova Senha",
                                labelStyle: const TextStyle(
                                  color: Colors.black54,
                                ),
                                border: InputBorder.none,
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _mostrarConfirmarSenha
                                        ? Icons.visibility
                                        : Icons.visibility_off,
                                    color: Colors.grey,
                                  ),
                                  onPressed: () {
                                    setState(() {
                                      _mostrarConfirmarSenha =
                                          !_mostrarConfirmarSenha;
                                    });
                                  },
                                ),
                              ),
                            ),

                            const SizedBox(height: 20),

                            // Botão Salvar
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.black,
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 16,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                onPressed:
                                    _isSaving
                                        ? null
                                        : _mostrarDialogoConfirmacao,
                                icon:
                                    _isSaving
                                        ? const SizedBox(
                                          width: 20,
                                          height: 20,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            valueColor:
                                                AlwaysStoppedAnimation<Color>(
                                                  Colors.white,
                                                ),
                                          ),
                                        )
                                        : const Icon(
                                          Icons.save,
                                          color: Colors.white,
                                        ),
                                label: Text(
                                  _isSaving
                                      ? 'Salvando...'
                                      : 'Salvar Alterações',
                                  style: const TextStyle(
                                    color: Colors.white,
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
    );
  }

  Widget _campo(
    String label,
    TextEditingController controller, {
    bool enabled = true,
    String? hint,
  }) {
    return TextField(
      controller: controller,
      enabled: enabled,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.black54),
        hintText: hint,
        border: InputBorder.none,
      ),
    );
  }

  @override
  void dispose() {
    _nomeController.dispose();
    _emailController.dispose();
    _cargoController.dispose();
    _nascimentoController.dispose();
    _cpfController.dispose();
    _enderecoController.dispose();
    _senhaController.dispose();
    _confirmarSenhaController.dispose();
    _senhaAtualController.dispose();
    super.dispose();
  }
}
