import 'user_model.dart';
import 'ativo_model.dart';
import 'status_models.dart';

class Chamado {
  int? id;
  String title;
  String description;
  String? categoria;
  DateTime dtCriacao;
  StatusChamado status;
  PrioridadeChamado prioridade;
  Users creator;
  Users? employee;
  Ativo? asset;  // Pode ser null se for apenas ID
  int? assetId;  // Para criação
  DateTime updateDate;
  String? photo;
  
  // Campos do backend
  Map<String, dynamic>? environment;
  int? environmentId;
  String? ultimaAcao;
  DateTime? dataUltimaAcao;

  Chamado({
    this.id,
    required this.title,
    required this.description,
    this.categoria,
    required this.dtCriacao,
    this.status = StatusChamado.AGUARDANDO_ATENDIMENTO,
    required this.prioridade,
    required this.creator,
    this.employee,
    this.asset,
    this.assetId,
    required this.updateDate,
    this.photo,
    this.environment,
    this.environmentId,
    this.ultimaAcao,
    this.dataUltimaAcao,
  });

  factory Chamado.fromJson(Map<String, dynamic> json) {
    // Tratamento seguro para employee (pode ser null ou objeto)
    Users? employeeUser;
    if (json['employee'] != null) {
      if (json['employee'] is Map) {
        employeeUser = Users.fromJson(json['employee']);
      }
    }
    
    // Tratamento para asset (pode ser objeto ou apenas ID)
    Ativo? assetObj;
    int? assetId;
    
    if (json['asset'] is Map) {
      assetObj = Ativo.fromJson(json['asset']);
      assetId = assetObj.id;
    } else if (json['asset'] is int) {
      assetId = json['asset'];
    } else if (json['asset_id'] != null) {
      assetId = json['asset_id'];
    }
    
    return Chamado(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      categoria: json['categoria'],
      dtCriacao: DateTime.parse(json['dt_criacao']),
      status: enumFromString(StatusChamado.values, json['status']) ?? StatusChamado.AGUARDANDO_ATENDIMENTO,
      prioridade: enumFromString(PrioridadeChamado.values, json['prioridade']) ?? PrioridadeChamado.MEDIA,
      creator: Users.fromJson(json['creator']),
      employee: employeeUser,
      asset: assetObj,
      assetId: assetId,
      updateDate: DateTime.parse(json['update_date']),
      photo: json['photo'],
      environment: json['environment'] is Map ? Map<String, dynamic>.from(json['environment']) : null,
      environmentId: json['environment_id'],
      ultimaAcao: json['ultima_acao'],
      dataUltimaAcao: json['data_ultima_acao'] != null 
          ? DateTime.tryParse(json['data_ultima_acao'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    final map = <String, dynamic>{
      if (id != null) 'id': id,
      'title': title,
      'description': description,
      if (categoria != null) 'categoria': categoria,
      'dt_criacao': dtCriacao.toIso8601String(),
      'status': enumToString(status),
      'prioridade': enumToString(prioridade),
      'creator': creator.toJson(),
      'update_date': updateDate.toIso8601String(),
      if (photo != null) 'photo': photo,
      if (environmentId != null) 'environment_id': environmentId,
      if (ultimaAcao != null) 'ultima_acao': ultimaAcao,
    };
    
    // Para criação, usar asset_id
    if (assetId != null) {
      map['asset'] = assetId;
    } else if (asset != null) {
      map['asset'] = asset!.toJson();
    }
    
    // Employee pode ser ID ou objeto
    if (employee != null) {
      map['employee'] = employee!.toJson();
    }
    
    return map;
  }
}