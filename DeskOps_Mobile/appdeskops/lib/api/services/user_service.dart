import 'dart:convert';
import '../models/user_model.dart';
import '../../core/config.dart'; // Adicione esta importação
import '../../core/http_client.dart';

class UserService {
  final ApiClient _client = ApiClient();
  
  Future<List<Users>> getUsers({String? role, bool? isActive, String? search}) async {
    final params = <String, String>{};
    if (role != null) params['role'] = role;
    if (isActive != null) params['is_active'] = isActive.toString();
    if (search != null) params['search'] = search;
    
    final queryString = Uri(queryParameters: params).query;
    final endpoint = '${ApiConfig.users}${queryString.isNotEmpty ? '?$queryString' : ''}';
    
    final response = await _client.get(endpoint);
    final List data = jsonDecode(response.body);
    return data.map((e) => Users.fromJson(e)).toList();
  }
  
  Future<Users> getUserById(int id) async {
    final response = await _client.get('${ApiConfig.users}$id/');
    return Users.fromJson(jsonDecode(response.body));
  }
  
  Future<Users> updateUser(int id, Map<String, dynamic> data) async {
    final response = await _client.patch('${ApiConfig.users}$id/', data);
    return Users.fromJson(jsonDecode(response.body));
  }
  
  Future<void> deleteUser(int id) async {
    await _client.delete('${ApiConfig.users}$id/');
  }
}