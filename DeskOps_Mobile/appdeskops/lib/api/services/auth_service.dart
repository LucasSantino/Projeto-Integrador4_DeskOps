import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/config.dart';
import '../../core/http_client.dart';

class AuthService {
  final ApiClient _client = ApiClient();
  
  Future<Map<String, dynamic>> login(String email, String password) async {
    print('Login attempt: $email');
    
    final response = await _client.post(ApiConfig.login, {
      'email': email,
      'password': password,
    }, customHeaders: {'Content-Type': 'application/x-www-form-urlencoded'});
    
    final data = jsonDecode(response.body);
    print('Login response: $data');
    
    final prefs = await SharedPreferences.getInstance();
    
    // Salvar tokens
    await prefs.setString('access_token', data['access']);
    await prefs.setString('refresh_token', data['refresh']);
    
    // Salvar dados do usuário
    if (data['user'] != null) {
      await prefs.setString('user_data', jsonEncode(data['user']));
    }
    
    return data;
  }
  
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    final refreshToken = prefs.getString('refresh_token');
    
    if (refreshToken != null) {
      try {
        await _client.post(ApiConfig.logout, {
          'refresh': refreshToken,
        });
      } catch (e) {
        print('Erro no logout (pode ser normal): $e');
      }
    }
    
    // Limpar dados locais
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
    await prefs.remove('user_data');
  }
  
  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    required String cpf,
    required DateTime dtNascimento,
    required String endereco,
  }) async {
    final response = await _client.post(ApiConfig.register, {
      'name': name,
      'email': email,
      'password': password,
      'cpf': cpf,
      'dt_nascimento': dtNascimento.toIso8601String().split('T')[0],
      'endereco': endereco,
    });
    
    return jsonDecode(response.body);
  }
  
  Future<Map<String, dynamic>> refreshToken() async {
    final prefs = await SharedPreferences.getInstance();
    final refreshToken = prefs.getString('refresh_token');
    
    if (refreshToken == null) {
      throw Exception('Nenhum refresh token disponível');
    }
    
    final response = await _client.post(ApiConfig.refresh, {
      'refresh': refreshToken,
    });
    
    final data = jsonDecode(response.body);
    await prefs.setString('access_token', data['access']);
    
    return data;
  }
  
  Future<Map<String, dynamic>> getProfile() async {
    final response = await _client.get(ApiConfig.me);
    return jsonDecode(response.body);
  }
  
  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    final response = await _client.patch(ApiConfig.me, data);
    return jsonDecode(response.body);
  }
  
  Future<Map<String, dynamic>> updateUser(int userId, Map<String, dynamic> data) async {
    final response = await _client.patch('${ApiConfig.usuarioDetail}$userId/', data);
    return jsonDecode(response.body);
  }
  
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('access_token');
    if (token == null) return false;
    
    // Verificar se token é válido (opcional)
    return true;
  }
  
  Future<Map<String, dynamic>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString('user_data');
    if (userData != null) {
      return jsonDecode(userData);
    }
    return null;
  }
}