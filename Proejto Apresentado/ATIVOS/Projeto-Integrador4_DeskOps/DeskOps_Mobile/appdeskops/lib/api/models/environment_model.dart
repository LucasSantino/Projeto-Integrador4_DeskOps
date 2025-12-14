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

  factory Environment.fromJson(Map<String, dynamic> json) {
    // Tratamento seguro para o campo employee
    Users? employeeUser;
    
    if (json['employee'] != null) {
      if (json['employee'] is Map<String, dynamic>) {
        employeeUser = Users.fromJson(json['employee']);
      } else if (json['employee'] is String) {
        // Se employee for apenas um nome/nome do funcionário
        employeeUser = Users(
          name: json['employee'],
          email: '',
          cargo: '',
          cpf: '',
          dtNascimento: DateTime.now(),
          endereco: '',
        );
      }
    }
    
    return Environment(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      employee: employeeUser,
    );
  }

  Map<String, dynamic> toJson() => {
    if (id != null) 'id': id,
    'name': name,
    'description': description,
    if (employee != null) 'employee': employee!.toJson(),
  };
  
  // Método para retornar employee como ID (útil para atualizações)
  Map<String, dynamic> toJsonForUpdate() => {
    if (id != null) 'id': id,
    'name': name,
    'description': description,
    if (employee != null && employee!.id != null) 'employee': employee!.id,
  };
}