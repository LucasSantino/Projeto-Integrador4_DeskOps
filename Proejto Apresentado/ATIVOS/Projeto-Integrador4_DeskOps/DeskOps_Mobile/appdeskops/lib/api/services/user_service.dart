import 'dart:convert';
import 'dart:io'; // ADICIONE ESTA LINHA
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../../core/config.dart';

class UserService {
  
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }
  
  Future<List<Users>> getUsers({String? role, bool? isActive, String? search}) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }
    
    final params = <String, String>{};
    if (role != null) params['role'] = role;
    if (isActive != null) params['is_active'] = isActive.toString();
    if (search != null) params['search'] = search;
    
    final queryString = Uri(queryParameters: params).query;
    final endpoint = '${ApiConfig.users}${queryString.isNotEmpty ? '?$queryString' : ''}';
    
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}$endpoint'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => Users.fromJson(e)).toList();
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }
  
  // Obter perfil do usuário atual
  Future<Map<String, dynamic>> getUserProfile() async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }
    
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
  
  // Atualizar perfil do usuário
  Future<Map<String, dynamic>> updateUserProfile({
    String? name,
    String? email,
    String? endereco,
    String? dtNascimento, // Formato: YYYY-MM-DD
    String? fotoUser,
  }) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }
    
    final body = <String, dynamic>{};
    if (name != null && name.isNotEmpty) body['name'] = name;
    if (email != null && email.isNotEmpty) body['email'] = email;
    if (endereco != null && endereco.isNotEmpty) body['endereco'] = endereco;
    if (dtNascimento != null && dtNascimento.isNotEmpty) body['dt_nascimento'] = dtNascimento;
    if (fotoUser != null && fotoUser.isNotEmpty) body['foto_user'] = fotoUser;
    
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
      return jsonDecode(response.body);
    } else {
      final errorData = jsonDecode(response.body);
      String errorMessage = 'Erro ao atualizar perfil';
      
      if (errorData.containsKey('detail')) {
        errorMessage = errorData['detail'];
      } else if (errorData.containsKey('email') && (errorData['email'] as List).isNotEmpty) {
        errorMessage = 'Email: ${errorData['email'][0]}';
      }
      
      throw Exception(errorMessage);
    }
  }
  
  // Alterar senha
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }
    
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
    
    if (response.statusCode == 200) {
      return;
    } else {
      final errorData = jsonDecode(response.body);
      String errorMessage = 'Erro ao alterar senha';
      
      if (errorData.containsKey('detail')) {
        errorMessage = errorData['detail'];
      } else if (errorData.containsKey('current_password')) {
        errorMessage = 'Senha atual: ${errorData['current_password'][0]}';
      }
      
      throw Exception(errorMessage);
    }
  }
  
  // Upload de foto de perfil
  Future<String> uploadProfilePhoto(File imageFile) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }
    
    final uri = Uri.parse('${ApiConfig.baseUrl}/api/upload-profile-photo/');
    final request = http.MultipartRequest('POST', uri)
      ..headers['Authorization'] = 'Bearer $token'
      ..files.add(await http.MultipartFile.fromPath(
        'foto_user',
        imageFile.path,
        filename: 'profile_${DateTime.now().millisecondsSinceEpoch}.jpg',
      ));
    
    final response = await request.send();
    final responseData = await http.Response.fromStream(response);
    
    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(responseData.body);
      return data['foto_user'] ?? data['photo_url'] ?? '';
    } else {
      throw Exception('Erro ao fazer upload da foto: ${responseData.body}');
    }
  }
}