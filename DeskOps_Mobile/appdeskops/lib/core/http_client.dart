import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'config.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();
  
  Future<Map<String, String>> _getHeaders({bool hasToken = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (hasToken) {
      final token = await _getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    
    return headers;
  }
  
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('access_token');
  }
  
  Future<http.Response> get(String endpoint, {Map<String, String>? customHeaders}) async {
    final url = '${ApiConfig.baseUrl}$endpoint';
    print('🔵 GET: $url');
    
    final headers = await _getHeaders();
    if (customHeaders != null) headers.addAll(customHeaders);
    
    try {
      final response = await http.get(
        Uri.parse(url),
        headers: headers,
      ).timeout(const Duration(seconds: 60));
      
      print('🟢 GET Response ${response.statusCode}: ${response.body.substring(0, min(200, response.body.length))}');
      return _handleResponse(response);
    } catch (e) {
      print('🔴 GET Error: $e');
      rethrow;
    }
  }
  
  Future<http.Response> post(String endpoint, dynamic body, {Map<String, String>? customHeaders}) async {
    final url = '${ApiConfig.baseUrl}$endpoint';
    print('🔵 POST: $url');
    print('📦 Body: $body');
    
    final headers = await _getHeaders();
    if (customHeaders != null) headers.addAll(customHeaders);
    
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: headers,
        body: jsonEncode(body),
      ).timeout(const Duration(seconds: 60));
      
      print('🟢 POST Response ${response.statusCode}: ${response.body.substring(0, min(200, response.body.length))}');
      return _handleResponse(response);
    } catch (e) {
      print('🔴 POST Error: $e');
      rethrow;
    }
  }
  
  Future<http.Response> patch(String endpoint, dynamic body, {Map<String, String>? customHeaders}) async {
    final url = '${ApiConfig.baseUrl}$endpoint';
    print('🔵 PATCH: $url');
    print('📦 Body: $body');
    
    final headers = await _getHeaders();
    if (customHeaders != null) headers.addAll(customHeaders);
    
    try {
      final response = await http.patch(
        Uri.parse(url),
        headers: headers,
        body: jsonEncode(body),
      ).timeout(const Duration(seconds: 60));
      
      print('🟢 PATCH Response ${response.statusCode}: ${response.body.substring(0, min(200, response.body.length))}');
      return _handleResponse(response);
    } catch (e) {
      print('🔴 PATCH Error: $e');
      rethrow;
    }
  }
  
  Future<http.Response> delete(String endpoint, {Map<String, String>? customHeaders}) async {
    final url = '${ApiConfig.baseUrl}$endpoint';
    print('🔵 DELETE: $url');
    
    final headers = await _getHeaders();
    if (customHeaders != null) headers.addAll(customHeaders);
    
    try {
      final response = await http.delete(
        Uri.parse(url),
        headers: headers,
      ).timeout(const Duration(seconds: 60));
      
      print('🟢 DELETE Response ${response.statusCode}: ${response.body}');
      return _handleResponse(response);
    } catch (e) {
      print('🔴 DELETE Error: $e');
      rethrow;
    }
  }
  
  http.Response _handleResponse(http.Response response) {
    if (response.statusCode == 401) {
      _handleTokenExpired();
      throw Exception('Sessão expirada. Faça login novamente.');
    }
    
    if (response.statusCode >= 400) {
      print('❌ HTTP Error ${response.statusCode}: ${response.body}');
      try {
        final errorData = jsonDecode(response.body);
        final errorMessage = errorData['detail'] ?? 
                            errorData['error'] ?? 
                            errorData['message'] ??
                            'Erro na requisição (${response.statusCode})';
        throw Exception(errorMessage);
      } catch (e) {
        throw Exception('Erro ${response.statusCode}: ${response.body}');
      }
    }
    
    return response;
  }
  
  Future<void> _handleTokenExpired() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
  }
  
  int min(int a, int b) => a < b ? a : b;
}