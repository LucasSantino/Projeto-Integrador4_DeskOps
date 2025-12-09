import 'environment_model.dart';
import 'status_models.dart';

class Ativo {
  int? id;
  String name;
  String description;
  StatusAtivos status;
  Environment environment;
  String? qrCode;

  Ativo({
    this.id,
    required this.name,
    required this.description,
    this.status = StatusAtivos.ATIVO,
    required this.environment,
    this.qrCode,
  });

  factory Ativo.fromJson(Map<String, dynamic> json) {
    // Tratamento especial para environment_FK que pode ser objeto ou int
    Environment environment;
    
    if (json['environment_FK'] is Map<String, dynamic>) {
      // Se for objeto completo
      environment = Environment.fromJson(json['environment_FK']);
    } else if (json['environment_FK'] is Map) {
      // Se for Map genérico
      environment = Environment.fromJson(Map<String, dynamic>.from(json['environment_FK']));
    } else if (json['environment_FK'] is int) {
      // Se for apenas o ID - criar Environment básico
      environment = Environment(
        id: json['environment_FK'],
        name: 'Ambiente ${json['environment_FK']}',
        description: 'Carregando...',
      );
    } else if (json['environment'] is Map<String, dynamic>) {
      // Alternativa: se vier no campo 'environment' em vez de 'environment_FK'
      environment = Environment.fromJson(json['environment']);
    } else if (json['environment_id'] is int) {
      // Alternativa: se vier como 'environment_id'
      environment = Environment(
        id: json['environment_id'],
        name: 'Ambiente ${json['environment_id']}',
        description: 'Carregando...',
      );
    } else {
      // Fallback
      environment = Environment(
        id: 0,
        name: 'Ambiente não especificado',
        description: '',
      );
    }

    // Tratamento para o campo status que pode vir como String ou int
    StatusAtivos statusValue;
    final statusData = json['status'];
    
    if (statusData is String) {
      // Se for string, converter para enum
      statusValue = enumFromString(StatusAtivos.values, statusData) ?? StatusAtivos.ATIVO;
    } else if (statusData is int) {
      // Se for int, mapear para enum (assumindo que o backend envia index)
      statusValue = statusData < StatusAtivos.values.length 
          ? StatusAtivos.values[statusData]
          : StatusAtivos.ATIVO;
    } else {
      statusValue = StatusAtivos.ATIVO;
    }

    return Ativo(
      id: json['id'],
      name: json['name']?.toString() ?? 'Sem nome',
      description: json['description']?.toString() ?? 'Sem descrição',
      status: statusValue,
      environment: environment,
      qrCode: json['qr_code']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
    if (id != null) 'id': id,
    'name': name,
    'description': description,
    'status': enumToString(status),
    'environment_FK': environment.id,
    if (qrCode != null) 'qr_code': qrCode,
  };

  @override
  String toString() {
    return 'Ativo(id: $id, name: $name, status: ${enumToString(status)})';
  }
}