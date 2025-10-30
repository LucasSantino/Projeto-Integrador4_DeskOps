import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/chamado_model.dart';

class ChamadoService {
  final String baseUrl = 'http://SEU_BACKEND/api/chamados/';

  Future<List<Chamado>> getChamados() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => Chamado.fromJson(e)).toList();
    } else {
      throw Exception('Erro ao buscar chamados');
    }
  }
}
