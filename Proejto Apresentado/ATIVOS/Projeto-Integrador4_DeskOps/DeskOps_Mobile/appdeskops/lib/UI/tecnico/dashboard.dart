import 'package:flutter/material.dart';
import '../widgets/mainLayout.dart';
import '../widgets/drawer_tecnico.dart';
import 'package:fl_chart/fl_chart.dart';

class Dashboard extends StatelessWidget {
  const Dashboard({super.key});

  @override
  Widget build(BuildContext context) {
    // Dados simulados
    int totalChamados = 50;
    int chamadosAbertos = 12;
    int chamadosConcluidos = 30;
    int chamadosCancelados = 3;
    int chamadosEmAndamento = 4;
    int chamadosAguardando = 1;

    final List<Map<String, String>> chamadosRecentes = [
      {"titulo": "Problema na Impressora", "status": "Aberto"},
      {"titulo": "Falha no Servidor", "status": "Concluído"},
      {"titulo": "Atualização de Sistema", "status": "Aberto"},
    ];

    return MainLayout(
      drawer: DrawerTecnico(),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Título do resumo
            const Text(
              "Resumo dos dados",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.indigo,
              ),
            ),
            const SizedBox(height: 16),

            // Cards principais de chamados
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                _dashboardCard(
                  title: "Total de Chamados",
                  value: totalChamados.toString(),
                  icon: Icons.list_alt,
                  color: Colors.indigo,
                ),
                _dashboardCard(
                  title: "Abertos",
                  value: chamadosAbertos.toString(),
                  icon: Icons.error_outline,
                  color: Colors.orange,
                ),
                _dashboardCard(
                  title: "Concluídos",
                  value: chamadosConcluidos.toString(),
                  icon: Icons.check_circle_outline,
                  color: Colors.green,
                ),
                _dashboardCard(
                  title: "Cancelados",
                  value: chamadosCancelados.toString(),
                  icon: Icons.cancel_outlined,
                  color: Colors.grey,
                ),
                _dashboardCard(
                  title: "Em andamento",
                  value: chamadosEmAndamento.toString(),
                  icon: Icons.autorenew,
                  color: Colors.blue,
                ),
                _dashboardCard(
                  title: "Aguardando",
                  value: chamadosAguardando.toString(),
                  icon: Icons.hourglass_empty,
                  color: Colors.deepOrange,
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Gráfico de linha
            const Text(
              "Chamados nos últimos dias",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              height: 200,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: LineChart(
                LineChartData(
                  gridData: FlGridData(show: true),
                  titlesData: FlTitlesData(
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: true),
                    ),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          const dias = [
                            'Seg',
                            'Ter',
                            'Qua',
                            'Qui',
                            'Sex',
                            'Sab',
                            'Dom',
                          ];
                          int index = value.toInt();
                          if (index >= 0 && index < dias.length) {
                            return Text(dias[index]);
                          }
                          return const Text('');
                        },
                      ),
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  lineBarsData: [
                    LineChartBarData(
                      spots: const [
                        FlSpot(0, 5),
                        FlSpot(1, 6),
                        FlSpot(2, 7),
                        FlSpot(3, 8),
                        FlSpot(4, 6),
                        FlSpot(5, 7),
                        FlSpot(6, 5),
                      ],
                      isCurved: true,
                      barWidth: 3,
                      color: Colors.indigo,
                      dotData: FlDotData(show: true),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Chamados recentes
            const Text(
              "Chamados Recentes",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 12),
            Column(
              children:
                  chamadosRecentes.map((chamado) {
                    Color statusColor =
                        chamado['status'] == 'Aberto'
                            ? Colors.orange
                            : Colors.green;
                    IconData statusIcon =
                        chamado['status'] == 'Aberto'
                            ? Icons.error_outline
                            : Icons.check_circle_outline;
                    return Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            chamado['titulo']!,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Row(
                            children: [
                              Icon(statusIcon, color: statusColor),
                              const SizedBox(width: 4),
                              Text(
                                chamado['status']!,
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: statusColor,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _dashboardCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      width: 115,
      height: 140, // Mesma altura para todos
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.black54),
          ),
        ],
      ),
    );
  }
}
