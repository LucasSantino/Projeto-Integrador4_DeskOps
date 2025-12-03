class ApiConfig {
  // URL do backend na Azure (USE ESTA!)
  static const String baseUrl = 'https://integrador-deskops-app-eueygcbdhhbrhphk.westus3-01.azurewebsites.net';
  
  // URLs completas (conforme seu urls.py)
  static const String login = '/api/login/';
  static const String refresh = '/api/refresh/';
  static const String register = '/api/register/';
  static const String logout = '/api/logout/';
  static const String me = '/api/me/';
  
  // Rotas principais (conforme router)
  static const String users = '/api/users/';
  static const String environments = '/api/environment/';  // Note singular
  static const String ativos = '/api/ativo/';              // Note singular
  static const String chamados = '/api/chamados/';
  static const String notificates = '/api/notificate/';    // Note singular
  
  // Endpoints administrativos
  static const String aprovarUsuario = '/api/aprovar_usuario/';
  static const String alterarStatusUsuario = '/api/usuario/alterar-status/';
  static const String alterarRoleUsuario = '/api/usuario/alterar-role/';
  static const String listarUsuarios = '/api/usuarios/';
  static const String usuarioDetail = '/api/usuarios/';  // + id/
  
  // Endpoints de chamado específicos
  static const String editarChamado = '/api/editar-chamado/';
  static const String encerrarChamado = '/api/chamado/encerrar/';
  static const String atribuirChamado = '/api/chamados/atribuir/';  // Note: endpoint do ViewSet
}