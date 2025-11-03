import { Evento } from '../../Eventos/types/EventoTypes';

export interface Participante {
  id_participante: number;
  nombre: string;
  id_evento: number;
  evento?: Evento | number;
}

export interface ParticipanteFormData {
  nombre: string;
  id_evento: string | number;
}

