import { Evento } from '../../Eventos/types/EventoTypes';
import { Participante } from '../../Participantes/types/ParticipanteTypes';
import { Categoria } from '../../Categorias/types/CategoriaTypes';

export interface Gasto {
  id_gasto: number;
  descripcion: string;
  monto: number;
  id_evento: number;
  id_participante: number;
  id_categoria?: number | null;
  participante?: Participante;
  categoria?: Categoria;
}

export interface GastoFormData {
  descripcion: string;
  monto: string | number;
  id_evento: string | number;
  id_participante: string | number;
  id_categoria?: string | number;
}

