import 'dart:convert';
import '../models/environment_model.dart';
import '../../core/config.dart'; // Importação adicionada
import '../../core/http_client.dart'; // Usando nosso ApiClient

class EnvironmentService {
  final ApiClient _client = ApiClient();
  
  Future<List<Environment>> getEnvironments() async {
    final response = await _client.get(ApiConfig.environments);
    final List data = jsonDecode(response.body);
    return data.map((e) => Environment.fromJson(e)).toList();
  }
  
  Future<Environment> getEnvironmentById(int id) async {
    final response = await _client.get('${ApiConfig.environments}$id/');
    return Environment.fromJson(jsonDecode(response.body));
  }
  
  Future<Environment> createEnvironment({
    required String name,
    required String description,
    int? employeeId,
  }) async {
    final data = {
      'name': name,
      'description': description,
      if (employeeId != null) 'employee': employeeId,
    };
    
    final response = await _client.post(ApiConfig.environments, data);
    return Environment.fromJson(jsonDecode(response.body));
  }
  
  Future<Environment> updateEnvironment(int id, Map<String, dynamic> data) async {
    final response = await _client.patch('${ApiConfig.environments}$id/', data);
    return Environment.fromJson(jsonDecode(response.body));
  }
  
  Future<void> deleteEnvironment(int id) async {
    await _client.delete('${ApiConfig.environments}$id/');
  }
  
  // Método específico para filtrar por funcionário (conforme sua view do Django)
  Future<List<Environment>> filterByEmployee(int employeeId) async {
    final endpoint = '${ApiConfig.environments}filter-by-employee/$employeeId/';
    final response = await _client.get(endpoint);
    final List data = jsonDecode(response.body);
    return data.map((e) => Environment.fromJson(e)).toList();
  }
  
  // Método de busca (search)
  Future<List<Environment>> searchEnvironments(String query) async {
    final endpoint = '${ApiConfig.environments}search/?q=$query';
    final response = await _client.get(endpoint);
    final List data = jsonDecode(response.body);
    return data.map((e) => Environment.fromJson(e)).toList();
  }
}