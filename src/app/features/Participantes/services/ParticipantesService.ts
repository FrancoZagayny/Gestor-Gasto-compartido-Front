import { getJson, postJson, del } from '../../../../shared/libs/api';
import { Participante, ParticipanteFormData } from '../types/ParticipanteTypes';
import { Evento } from '../../Eventos/types/EventoTypes';

export class ParticipantesService {
  static async getAll(): Promise<Participante[]> {
    const data = await getJson('/participantes');
    return Array.isArray(data) ? data : [];
  }

  static async create(data: ParticipanteFormData): Promise<Participante> {
    return await postJson('/participantes', {
      nombre: data.nombre,
      id_evento: Number(data.id_evento),
    });
  }

  static async delete(id: number): Promise<void> {
    return await del(`/participantes/${id}`);
  }

  static async getEventos(): Promise<Evento[]> {
    const data = await getJson('/eventos');
    return Array.isArray(data) ? data : [];
  }
}

