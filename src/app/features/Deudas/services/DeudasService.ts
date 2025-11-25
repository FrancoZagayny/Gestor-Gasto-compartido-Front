import { getJson, patchJson } from '../../../../shared/libs/api';
import { Deuda } from '../types/DeudaTypes';
import { Evento } from '../../Eventos/types/EventoTypes';
import { Participante } from '../../Participantes/types/ParticipanteTypes';

export class DeudasService {
  static async getAll(): Promise<Deuda[]> {
    const data = await getJson('/deudas');
    return Array.isArray(data) ? data : [];
  }

  static async getByEvento(idEvento: number): Promise<Deuda[]> {
    const data = await getJson(`/deudas/evento/${idEvento}`);
    return Array.isArray(data) ? data : [];
  }

  static async getByParticipante(idParticipante: number): Promise<Deuda[]> {
    const data = await getJson(`/deudas/participante/${idParticipante}`);
    return Array.isArray(data) ? data : [];
  }

  static async getTotalPendienteByEvento(idEvento: number): Promise<number> {
    const data = await getJson(`/deudas/evento/${idEvento}/total-pendiente`);
    const value = (data as any)?.total ?? data ?? 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  static async getTotalPendienteByParticipante(idParticipante: number): Promise<number> {
    const data = await getJson(`/deudas/participante/${idParticipante}/total-pendiente`);
    const value = (data as any)?.total ?? data ?? 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  static async pagar(id: number, data: any = {}): Promise<Deuda> {
    return await patchJson(`/deudas/${id}/pagar`, data);
  }

  static async getEventos(): Promise<Evento[]> {
    const data = await getJson('/eventos');
    return Array.isArray(data) ? data : [];
  }

  static async getParticipantes(): Promise<Participante[]> {
    const data = await getJson('/participantes');
    return Array.isArray(data) ? data : [];
  }
}

