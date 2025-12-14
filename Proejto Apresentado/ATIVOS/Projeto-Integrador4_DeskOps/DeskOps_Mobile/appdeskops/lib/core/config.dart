class ApiConfig {
  // ATUALIZE SEU IP AQUI - Use seu IP local (não localhost para dispositivos físicos)
  static const String baseUrl = 'http://192.168.15.4:8000';
  
  // Endpoints de autenticação
  static const String login = '/api/login/';
  static const String refresh = '/api/refresh/';
  static const String register = '/api/register/';
  static const String logout = '/api/logout/';
  static const String me = '/api/me/';
  static const String editarPerfil = '/api/editar-perfil/';
  
  // Endpoints de usuários
  static const String users = '/api/users/';
  static const String usuarioDetail = '/api/usuarios/'; 
  static const String aprovarUsuario = '/api/aprovar_usuario/';
  static const String listarUsuarios = '/api/usuarios/';
  static const String alterarStatusUsuario = '/api/alterar-status-usuario/';
  static const String alterarRoleUsuario = '/api/alterar-role-usuario/';
  
  // Endpoints principais
  static const String environments = '/api/environment/';
  static const String ativos = '/api/ativo/';
  static const String chamados = '/api/chamados/';
  static const String notificates = '/api/notificate/';
  
  // Endpoints específicos de chamados
  static const String editarChamado = '/api/editar-chamado/';
  static const String encerrarChamado = '/api/chamado/encerrar/';
  static const String atribuirChamado = '/api/chamados/';
  
  // Timeouts
  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;
  
  // Método auxiliar para construir URLs completas
  static String buildUrl(String endpoint) {
    return baseUrl + endpoint;
  }
}