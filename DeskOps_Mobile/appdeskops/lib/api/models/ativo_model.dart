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

  factory Ativo.fromJson(Map<String, dynamic> json) => Ativo(
        id: json['id'],
        name: json['name'],
        description: json['description'],
        status: enumFromString(StatusAtivos.values, json['status'])!,
        environment: Environment.fromJson(json['environment_FK']),
        qrCode: json['qr_code'],
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'status': enumToString(status),
        'environment_FK': environment.toJson(),
        'qr_code': qrCode,
      };
}
