import { Participante } from '../../Participantes/types/ParticipanteTypes';

export interface Deuda {
  id_deuda: number;
  monto: number;
  estado: 'pendiente' | 'pagada';
  participante?: Participante;
  debeA?: string;
}

export interface DeudaFilters {
  id_evento: string;
  id_participante: string;
}

