import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/notificate_model.dart';

class NotificateService {
  final String baseUrl = 'http://SEU_BACKEND/api/notificates/';

  Future<List<Notificate>> getNotificates() async {
    final response = await http.get(Uri.parse(baseUrl));
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => Notificate.fromJson(e)).toList();
    } else {
      throw Exception('Erro ao buscar notificações');
    }
  }
}
