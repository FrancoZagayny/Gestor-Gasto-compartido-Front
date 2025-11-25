export interface ResumenEvento {
  id_evento: number;
  nombre_evento: string;
  total_gastado: number;
  cantidad_gastos: number;
  cantidad_participantes: number;
  promedio_por_persona: number;
  total_deudas_pendientes: number;
  total_deudas_pagadas: number;
  porcentaje_pagado: number;
}

export interface GastoPorCategoria {
  id_categoria: number | null;
  nombre_categoria: string;
  total: number;
  cantidad_gastos: number;
  porcentaje: number;
}

export interface BalanceParticipante {
  id_participante: number;
  nombre: string;
  total_pagado: number;
  total_debe: number;
  balance: number;
  cantidad_gastos_realizados: number;
}

export interface EventoPorPeriodo {
  periodo: string;
  cantidad_eventos: number;
  total_gastado: number;
}

export interface EstadisticasGenerales {
  total_eventos: number;
  total_gastos_registrados: number;
  monto_total_gastado: number;
  total_participantes_unicos: number;
  eventos_activos: number;
  eventos_finalizados: number;
  deudas_pendientes: number;
  deudas_pagadas: number;
}

export interface EventoLista {
  id_evento: number;
  nombre: string;
  estado: string;
  fecha_creacion: string;
}

