import 'dart:convert';
import '../models/ativo_model.dart';
import '../../core/config.dart'; // Adicione esta importação
import '../../core/http_client.dart';

class AtivoService {
  final ApiClient _client = ApiClient();
  
  Future<List<Ativo>> getAtivos() async {
    final response = await _client.get(ApiConfig.ativos);
    final List data = jsonDecode(response.body);
    return data.map((e) => Ativo.fromJson(e)).toList();
  }
  
  Future<Ativo> getAtivoById(int id) async {
    final response = await _client.get('${ApiConfig.ativos}$id/');
    return Ativo.fromJson(jsonDecode(response.body));
  }
  
  Future<Ativo> createAtivo(Ativo ativo) async {
    final response = await _client.post(ApiConfig.ativos, ativo.toJson());
    return Ativo.fromJson(jsonDecode(response.body));
  }
  
  Future<Ativo> updateAtivo(int id, Ativo ativo) async {
    final response = await _client.patch('${ApiConfig.ativos}$id/', ativo.toJson());
    return Ativo.fromJson(jsonDecode(response.body));
  }
  
  Future<void> deleteAtivo(int id) async {
    await _client.delete('${ApiConfig.ativos}$id/');
  }
}