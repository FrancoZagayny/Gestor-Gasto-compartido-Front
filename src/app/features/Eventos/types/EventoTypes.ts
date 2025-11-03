export interface Evento {
  id_evento: number;
  nombre: string;
  descripcion?: string;
}

export interface EventoFormData {
  nombre: string;
  descripcion: string;
}

