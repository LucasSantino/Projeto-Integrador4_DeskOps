import 'user_model.dart';
import 'ativo_model.dart';
import 'status_models.dart';

class Chamado {
  int? id;
  String title;
  String description;
  DateTime dtCriacao;
  StatusChamado status;
  PrioridadeChamado prioridade;
  Users creator;
  List<Users> employee;
  Ativo asset;
  DateTime updateDate;
  String? photo;

  Chamado({
    this.id,
    required this.title,
    required this.description,
    required this.dtCriacao,
    this.status = StatusChamado.AGUARDANDO_ATENDIMENTO,
    required this.prioridade,
    required this.creator,
    required this.employee,
    required this.asset,
    required this.updateDate,
    this.photo,
  });

  factory Chamado.fromJson(Map<String, dynamic> json) => Chamado(
        id: json['id'],
        title: json['title'],
        description: json['description'],
        dtCriacao: DateTime.parse(json['dt_criacao']),
        status: enumFromString(StatusChamado.values, json['status'])!,
        prioridade: enumFromString(PrioridadeChamado.values, json['prioridade'])!,
        creator: Users.fromJson(json['creator']),
        employee: (json['employee'] as List<dynamic>)
            .map((e) => Users.fromJson(e))
            .toList(),
        asset: Ativo.fromJson(json['asset']),
        updateDate: DateTime.parse(json['update_date']),
        photo: json['photo'],
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'description': description,
        'dt_criacao': dtCriacao.toIso8601String(),
        'status': enumToString(status),
        'prioridade': enumToString(prioridade),
        'creator': creator.toJson(),
        'employee': employee.map((e) => e.toJson()).toList(),
        'asset': asset.toJson(),
        'update_date': updateDate.toIso8601String(),
        'photo': photo,
      };
}
