import { getJson, postJson, putJson, del } from '../../../../shared/libs/api';
import { Evento, EventoFormData } from '../types/EventoTypes';

export class EventosService {
  static async getAll(): Promise<Evento[]> {
    const data = await getJson('/eventos');
    return Array.isArray(data) ? data : [];
  }

  static async create(data: EventoFormData): Promise<Evento> {
    return await postJson('/eventos', data);
  }

  static async update(id: number, data: EventoFormData): Promise<Evento> {
    return await putJson(`/eventos/${id}`, data);
  }

  static async delete(id: number): Promise<void> {
    return await del(`/eventos/${id}`);
  }
}

