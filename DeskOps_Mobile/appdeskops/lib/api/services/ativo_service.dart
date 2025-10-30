import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/ativo_model.dart';

class AtivoService {
  final String baseUrl = 'http://SEU_BACKEND/api/ativos/';

  Future<List<Ativo>> getAtivos() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => Ativo.fromJson(e)).toList();
    } else {
      throw Exception('Erro ao buscar ativos');
    }
  }
}
