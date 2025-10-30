import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';

class UserService {
  final String baseUrl = 'http://SEU_BACKEND/api/users/';

  Future<List<Users>> getUsers() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => Users.fromJson(e)).toList();
    } else {
      throw Exception('Erro ao buscar usuários');
    }
  }
}
