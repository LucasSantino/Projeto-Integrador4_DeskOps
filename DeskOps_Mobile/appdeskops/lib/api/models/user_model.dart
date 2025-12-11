class Users {
  int? id;
  String name;
  String email;
  String? cargo;
  String cpf;
  DateTime dtNascimento;
  String endereco;
  String? fotoUser;
  bool isStaff;
  bool isActive;
  String? role;
  DateTime? createdAt;

  Users({
    this.id,
    required this.name,
    required this.email,
    this.cargo,
    required this.cpf,
    required this.dtNascimento,
    required this.endereco,
    this.fotoUser,
    this.isStaff = false,
    this.isActive = false,
    this.role = 'pendente',
    this.createdAt,
  });

  factory Users.fromJson(Map<String, dynamic> json) => Users(
        id: json['id'],
        name: json['name'],
        email: json['email'],
        cargo: json['cargo'] ?? json['role'], // Compatibilidade com antigo 'cargo'
        cpf: json['cpf'],
        dtNascimento: DateTime.parse(json['dt_nascimento']),
        endereco: json['endereco'],
        fotoUser: json['foto_user'],
        isStaff: json['is_staff'] ?? false,
        isActive: json['is_active'] ?? false,
        role: json['role'] ?? json['cargo'], // Lê de ambos para compatibilidade
        createdAt: json['created_at'] != null 
            ? DateTime.parse(json['created_at'])
            : null,
      );

  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        'name': name,
        'email': email,
        if (cargo != null) 'cargo': cargo,
        'cpf': cpf,
        'dt_nascimento': dtNascimento.toIso8601String().split('T')[0],
        'endereco': endereco,
        if (fotoUser != null) 'foto_user': fotoUser,
        'is_staff': isStaff,
        'is_active': isActive,
        if (role != null) 'role': role,
      };
}