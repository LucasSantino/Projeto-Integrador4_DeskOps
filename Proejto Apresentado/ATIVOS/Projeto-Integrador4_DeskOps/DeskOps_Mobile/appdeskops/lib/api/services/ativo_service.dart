import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/ativo_model.dart';
import '../models/status_models.dart';  // Adicionado import para StatusAtivos
import '../../core/config.dart';

class AtivoService {
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

  // Método auxiliar para processar resposta
  List<Ativo> _processarRespostaLista(dynamic data) {
    print('📥 Processando resposta... Tipo: ${data.runtimeType}');
    
    if (data is List) {
      print('✅ Resposta é uma lista com ${data.length} itens');
      
      final List<Ativo> ativos = [];
      for (int i = 0; i < data.length; i++) {
        try {
          final item = data[i];
          
          if (item is Map<String, dynamic>) {
            ativos.add(Ativo.fromJson(item));
          } else if (item is Map) {
            ativos.add(Ativo.fromJson(Map<String, dynamic>.from(item)));
          } else {
            print('⚠️ Item $i não é um Map: ${item.runtimeType}');
          }
        } catch (e) {
          print('❌ Erro ao processar item $i: $e');
          print('Item problemático: ${data[i]}');
        }
      }
      return ativos;
      
    } else if (data is Map) {
      print('📋 Resposta é um objeto Map');
      try {
        final mapData = _convertToMapStringDynamic(data);
        
        // Tentar diferentes formatos de resposta
        if (mapData.containsKey('results') && mapData['results'] is List) {
          print('📦 Encontrado campo "results"');
          return _processarRespostaLista(mapData['results']);
        } else if (mapData.containsKey('data') && mapData['data'] is List) {
          print('📦 Encontrado campo "data"');
          return _processarRespostaLista(mapData['data']);
        } else if (mapData.containsKey('ativos') && mapData['ativos'] is List) {
          print('📦 Encontrado campo "ativos"');
          return _processarRespostaLista(mapData['ativos']);
        } else if (mapData.containsKey('id')) {
          print('📦 É um único objeto Ativo');
          return [Ativo.fromJson(mapData)];
        } else {
          print('⚠️ Formato de objeto não reconhecido. Chaves: ${mapData.keys}');
          // Tentar extrair qualquer lista
          for (var key in mapData.keys) {
            if (mapData[key] is List) {
              print('🔍 Encontrada lista no campo "$key"');
              return _processarRespostaLista(mapData[key]);
            }
          }
          return [];
        }
      } catch (e) {
        print('❌ Erro ao processar Map: $e');
        return [];
      }
    } else {
      print('❌ Formato de resposta desconhecido: ${data.runtimeType}');
      return [];
    }
  }

  Future<List<Ativo>> getAtivos() async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    try {
      print('🔍 Buscando ativos...');
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.ativos}'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      print('📡 GET Ativos Status: ${response.statusCode}');

      if (response.statusCode == 200) {
        try {
          final decoded = jsonDecode(response.body);
          final ativos = _processarRespostaLista(decoded);
          print('✅ ${ativos.length} ativos processados com sucesso');
          return ativos;
        } catch (e) {
          print('❌ Erro ao processar JSON: $e');
          print('📄 Response body: ${response.body}');
          return [];
        }
      } else {
        print('⚠️ Erro HTTP ${response.statusCode}: ${response.body}');
        return [];
      }
    } catch (e) {
      print('❌ Erro em getAtivos: $e');
      return [];
    }
  }

  Future<List<Ativo>> getAtivosDisponiveis() async {
    try {
      print('🔍 Buscando ativos disponíveis...');
      
      // Primeiro pegar todos os ativos
      final todosAtivos = await getAtivos();
      
      // Filtrar apenas os ativos com status ATIVO
      final ativosDisponiveis = todosAtivos.where((ativo) {
        return ativo.status == StatusAtivos.ATIVO;
      }).toList();
      
      print('✅ ${ativosDisponiveis.length} ativos disponíveis encontrados');
      return ativosDisponiveis;
    } catch (e) {
      print('❌ Erro em getAtivosDisponiveis: $e');
      return [];
    }
  }

  Future<List<Ativo>> getAtivosPorAmbiente(int environmentId) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.ativos}?environment_FK=$environmentId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        return _processarRespostaLista(decoded);
      } else {
        print('⚠️ Erro ao buscar ativos por ambiente: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('❌ Erro em getAtivosPorAmbiente: $e');
      return [];
    }
  }

  Future<List<Ativo>> searchAtivos(String query) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.ativos}?search=$query'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        return _processarRespostaLista(decoded);
      } else {
        print('⚠️ Erro na busca de ativos: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('❌ Erro em searchAtivos: $e');
      return [];
    }
  }

  Future<Ativo> getAtivoById(int id) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.ativos}$id/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        if (decoded is Map<String, dynamic>) {
          return Ativo.fromJson(decoded);
        } else if (decoded is Map) {
          return Ativo.fromJson(Map<String, dynamic>.from(decoded));
        } else {
          throw Exception('Formato de resposta inválido para ativo');
        }
      } else {
        throw Exception('Erro ${response.statusCode}: ${response.body}');
      }
    } catch (e) {
      print('❌ Erro em getAtivoById: $e');
      rethrow;
    }
  }

  Future<Ativo> createAtivo(Ativo ativo) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.ativos}'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(ativo.toJson()),
    );

    if (response.statusCode == 201 || response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) {
        return Ativo.fromJson(decoded);
      } else if (decoded is Map) {
        return Ativo.fromJson(Map<String, dynamic>.from(decoded));
      } else {
        throw Exception('Formato de resposta inválido para ativo criado');
      }
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  Future<Ativo> updateAtivo(int id, Ativo ativo) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final response = await http.patch(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.ativos}$id/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(ativo.toJson()),
    );

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      if (decoded is Map<String, dynamic>) {
        return Ativo.fromJson(decoded);
      } else if (decoded is Map) {
        return Ativo.fromJson(Map<String, dynamic>.from(decoded));
      } else {
        throw Exception('Formato de resposta inválido para ativo atualizado');
      }
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  Future<void> deleteAtivo(int id) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final response = await http.delete(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.ativos}$id/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode != 204 && response.statusCode != 200) {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }
}