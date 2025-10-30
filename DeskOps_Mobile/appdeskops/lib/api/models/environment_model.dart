import 'user_model.dart';

class Environment {
  int? id;
  String name;
  String description;
  Users? employee;

  Environment({
    this.id,
    required this.name,
    required this.description,
    this.employee,
  });

  factory Environment.fromJson(Map<String, dynamic> json) => Environment(
        id: json['id'],
        name: json['name'],
        description: json['description'],
        employee: json['employee'] != null ? Users.fromJson(json['employee']) : null,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'employee': employee?.toJson(),
      };
}
