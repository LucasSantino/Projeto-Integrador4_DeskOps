import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/environment_model.dart';

class EnvironmentService {
  final String baseUrl = 'http://SEU_BACKEND/api/environments/';

  Future<List<Environment>> getEnvironments() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => Environment.fromJson(e)).toList();
    } else {
      throw Exception('Erro ao buscar ambientes');
    }
  }
}
