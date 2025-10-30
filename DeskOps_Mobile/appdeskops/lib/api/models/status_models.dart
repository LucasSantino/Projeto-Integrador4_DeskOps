enum StatusAtivos { ATIVO, EM_MANUTENCAO, DESATIVADO }

enum StatusChamado {
  AGUARDANDO_ATENDIMENTO,
  EM_ANDAMENTO,
  CONCLUIDO,
  CANCELADO
}

enum PrioridadeChamado { BAIXA, MEDIA, ALTA }

String enumToString(Object o) => o.toString().split('.').last;

T? enumFromString<T>(List<T> values, String value) {
  return values.firstWhere(
    (e) => e.toString().split('.').last == value,
    orElse: () => values.first,
  );
}
