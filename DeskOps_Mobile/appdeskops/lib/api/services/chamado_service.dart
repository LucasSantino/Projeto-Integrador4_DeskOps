import 'dart:convert';
import 'dart:io'; // Adicione esta importação
import '../models/chamado_model.dart';
import '../../core/config.dart';
import '../../core/http_client.dart';

class ChamadoService {
  final ApiClient _client = ApiClient();
  
  Future<List<Chamado>> getChamados({
    String? status,
    String? prioridade,
    String? order,
    String? search,
    int? employeeId,
  }) async {
    final params = <String, String>{};
    if (status != null) params['status'] = status;
    if (prioridade != null) params['prioridade'] = prioridade;
    if (order != null) params['order'] = order;
    if (search != null) params['search'] = search;
    if (employeeId != null) params['employee'] = employeeId.toString();
    
    final queryString = Uri(queryParameters: params).query;
    final endpoint = '${ApiConfig.chamados}${queryString.isNotEmpty ? '?$queryString' : ''}';
    
    final response = await _client.get(endpoint);
    final List data = jsonDecode(response.body);
    return data.map((e) => Chamado.fromJson(e)).toList();
  }
  
  Future<Chamado> getChamadoById(int id) async {
    final response = await _client.get('${ApiConfig.chamados}$id/');
    return Chamado.fromJson(jsonDecode(response.body));
  }
  
  Future<Chamado> createChamado({
    required String title,
    required String description,
    required String prioridade,
    required int assetId,
    int? environmentId,
    String? categoria,
    String? photoPath,
  }) async {
    final data = {
      'title': title,
      'description': description,
      'prioridade': prioridade,
      'asset': assetId,
      if (environmentId != null) 'environment_id': environmentId,
      if (categoria != null) 'categoria': categoria,
    };
    
    if (photoPath != null && photoPath.isNotEmpty) {
      // Upload de imagem multipart
      final file = File(photoPath);
      final fileBytes = await file.readAsBytes();
      final fileName = photoPath.split('/').last;
      
      final response = await _client.uploadMultipart(
        ApiConfig.chamados,
        'photo',
        fileBytes,
        fileName,
        data,
      );
      return Chamado.fromJson(jsonDecode(response.body));
    } else {
      final response = await _client.post(ApiConfig.chamados, data);
      return Chamado.fromJson(jsonDecode(response.body));
    }
  }
  
  Future<Chamado> updateChamado(int id, Map<String, dynamic> data) async {
    final response = await _client.patch('${ApiConfig.chamados}$id/', data);
    return Chamado.fromJson(jsonDecode(response.body));
  }
  
  Future<Chamado> editarChamado(int id, Map<String, dynamic> data) async {
    final response = await _client.patch('${ApiConfig.editarChamado}$id/', data);
    return Chamado.fromJson(jsonDecode(response.body));
  }
  
  Future<Chamado> atribuirChamado(int id) async {
    final response = await _client.patch('${ApiConfig.chamados}$id/atribuir/', {});
    return Chamado.fromJson(jsonDecode(response.body));
  }
  
  Future<Chamado> encerrarChamado(int id) async {
    final response = await _client.patch('${ApiConfig.encerrarChamado}$id/', {});
    return Chamado.fromJson(jsonDecode(response.body));
  }
  
  Future<void> deleteChamado(int id) async {
    await _client.delete('${ApiConfig.chamados}$id/');
  }
}