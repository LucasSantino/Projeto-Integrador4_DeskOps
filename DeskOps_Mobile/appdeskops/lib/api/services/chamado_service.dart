import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/chamado_model.dart';
import '../../core/config.dart';

class ChamadoService {
  // Método auxiliar para obter o token
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }

  Future<List<Chamado>> getChamados({
    String? status,
    String? prioridade,
    String? order,
    String? search,
    int? employeeId,
  }) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final params = <String, String>{};
    if (status != null) params['status'] = status;
    if (prioridade != null) params['prioridade'] = prioridade;
    if (order != null) params['order'] = order;
    if (search != null) params['search'] = search;
    if (employeeId != null) params['employee'] = employeeId.toString();

    final queryString = Uri(queryParameters: params).query;
    final endpoint =
        '${ApiConfig.chamados}${queryString.isNotEmpty ? '?$queryString' : ''}';

    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}$endpoint'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    print('GET Chamados Status: ${response.statusCode}');

    if (response.statusCode == 200) {
      try {
        final decodedBody = jsonDecode(response.body);

        if (decodedBody is List) {
          // Se for uma lista, processar normalmente
          print('✅ Resposta é uma lista com ${decodedBody.length} itens');
          final List<Chamado> chamados = [];
          for (var item in decodedBody) {
            if (item is Map<String, dynamic>) {
              chamados.add(Chamado.fromJson(item));
            } else if (item is Map) {
              chamados.add(Chamado.fromJson(Map<String, dynamic>.from(item)));
            }
          }
          return chamados;
        } else if (decodedBody is Map) {
          // Se for um objeto, tentar extrair lista
          if (decodedBody.containsKey('results') && decodedBody['results'] is List) {
            final results = decodedBody['results'] as List;
            return results.map((item) => Chamado.fromJson(item)).toList();
          } else if (decodedBody.containsKey('id')) {
            // Se for um único chamado
            return [Chamado.fromJson(Map<String, dynamic>.from(decodedBody))];
          } else {
            throw Exception('Formato de resposta não reconhecido');
          }
        } else {
          throw Exception('Formato de resposta desconhecido');
        }
      } catch (e) {
        print('❌ Erro ao processar resposta: $e');
        throw Exception('Erro ao processar resposta da API: $e');
      }
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  Future<Chamado> getChamadoById(int id) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.chamados}$id/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final decodedBody = jsonDecode(response.body);
      return Chamado.fromJson(decodedBody);
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  Future<Chamado> createChamado({
    required String title,
    required String description,
    required String prioridade,
    required int assetId,
    int? environmentId,
    String? categoria,
    File? imagem,
  }) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    // Se tiver imagem, usa multipart, senão JSON normal
    if (imagem != null) {
      return _createChamadoComImagem(
        title: title,
        description: description,
        prioridade: prioridade,
        assetId: assetId,
        environmentId: environmentId,
        categoria: categoria,
        imagem: imagem,
        token: token,
      );
    } else {
      return _createChamadoSemImagem(
        title: title,
        description: description,
        prioridade: prioridade,
        assetId: assetId,
        environmentId: environmentId,
        categoria: categoria,
        token: token,
      );
    }
  }

  Future<Chamado> _createChamadoSemImagem({
    required String title,
    required String description,
    required String prioridade,
    required int assetId,
    int? environmentId,
    String? categoria,
    required String token,
  }) async {
    final data = {
      'title': title,
      'description': description,
      'prioridade': prioridade,
      'asset': assetId,
      if (environmentId != null) 'environment': environmentId,
      if (categoria != null) 'categoria': categoria,
    };

    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.chamados}'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(data),
    );

    print('POST Chamado Status: ${response.statusCode}');
    print('POST Chamado Body: ${response.body}');

    if (response.statusCode == 201 || response.statusCode == 200) {
      final decodedBody = jsonDecode(response.body);
      return Chamado.fromJson(decodedBody);
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  Future<Chamado> _createChamadoComImagem({
    required String title,
    required String description,
    required String prioridade,
    required int assetId,
    int? environmentId,
    String? categoria,
    required File imagem,
    required String token,
  }) async {
    var request = http.MultipartRequest(
      'POST',
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.chamados}'),
    );

    // Adicionar campos
    request.fields['title'] = title;
    request.fields['description'] = description;
    request.fields['prioridade'] = prioridade;
    request.fields['asset'] = assetId.toString();
    if (environmentId != null) {
      request.fields['environment'] = environmentId.toString();
    }
    if (categoria != null) {
      request.fields['categoria'] = categoria;
    }

    // Adicionar imagem
    request.files.add(
      await http.MultipartFile.fromPath(
        'photo',
        imagem.path,
        filename: imagem.path.split('/').last,
      ),
    );

    // Adicionar token
    request.headers['Authorization'] = 'Bearer $token';

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    print('POST Chamado com Imagem Status: ${response.statusCode}');
    print('POST Chamado com Imagem Body: ${response.body}');

    if (response.statusCode == 201 || response.statusCode == 200) {
      final decodedBody = jsonDecode(response.body);
      return Chamado.fromJson(decodedBody);
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  Future<Chamado> updateChamado(int id, Map<String, dynamic> data) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final response = await http.patch(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.chamados}$id/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(data),
    );

    if (response.statusCode == 200) {
      final decodedBody = jsonDecode(response.body);
      return Chamado.fromJson(decodedBody);
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  Future<Chamado> editarChamado(int id, Map<String, dynamic> data) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final response = await http.patch(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.editarChamado}$id/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(data),
    );

    if (response.statusCode == 200) {
      final decodedBody = jsonDecode(response.body);
      return Chamado.fromJson(decodedBody);
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  Future<Chamado> atribuirChamado(int id) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final response = await http.patch(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.chamados}$id/atribuir/'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({}),
    );

    if (response.statusCode == 200) {
      final decodedBody = jsonDecode(response.body);
      return Chamado.fromJson(decodedBody);
    } else {
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }

  // CORREÇÃO: Método encerrarChamado atualizado
  Future<Chamado> encerrarChamado(int id) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    print('🔄 Tentando encerrar chamado ID: $id');
    
    // Primeiro, tentar o endpoint específico de encerramento
    try {
      final response = await http.patch(
        Uri.parse('${ApiConfig.baseUrl}${ApiConfig.chamados}$id/encerrar/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({}),
      );

      print('Endpoint de encerrar chamado status: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        final decodedBody = jsonDecode(response.body);
        return Chamado.fromJson(decodedBody);
      }
    } catch (e) {
      print('❌ Endpoint específico de encerrar falhou: $e');
    }

    // Se o endpoint específico não existir, usar o endpoint de update com status cancelado
    print('🔄 Tentando método alternativo: atualizar status para CANCELADO');
    return await updateChamado(id, {'status': 'CANCELADO'});
  }

  Future<void> deleteChamado(int id) async {
    final token = await _getToken();
    if (token == null) {
      throw Exception('Usuário não autenticado');
    }

    final response = await http.delete(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.chamados}$id/'),
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