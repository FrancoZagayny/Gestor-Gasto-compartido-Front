import { getJson, postJson, del } from '../../../../shared/libs/api';
import { Gasto, GastoFormData } from '../types/GastoTypes';
import { Evento } from '../../Eventos/types/EventoTypes';
import { Categoria } from '../../Categorias/types/CategoriaTypes';
import { Participante } from '../../Participantes/types/ParticipanteTypes';

export class GastosService {
  static async getAll(): Promise<Gasto[]> {
    const data = await getJson('/gastos');
    return Array.isArray(data) ? data : [];
  }

  static async create(data: GastoFormData): Promise<Gasto> {
    const payload: any = {
      descripcion: data.descripcion,
      monto: Number(data.monto),
      id_evento: Number(data.id_evento),
      id_participante: Number(data.id_participante),
    };
    if (data.id_categoria) {
      payload.id_categoria = Number(data.id_categoria);
    }
    return await postJson('/gastos', payload);
  }

  static async delete(id: number): Promise<void> {
    return await del(`/gastos/${id}`);
  }

  static async getEventos(): Promise<Evento[]> {
    const data = await getJson('/eventos');
    return Array.isArray(data) ? data : [];
  }

  static async getCategorias(): Promise<Categoria[]> {
    const data = await getJson('/categorias');
    return Array.isArray(data) ? data : [];
  }

  static async getParticipantes(): Promise<Participante[]> {
    const data = await getJson('/participantes');
    return Array.isArray(data) ? data : [];
  }
}

