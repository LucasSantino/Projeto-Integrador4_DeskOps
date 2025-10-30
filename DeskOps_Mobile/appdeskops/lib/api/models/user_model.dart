class Users {
  int? id;
  String name;
  String email;
  String cargo;
  String cpf;
  DateTime dtNascimento;
  String endereco;
  String? fotoUser;
  bool isStaff;
  bool isActive;

  Users({
    this.id,
    required this.name,
    required this.email,
    required this.cargo,
    required this.cpf,
    required this.dtNascimento,
    required this.endereco,
    this.fotoUser,
    this.isStaff = false,
    this.isActive = false,
  });

  factory Users.fromJson(Map<String, dynamic> json) => Users(
        id: json['id'],
        name: json['name'],
        email: json['email'],
        cargo: json['cargo'],
        cpf: json['cpf'],
        dtNascimento: DateTime.parse(json['dt_nascimento']),
        endereco: json['endereco'],
        fotoUser: json['foto_user'],
        isStaff: json['is_staff'] ?? false,
        isActive: json['is_active'] ?? false,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'cargo': cargo,
        'cpf': cpf,
        'dt_nascimento': dtNascimento.toIso8601String(),
        'endereco': endereco,
        'foto_user': fotoUser,
        'is_staff': isStaff,
        'is_active': isActive,
      };
}
