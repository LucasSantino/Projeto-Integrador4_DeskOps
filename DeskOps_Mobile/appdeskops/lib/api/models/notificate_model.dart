import 'user_model.dart';
import 'chamado_model.dart';

class Notificate {
  int? id;
  String title;
  String description;
  DateTime dtCriacao;
  Users author;
  Chamado chamado;

  Notificate({
    this.id,
    required this.title,
    required this.description,
    required this.dtCriacao,
    required this.author,
    required this.chamado,
  });

  factory Notificate.fromJson(Map<String, dynamic> json) => Notificate(
        id: json['id'],
        title: json['title'],
        description: json['description'],
        dtCriacao: DateTime.parse(json['dt_criacao']),
        author: Users.fromJson(json['author']),
        chamado: Chamado.fromJson(json['chamado_FK']),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'description': description,
        'dt_criacao': dtCriacao.toIso8601String(),
        'author': author.toJson(),
        'chamado_FK': chamado.toJson(),
      };
}
