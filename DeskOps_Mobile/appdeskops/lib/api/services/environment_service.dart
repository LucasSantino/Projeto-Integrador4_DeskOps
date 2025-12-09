import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/environment_model.dart';
import '../../core/config.dart';

class EnvironmentService {
  // Método auxiliar para obter o token
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }

  // Método auxiliar para converter Map<dynamic, dynamic> para Map<String, dynamic>
  Map<String, dynamic> _convertToMapStringDynamic(dynamic map) {
    if (map is Map<String, dynamic>) {
      return map;
    } else if (map is Map) {
      return Map<String, dynamic>.from(map);
    } else {
      throw Exception('Tipo de dados inválido para conversão: ${map.runtimeType}');
    }
  }

  // Método auxiliar para criar Environment a partir de diferentes tipos de dados
  Environment _criarEnvironmentAPartirDeDados(dynamic dados) {
    if (dados is Map<String, dynamic>) {
      return Environment.fromJson(dados);
    } else if (dados is Map) {
      return Environment.fromJson(Map<String, dynamic>.from(dados));
    } else if (dados is int) {
      // Se for apenas um ID, criar um Environment básico
      return Environment(
        id: dados,
        name: 'Ambiente #$dados',
        description: 'Descrição não disponível',
        employee: null,
      );
    } else if (dados is String && int.tryParse(dados) != null) {
      // Se for string que pode ser convertida para int
      final id = int.parse(dados);
      return Environment(
        id: id,
        name: 'Ambiente #$id',
        description: 'Descrição não disponível',
        employee: null,
      );
    } else {
      print('⚠️ Tipo de dados inesperado para criar Environment: ${dados.runtimeType} - $dados');
      throw Exception('Não foi possível criar Environment a partir dos dados fornecidos: $dados');
    }
  }

  // Método auxiliar para processar resposta
  List<Environment> _processarRespostaLista(dynamic data) {
    print('📥 Processando resposta de ambientes... Tipo: ${data.runtimeType}');
    
    if (data is List) {
      print('✅ Resposta é uma lista com ${data.length} itens');
      
      final List<Environment> ambientes = [];
      for (int i = 0; i < data.length; i++) {
        try {
          final item = data[i];
          print('  Item $i: $item (${item.runtimeType})');
          
          final ambiente = _criarEnvironmentAPartirDeDados(item);
          ambientes.add(ambiente);
        } catch (e) {
          print('❌ Erro ao processar item $i: $e');
          // Continua processando outros itens
        }
      }
      return ambientes;
      
    } else if (data is Map) {
      print('📋 Resposta é um objeto Map');
      final mapData = _convertToMapStringDynamic(data);
      
      // Tentar diferentes formatos de resposta
      if (mapData.containsKey('results') && mapData['results'] is List) {
        print('📦 Encontrado campo "results"');
        return _processarRespostaLista(mapData['results']);
      } else if (mapData.containsKey('data') && mapData['data'] is List) {
        print('📦 Encontrado campo "data"');
        return _processarRespostaLista(mapData['data']);
      } else if (mapData.containsKey('environments') && mapData['environments'] is List) {
        print('📦 Encontrado campo "environments"');
        return _processarRespostaLista(mapData['environments']);
      } else if (mapData.containsKey('id')) {
        print('📦 É um único objeto Environment');
        return [_criarEnvironmentAPartirDeDados(mapData)];
      } else {
        print('⚠️ Formato de objeto não reconhecido. Chaves: ${mapData.keys}');
        throw Exception('Formato de resposta não reconhecido');
      }
    } else if (data is int || data is String) {
      print('📌 Resposta é um único valor (ID)');
      return [_criarEnvironmentAPartirDeDados(data)];
    } else {
      print('❌ Formato de resposta desconhecido: ${data.runtimeType}');
      throw Exception('Formato de resposta desconhecido: ${data.runtimeType}');
    }
  }

  Future<List<Environment>> getEnvironments() async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    try {
      print('🔍 Buscando ambientes...');
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.environments}'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('📡 GET Environments Status: ${response.statusCode}');
      print('📡 GET Environments Body: ${response.body}');

      if (response.statusCode == 200) {
        try {
          final decoded = jsonDecode(response.body);
          final ambientes = _processarRespostaLista(decoded);
          print('✅ ${ambientes.length} ambientes processados com sucesso');
          return ambientes;
        } catch (e) {
          print('❌ Erro ao processar JSON: $e');
          print('📄 Response body: ${response.body}');
          // Em vez de lançar exceção, retorna lista vazia
          return [];
        }
      } else {
        print('⚠️ Erro na API, retornando lista vazia');
        return [];
      }
    } catch (e) {
      print('❌ Erro em getEnvironments: $e');
      // Em caso de erro, retornar lista vazia para não quebrar a UI
      return [];
    }
  }

  Future<List<Environment>> searchEnvironments(String query) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    try {
      print('🔍 Buscando ambientes com query: $query');
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.environments}?search=$query'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('📡 Search Environments Status: ${response.statusCode}');

      if (response.statusCode == 200) {
        try {
          final decoded = jsonDecode(response.body);
          return _processarRespostaLista(decoded);
        } catch (e) {
          print('❌ Erro ao processar busca: $e');
          return [];
        }
      } else {
        print('⚠️ Erro na busca, retornando lista vazia');
        return [];
      }
    } catch (e) {
      print('❌ Erro em searchEnvironments: $e');
      return [];
    }
  }

  Future<Environment> getEnvironmentById(int id) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.environments}$id/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        return _criarEnvironmentAPartirDeDados(decoded);
      } else {
        throw Exception('Erro ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      print('❌ Erro em getEnvironmentById: $e');
      rethrow;
    }
  }

  Future<Environment> createEnvironment({
    required String name,
    required String description,
    int? employeeId,
  }) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final data = {
      'name': name,
      'description': description,
      if (employeeId != null) 'employee': employeeId,
    };

    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.environments}'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(data),
    );

    if (response.statusCode == 201 || response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      return _criarEnvironmentAPartirDeDados(decoded);
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  Future<Environment> updateEnvironment(int id, Map<String, dynamic> data) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final response = await http.patch(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.environments}$id/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(data),
    );

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      return _criarEnvironmentAPartirDeDados(decoded);
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  Future<void> deleteEnvironment(int id) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final response = await http.delete(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.environments}$id/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode != 204 && response.statusCode != 200) {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  Future<List<Environment>> filterByEmployee(int employeeId) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    try {
      print('🔍 Filtrando ambientes por employee: $employeeId');
      final endpoint = '${ApiConfig.baseUrl}${ApiConfig.environments}filter-by-employee/$employeeId/';
      print('URL filterByEmployee: $endpoint');
      
      final response = await http.get(
        Uri.parse(endpoint),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('Filter by Employee Status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        return _processarRespostaLista(decoded);
      } else {
        print('⚠️ Erro no filtro por employee, retornando lista vazia');
        return [];
      }
    } catch (e) {
      print('❌ Erro em filterByEmployee: $e');
      return [];
    }
  }
}