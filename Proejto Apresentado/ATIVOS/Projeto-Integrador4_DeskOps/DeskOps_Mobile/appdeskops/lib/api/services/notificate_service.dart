import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/notificate_model.dart';
import '../../core/config.dart'; // Adicione esta importação

class NotificateService {
  final String baseUrl = '${ApiConfig.baseUrl}${ApiConfig.notificates}';

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