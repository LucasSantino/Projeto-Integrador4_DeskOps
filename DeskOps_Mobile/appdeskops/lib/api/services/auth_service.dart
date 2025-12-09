import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/config.dart';

class AuthService {
  
  // LOGIN
  Future<Map<String, dynamic>> login(String email, String password) async {
    print('🔵 Tentando login em: ${ApiConfig.baseUrl}${ApiConfig.login}');

    // Teste 1: Com 'username' (padrão do SimpleJWT)
    print('🔍 Teste 1: Enviando como "username"...');
    try {
      final response1 = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.login}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': email,
          'password': password,
        }),
      );

      print('📊 Status Teste 1: ${response1.statusCode}');

      if (response1.statusCode == 200) {
        print('✅ Login bem-sucedido com "username"');
        return await _handleSuccessfulLogin(response1);
      }

      print('📦 Resposta Teste 1: ${response1.body}');
    } catch (e) {
      print('❌ Teste 1 falhou: $e');
    }

    // Teste 2: Com 'email' (seu custom serializer)
    print('🔍 Teste 2: Enviando como "email"...');
    try {
      final response2 = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.login}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      print('📊 Status Teste 2: ${response2.statusCode}');

      if (response2.statusCode == 200) {
        print('✅ Login bem-sucedido com "email"');
        return await _handleSuccessfulLogin(response2);
      }

      print('📦 Resposta Teste 2: ${response2.body}');
    } catch (e) {
      print('❌ Teste 2 falhou: $e');
    }

    throw Exception('Falha no login. Verifique credenciais.');
  }

  // PROCESSAR LOGIN BEM-SUCEDIDO
  Future<Map<String, dynamic>> _handleSuccessfulLogin(http.Response response) async {
    final data = jsonDecode(response.body);
    final prefs = await SharedPreferences.getInstance();

    await prefs.setString('access_token', data['access']);
    await prefs.setString('refresh_token', data['refresh']);

    // Se a resposta contiver dados do usuário, salvar
    if (data.containsKey('user') && data['user'] != null) {
      await prefs.setString('user_data', jsonEncode(data['user']));
      print('✅ Dados do usuário salvos da resposta do login');
    } else {
      // Se não tiver, tentar buscar via endpoint /me
      try {
        final userProfile = await getProfile();
        await prefs.setString('user_data', jsonEncode(userProfile));
        print('✅ Dados do usuário obtidos via endpoint /me');
      } catch (e) {
        print('⚠️ Não foi possível obter perfil do usuário: $e');
      }
    }

    print('✅ Login realizado com sucesso! Token salvo.');
    return data;
  }

  // REGISTRO
  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String cpf,
    required String dtNascimento,
    required String endereco,
    required String password,
  }) async {
    print('🔵 Tentando registro em: ${ApiConfig.baseUrl}${ApiConfig.register}');
    
    // Converter data de DD/MM/AAAA para YYYY-MM-DD
    String formattedDate = '';
    try {
      final parts = dtNascimento.split('/');
      if (parts.length == 3) {
        final day = parts[0];
        final month = parts[1];
        final year = parts[2];
        
        if (day.length != 2 || month.length != 2 || year.length != 4) {
          throw Exception('Formato inválido. Use DD/MM/AAAA com 2 dígitos para dia/mês e 4 para ano');
        }
        
        formattedDate = '$year-$month-$day';
        print('📅 Data convertida: $formattedDate');
      } else {
        throw Exception('Formato de data inválido. Use DD/MM/AAAA');
      }
    } catch (e) {
      throw Exception('Data de nascimento inválida: $e');
    }

    final cpfLimpo = cpf.replaceAll(RegExp(r'[^\d]'), '');
    
    if (cpfLimpo.length != 11) {
      throw Exception('CPF deve conter 11 dígitos');
    }

    final body = {
      'name': name.trim(),
      'email': email.trim(),
      'cpf': cpfLimpo,
      'dt_nascimento': formattedDate,
      'endereco': endereco.trim(),
      'password': password,
    };

    print('📦 Dados de registro: $body');

    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.register}'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode(body),
      );

      print('📊 Status do registro: ${response.statusCode}');
      print('📦 Resposta do registro: ${response.body}');

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('✅ Registro bem-sucedido!');
        
        if (data.containsKey('access') && data.containsKey('refresh')) {
          await _handleSuccessfulLogin(response);
        }
        
        return data;
      } else {
        final errorBody = response.body;
        String errorMessage = 'Erro no registro (${response.statusCode})';
        
        try {
          final errorData = jsonDecode(errorBody);
          
          if (errorData.containsKey('email') && (errorData['email'] as List).isNotEmpty) {
            errorMessage = 'Email: ${errorData['email'][0]}';
          } else if (errorData.containsKey('cpf') && (errorData['cpf'] as List).isNotEmpty) {
            errorMessage = 'CPF: ${errorData['cpf'][0]}';
          } else if (errorData.containsKey('password') && (errorData['password'] as List).isNotEmpty) {
            errorMessage = 'Senha: ${errorData['password'][0]}';
          } else if (errorData.containsKey('detail')) {
            errorMessage = errorData['detail'];
          } else if (errorData.containsKey('non_field_errors')) {
            errorMessage = errorData['non_field_errors'][0];
          } else if (errorData.containsKey('message')) {
            errorMessage = errorData['message'];
          }
        } catch (e) {
          if (errorBody.isNotEmpty && errorBody.length < 100) {
            errorMessage = errorBody;
          }
        }
        
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('❌ Erro no registro: $e');
      if (e is http.ClientException || e.toString().contains('SocketException')) {
        throw Exception('Falha na conexão com o servidor. Verifique sua internet e se o servidor está rodando.');
      }
      rethrow;
    }
  }

  // LOGOUT
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    final refreshToken = prefs.getString('refresh_token');

    if (refreshToken != null) {
      try {
        await http.post(
          Uri.parse('${ApiConfig.baseUrl}${ApiConfig.logout}'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'refresh': refreshToken}),
        );
      } catch (e) {
        print('⚠️ Erro no logout: $e');
      }
    }

    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
    await prefs.remove('user_data');
  }

  // OBTER PERFIL DO USUÁRIO
  Future<Map<String, dynamic>> getProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');

    if (token == null) throw Exception('Não autenticado');

    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.me}'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  // VERIFICAR SE ESTÁ LOGADO
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token') != null;
  }

  // OBTER USUÁRIO ATUAL (DO CACHE)
  Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString('user_data');

    if (userData != null && userData.isNotEmpty) {
      try {
        return jsonDecode(userData);
      } catch (e) {
        print('❌ Erro ao decodificar user_data: $e');
        return null;
      }
    }
    return null;
  }

  // ATUALIZAR DADOS DO USUÁRIO LOCALMENTE
  Future<void> updateLocalUserData(Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_data', jsonEncode(userData));
  }

  // OBTER TOKEN DE ACESSO
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }

  // LIMPAR DADOS DO USUÁRIO (PARA TESTES)
  Future<void> clearUserData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_data');
  }

  // ============ NOVOS MÉTODOS ADICIONADOS ============

  // ATUALIZAR DADOS DO USUÁRIO NO BACKEND E LOCALMENTE
  Future<Map<String, dynamic>> updateProfile({
    String? name,
    String? email,
    String? endereco,
    String? dtNascimento, // Formato: YYYY-MM-DD
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');

    if (token == null) throw Exception('Não autenticado');

    final body = <String, dynamic>{};
    if (name != null && name.isNotEmpty) body['name'] = name;
    if (email != null && email.isNotEmpty) body['email'] = email;
    if (endereco != null && endereco.isNotEmpty) body['endereco'] = endereco;
    if (dtNascimento != null && dtNascimento.isNotEmpty) body['dt_nascimento'] = dtNascimento;

    print('📦 Dados para atualização: $body');

    final response = await http.patch(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.me}'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );

    print('📊 Status da atualização: ${response.statusCode}');
    print('📦 Resposta: ${response.body}');

    if (response.statusCode == 200) {
      final updatedData = jsonDecode(response.body);
      await updateLocalUserData(updatedData);
      print('✅ Perfil atualizado e dados locais sincronizados');
      return updatedData;
    } else {
      final errorData = jsonDecode(response.body);
      String errorMessage = 'Erro ao atualizar perfil';
      
      if (errorData.containsKey('detail')) {
        errorMessage = errorData['detail'];
      } else if (errorData.containsKey('email') && errorData['email'].isNotEmpty) {
        errorMessage = 'Email: ${errorData['email'][0]}';
      }
      
      throw Exception(errorMessage);
    }
  }

  // ATUALIZAR SENHA
  Future<void> updatePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');

    if (token == null) throw Exception('Não autenticado');

    final body = {
      'current_password': currentPassword,
      'new_password': newPassword,
    };

    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}/api/change-password/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );

    print('📊 Status da alteração de senha: ${response.statusCode}');
    print('📦 Resposta: ${response.body}');

    if (response.statusCode == 200) {
      print('✅ Senha alterada com sucesso');
    } else {
      final errorData = jsonDecode(response.body);
      String errorMessage = 'Erro ao alterar senha';
      
      if (errorData.containsKey('detail')) {
        errorMessage = errorData['detail'];
      } else if (errorData.containsKey('current_password')) {
        errorMessage = 'Senha atual: ${errorData['current_password'][0]}';
      } else if (errorData.containsKey('new_password')) {
        errorMessage = 'Nova senha: ${errorData['new_password'][0]}';
      }
      
      throw Exception(errorMessage);
    }
  }

  // ATUALIZAR DADOS DO USUÁRIO (SINCRONIZAR COM BACKEND)
  Future<void> refreshUserData() async {
    try {
      final userProfile = await getProfile();
      await updateLocalUserData(userProfile);
      print('✅ Dados do usuário atualizados localmente');
    } catch (e) {
      print('⚠️ Erro ao atualizar dados do usuário: $e');
      rethrow;
    }
  }

  // VERIFICAR SE O TOKEN É VÁLIDO
  Future<bool> validateToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');

    if (token == null) return false;

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.me}'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      return response.statusCode == 200;
    } catch (e) {
      print('❌ Erro ao validar token: $e');
      return false;
    }
  }

  // RENOVAR TOKEN DE ACESSO
  Future<void> refreshAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    final refreshToken = prefs.getString('refresh_token');

    if (refreshToken == null) throw Exception('Refresh token não encontrado');

    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.refresh}'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refresh': refreshToken}),
    );

    print('📊 Status do refresh token: ${response.statusCode}');
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await prefs.setString('access_token', data['access']);
      // Algumas implementações retornam novo refresh token
      if (data.containsKey('refresh')) {
        await prefs.setString('refresh_token', data['refresh']);
      }
      print('✅ Token renovado com sucesso');
    } else {
      throw Exception('Falha ao renovar token: ${response.statusCode}');
    }
  }

  // OBTER DADOS DO USUÁRIO COM TRATAMENTO DE ERRO
  Future<Map<String, dynamic>?> getSafeCurrentUser() async {
    try {
      // Primeiro tenta do cache
      final cachedUser = await getCurrentUser();
      if (cachedUser != null) return cachedUser;
      
      // Se não tem cache, tenta do backend
      final userProfile = await getProfile();
      await updateLocalUserData(userProfile);
      return userProfile;
    } catch (e) {
      print('⚠️ Erro ao obter usuário: $e');
      return null;
    }
  }

  // LIMPAR TODOS OS DADOS DE AUTENTICAÇÃO
  Future<void> clearAllAuthData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
    await prefs.remove('user_data');
    print('✅ Todos os dados de autenticação removidos');
  }

  // VERIFICAR PERMISSÕES DO USUÁRIO
  Future<bool> hasPermission(String permission) async {
    final user = await getSafeCurrentUser();
    if (user == null) return false;
    
    final role = user['role'];
    final isStaff = user['is_staff'] ?? false;
    final isActive = user['is_active'] ?? false;
    
    // Se não está ativo, não tem permissão
    if (!isActive) return false;
    
    // Lógica de permissões baseada em role
    switch (permission) {
      case 'create_chamado':
        return role == 'usuario' || role == 'tecnico' || role == 'admin';
      case 'manage_chamados':
        return role == 'tecnico' || role == 'admin';
      case 'manage_users':
        return role == 'admin';
      case 'access_admin':
        return isStaff || role == 'admin';
      default:
        return false;
    }
  }

  // OBTER ROLE DO USUÁRIO ATUAL
  Future<String> getCurrentUserRole() async {
    final user = await getSafeCurrentUser();
    return user?['role'] ?? 'usuario';
  }

  // VERIFICAR SE USUÁRIO É ADMIN
  Future<bool> isAdmin() async {
    final role = await getCurrentUserRole();
    return role == 'admin';
  }

  // VERIFICAR SE USUÁRIO É TÉCNICO
  Future<bool> isTechnician() async {
    final role = await getCurrentUserRole();
    return role == 'tecnico';
  }

  // VERIFICAR SE USUÁRIO É USUÁRIO COMUM
  Future<bool> isRegularUser() async {
    final role = await getCurrentUserRole();
    return role == 'usuario';
  }

  // VERIFICAR SE USUÁRIO ESTÁ ATIVO
  Future<bool> isUserActive() async {
    final user = await getSafeCurrentUser();
    return user?['is_active'] ?? false;
  }

  // OBTER NOME DO USUÁRIO ATUAL
  Future<String?> getCurrentUserName() async {
    final user = await getSafeCurrentUser();
    return user?['name'];
  }

  // OBTER EMAIL DO USUÁRIO ATUAL
  Future<String?> getCurrentUserEmail() async {
    final user = await getSafeCurrentUser();
    return user?['email'];
  }

  // VERIFICAR CONEXÃO COM O BACKEND
  Future<bool> checkServerConnection() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/health/'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(const Duration(seconds: 10));
      
      return response.statusCode == 200;
    } catch (e) {
      print('❌ Erro na conexão com o servidor: $e');
      return false;
    }
  }

  // FORÇAR SINCRONIZAÇÃO DOS DADOS DO USUÁRIO
  Future<void> forceSyncUserData() async {
    try {
      print('🔄 Forçando sincronização dos dados do usuário...');
      
      // Verifica se está logado
      if (!await isLoggedIn()) {
        throw Exception('Usuário não está logado');
      }
      
      // Tenta renovar token se necessário
      if (!await validateToken()) {
        await refreshAccessToken();
      }
      
      // Busca dados atualizados
      final userProfile = await getProfile();
      
      // Atualiza dados locais
      await updateLocalUserData(userProfile);
      
      print('✅ Sincronização completa');
    } catch (e) {
      print('❌ Erro na sincronização: $e');
      rethrow;
    }
  }
}