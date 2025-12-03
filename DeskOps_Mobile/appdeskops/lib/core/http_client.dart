import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'config.dart';

class ApiClient {
  // Singleton
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
    final headers = await _getHeaders();
    if (customHeaders != null) headers.addAll(customHeaders);
    
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}$endpoint'),
      headers: headers,
    ).timeout(const Duration(seconds: 30));
    
    return _handleResponse(response);
  }
  
  Future<http.Response> post(String endpoint, dynamic body, {Map<String, String>? customHeaders}) async {
    final headers = await _getHeaders();
    if (customHeaders != null) headers.addAll(customHeaders);
    
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    ).timeout(const Duration(seconds: 30));
    
    return _handleResponse(response);
  }
  
  Future<http.Response> put(String endpoint, dynamic body, {Map<String, String>? customHeaders}) async {
    final headers = await _getHeaders();
    if (customHeaders != null) headers.addAll(customHeaders);
    
    final response = await http.put(
      Uri.parse('${ApiConfig.baseUrl}$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    ).timeout(const Duration(seconds: 30));
    
    return _handleResponse(response);
  }
  
  Future<http.Response> patch(String endpoint, dynamic body, {Map<String, String>? customHeaders}) async {
    final headers = await _getHeaders();
    if (customHeaders != null) headers.addAll(customHeaders);
    
    final response = await http.patch(
      Uri.parse('${ApiConfig.baseUrl}$endpoint'),
      headers: headers,
      body: jsonEncode(body),
    ).timeout(const Duration(seconds: 30));
    
    return _handleResponse(response);
  }
  
  Future<http.Response> delete(String endpoint, {Map<String, String>? customHeaders}) async {
    final headers = await _getHeaders();
    if (customHeaders != null) headers.addAll(customHeaders);
    
    final response = await http.delete(
      Uri.parse('${ApiConfig.baseUrl}$endpoint'),
      headers: headers,
    ).timeout(const Duration(seconds: 30));
    
    return _handleResponse(response);
  }
  
  Future<http.Response> uploadMultipart(
    String endpoint, 
    String fieldName, 
    List<int> fileBytes,
    String fileName,
    Map<String, dynamic>? otherFields,
  ) async {
    final headers = await _getHeaders();
    headers.remove('Content-Type'); // Multipart define seu próprio
    
    var request = http.MultipartRequest('POST', Uri.parse('${ApiConfig.baseUrl}$endpoint'));
    request.headers.addAll(headers);
    
    request.files.add(http.MultipartFile.fromBytes(
      fieldName,
      fileBytes,
      filename: fileName,
    ));
    
    if (otherFields != null) {
      request.fields.addAll(
        otherFields.map((key, value) => MapEntry(key, value.toString()))
      );
    }
    
    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);
    
    return _handleResponse(response);
  }
  
  http.Response _handleResponse(http.Response response) {
    print('Response Status: ${response.statusCode}');
    print('Response Body: ${response.body}');
    
    if (response.statusCode == 401) {
      // Token expirado
      _handleTokenExpired();
      throw Exception('Sessão expirada. Faça login novamente.');
    }
    
    if (response.statusCode >= 400) {
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
    // Tentar refresh token ou limpar dados
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    // Aqui você poderia implementar refresh token
  }
}