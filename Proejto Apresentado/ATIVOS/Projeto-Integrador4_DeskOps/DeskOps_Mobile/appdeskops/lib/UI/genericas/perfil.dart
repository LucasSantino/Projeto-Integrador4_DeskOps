import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';
import '../../../api/services/auth_service.dart';
import '../../../api/services/user_service.dart';
import 'package:intl/intl.dart';
import '../../../core/config.dart';

class Perfil extends StatefulWidget {
  const Perfil({super.key});

  @override
  State<Perfil> createState() => _PerfilState();
}

class _PerfilState extends State<Perfil> {
  final AuthService _authService = AuthService();
  final UserService _userService = UserService();

  Map<String, dynamic>? _userData;
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    print('🚀 Inicializando Perfil...');
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    print('📥 Carregando dados do usuário...');
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      // 1. Primeiro tenta pegar do cache/local
      print('🔍 Tentando obter dados do cache...');
      final cachedUser = await _authService.getCurrentUser();
      print(
        '📱 Dados do cache: ${cachedUser != null ? "Disponíveis" : "Nulos"}',
      );

      if (cachedUser != null && cachedUser.isNotEmpty) {
        print('✅ Dados encontrados no cache');
        print('📄 Conteúdo do cache:');
        cachedUser.forEach((key, value) {
          print('   $key: $value');
        });

        setState(() {
          _userData = cachedUser;
          _isLoading = false;
        });

        // Atualiza em segundo plano
        print('🔄 Iniciando atualização em background...');
        _refreshUserDataInBackground();
      } else {
        // Se não tem cache, busca do backend
        print('⚠️ Cache vazio, buscando do backend...');
        await _refreshUserData();
      }
    } catch (e) {
      print('❌ Erro ao carregar dados: $e');
      setState(() {
        _isLoading = false;
        _errorMessage = 'Erro ao carregar dados do usuário: $e';
      });
    }
  }

  Future<void> _refreshUserData() async {
    print('🔄 Buscando dados atualizados do backend...');
    try {
      final userProfile = await _userService.getUserProfile();
      print('✅ Dados recebidos do backend com sucesso!');
      print('📄 Estrutura dos dados:');
      userProfile.forEach((key, value) {
        print('   $key: $value (${value.runtimeType})');
      });

      await _authService.updateLocalUserData(userProfile);

      setState(() {
        _userData = userProfile;
        _isLoading = false;
      });
      print('✅ Estado atualizado com dados do backend');
    } catch (e) {
      print('❌ Erro ao buscar dados do backend: $e');
      setState(() {
        _isLoading = false;
        _errorMessage = 'Erro ao carregar dados: $e';
      });
    }
  }

  Future<void> _refreshUserDataInBackground() async {
    print('🔄 Atualização em background iniciada...');
    try {
      final userProfile = await _userService.getUserProfile();
      await _authService.updateLocalUserData(userProfile);

      if (mounted) {
        setState(() {
          _userData = userProfile;
        });
        print('✅ Dados atualizados em background');
      }
    } catch (e) {
      print('⚠️ Erro na atualização em background: $e');
    }
  }

  String _formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'Não informado';

    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd/MM/yyyy').format(date);
    } catch (e) {
      print('⚠️ Erro ao formatar data "$dateString": $e');
      return dateString;
    }
  }

  String _formatCPF(String? cpf) {
    if (cpf == null || cpf.isEmpty) return 'Não informado';

    final cleaned = cpf.replaceAll(RegExp(r'[^\d]'), '');

    if (cleaned.length != 11) return cpf;

    return '${cleaned.substring(0, 3)}.${cleaned.substring(3, 6)}.${cleaned.substring(6, 9)}-${cleaned.substring(9)}';
  }

  String _getRoleDisplayName(String? role) {
    switch (role) {
      case 'usuario':
        return 'Usuário';
      case 'tecnico':
        return 'Técnico';
      case 'admin':
        return 'Administrador';
      case 'pendente':
        return 'Pendente de Aprovação';
      default:
        return role ?? 'Usuário';
    }
  }

  // NOVO: Função para obter a URL da foto corretamente
  String? _getFotoUrl() {
    if (_userData == null) return null;

    final fotoUser = _userData!['foto_user']?.toString();

    if (fotoUser == null || fotoUser.isEmpty) {
      return null;
    }

    print('📸 Foto URL encontrada: $fotoUser');

    // Se a URL já começa com http, usar como está
    if (fotoUser.startsWith('http')) {
      return fotoUser;
    }

    // Se não começa com http, adicionar o baseUrl
    // Remover barra inicial se existir para evitar dupla barra
    String path = fotoUser.startsWith('/') ? fotoUser.substring(1) : fotoUser;
    return '${ApiConfig.baseUrl}/$path';
  }

  Widget _buildLoadingState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(),
          const SizedBox(height: 20),
          Text(
            'Carregando perfil...',
            style: TextStyle(color: Colors.grey[600], fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.error_outline, color: Colors.red, size: 60),
          const SizedBox(height: 20),
          Text(
            _errorMessage,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.red, fontSize: 16),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: _loadUserData,
            child: const Text('Tentar novamente'),
          ),
        ],
      ),
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

              // Título com botão Editar e Debug
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Meu perfil',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.indigo,
                    ),
                  ),
                  Row(
                    children: [
                      if (!_isLoading && _userData != null)
                        IconButton(
                          onPressed: () {
                            print('📋 Dados brutos do usuário:');
                            _userData?.forEach((key, value) {
                              print('   $key: $value (${value.runtimeType})');
                            });
                            final fotoUrl = _getFotoUrl();
                            print('📸 URL da foto processada: $fotoUrl');
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Dados exibidos no console'),
                                duration: Duration(seconds: 2),
                              ),
                            );
                          },
                          icon: const Icon(Icons.bug_report, size: 22),
                          color: Colors.grey,
                        ),
                      if (!_isLoading && _userData != null)
                        TextButton.icon(
                          onPressed:
                              () => Navigator.pushNamed(
                                context,
                                '/editar_perfil',
                              ),
                          icon: const Icon(
                            Icons.edit,
                            color: Colors.indigo,
                            size: 18,
                          ),
                          label: const Text(
                            "Editar",
                            style: TextStyle(
                              color: Colors.indigo,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 20),

              // Conteúdo principal
              if (_isLoading)
                _buildLoadingState()
              else if (_errorMessage.isNotEmpty)
                _buildErrorState()
              else if (_userData != null && _userData!.isNotEmpty)
                _buildProfileCard()
              else
                _buildEmptyState(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.person_off, size: 60, color: Colors.grey),
          const SizedBox(height: 20),
          const Text(
            'Nenhum dado disponível',
            style: TextStyle(fontSize: 18, color: Colors.grey),
          ),
          const SizedBox(height: 10),
          const Text(
            'Faça login novamente ou contate o suporte',
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () async {
              print('🔄 Tentando forçar sincronização...');
              try {
                await _authService.forceSyncUserData();
                _loadUserData();
              } catch (e) {
                print('❌ Erro na sincronização: $e');
              }
            },
            child: const Text('Sincronizar Dados'),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileCard() {
    // Verifica se temos os dados mínimos
    final hasName =
        _userData?['name'] != null && _userData!['name'].toString().isNotEmpty;
    final hasEmail =
        _userData?['email'] != null &&
        _userData!['email'].toString().isNotEmpty;

    print('🎨 Construindo card do perfil...');
    print('   Tem nome? $hasName');
    print('   Tem email? $hasEmail');

    // Obter URL da foto
    final fotoUrl = _getFotoUrl();
    print('📸 URL da foto para exibição: $fotoUrl');

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 22),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Foto e nome
          Row(
            children: [
              CircleAvatar(
                radius: 40,
                backgroundImage:
                    fotoUrl != null
                        ? NetworkImage(fotoUrl)
                        : const AssetImage('assets/images/user.jpg')
                            as ImageProvider,
              ),
              const SizedBox(width: 18),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _userData?['name']?.toString() ??
                          _userData?['username']?.toString() ??
                          'Nome não informado',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _getRoleDisplayName(
                        _userData?['role']?.toString() ??
                            _userData?['cargo']?.toString(),
                      ),
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                    if (_userData?['is_active'] == false ||
                        _userData?['ativo'] == false)
                      Container(
                        margin: const EdgeInsets.only(top: 4),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.orange[100],
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'Pendente de aprovação',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.orange[800],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 28),

          // Informações do usuário - campos mais flexíveis
          if (_userData?['email'] != null) ...[
            _info("Email", _userData!['email'].toString()),
          ],

          if (_userData?['dt_nascimento'] != null) ...[
            _info(
              "Data de Nascimento",
              _formatDate(_userData!['dt_nascimento'].toString()),
            ),
          ] else if (_userData?['birth_date'] != null) ...[
            _info(
              "Data de Nascimento",
              _formatDate(_userData!['birth_date'].toString()),
            ),
          ],

          if (_userData?['cpf'] != null) ...[
            _info("CPF", _formatCPF(_userData!['cpf'].toString())),
          ],

          // No original tinha telefone, mas não temos na API, então removemos
          if (_userData?['role'] != null) ...[
            _info("Cargo", _getRoleDisplayName(_userData!['role'].toString())),
          ],

          if (_userData?['endereco'] != null) ...[
            _info("Endereço", _userData!['endereco'].toString()),
          ] else if (_userData?['address'] != null) ...[
            _info("Endereço", _userData!['address'].toString()),
          ],

          const SizedBox(height: 28),
        ],
      ),
    );
  }

  // Função auxiliar para exibir info formatada
  Widget _info(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(color: Colors.black54, fontSize: 14),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}
