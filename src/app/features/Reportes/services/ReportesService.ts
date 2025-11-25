import { getJson, apiBaseUrl } from '../../../../shared/libs/api';
import {
  ResumenEvento,
  GastoPorCategoria,
  BalanceParticipante,
  EventoPorPeriodo,
  EstadisticasGenerales,
  EventoLista,
} from '../types/ReporteTypes';

export class ReportesService {
  static async getResumenEvento(id: number): Promise<ResumenEvento> {
    return await getJson(`/reportes/evento/${id}`);
  }

  static async getGastosPorCategoria(id: number): Promise<GastoPorCategoria[]> {
    return await getJson(`/reportes/evento/${id}/categorias`);
  }

  static async getBalanceParticipantes(id: number): Promise<BalanceParticipante[]> {
    return await getJson(`/reportes/evento/${id}/balance`);
  }

  static async getEventosPorPeriodo(
    tipo: 'mes' | 'anio',
    desde?: string,
    hasta?: string,
  ): Promise<EventoPorPeriodo[]> {
    const params = new URLSearchParams({ tipo });
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);
    
    return await getJson(`/reportes/eventos-periodo?${params}`);
  }

  static async getEstadisticasGenerales(): Promise<EstadisticasGenerales> {
    return await getJson('/reportes/estadisticas-generales');
  }

  static async getEventosLista(): Promise<EventoLista[]> {
    return await getJson('/reportes/eventos-lista');
  }
}

