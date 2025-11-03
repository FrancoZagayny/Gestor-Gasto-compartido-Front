import { useEffect, useState } from 'react';
import { DeudasService } from '../services/DeudasService';
import { Deuda, DeudaFilters } from '../types/DeudaTypes';
import { formatMoney } from '../../../../shared/libs/utils';

interface DeudasPageProps {
  onBack?: () => void;
}

export default function DeudasPage({ onBack }: DeudasPageProps) {
  const [eventos, setEventos] = useState<any[]>([]);
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [filters, setFilters] = useState<DeudaFilters>({ id_evento: '', id_participante: '' });
  const [totales, setTotales] = useState<{ evento: number | null; participante: number | null }>({
    evento: null,
    participante: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function setFilter(key: keyof DeudaFilters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  async function loadBase() {
    try {
      const [evs, parts] = await Promise.all([DeudasService.getEventos(), DeudasService.getParticipantes()]);
      setEventos(evs);
      setParticipantes(parts);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function loadDeudas() {
    setLoading(true);
    setError('');
    try {
      let list: Deuda[] = [];
      if (filters.id_evento) {
        list = await DeudasService.getByEvento(Number(filters.id_evento));
      } else if (filters.id_participante) {
        list = await DeudasService.getByParticipante(Number(filters.id_participante));
      } else {
        list = await DeudasService.getAll();
      }
      const arr = Array.isArray(list) ? list : [];
      setDeudas(arr.filter((d) => d.estado !== 'pagada'));

      const tot = { evento: null, participante: null };
      if (filters.id_evento) {
        tot.evento = await DeudasService.getTotalPendienteByEvento(Number(filters.id_evento));
      }
      if (filters.id_participante) {
        tot.participante = await DeudasService.getTotalPendienteByParticipante(
          Number(filters.id_participante)
        );
      }
      setTotales(tot);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBase();
  }, []);
  useEffect(() => {
    loadDeudas();
  }, [filters.id_evento, filters.id_participante]);

  async function pagar(id: number, data: any = {}) {
    setLoading(true);
    setError('');
    try {
      setPayingId(id);
      await DeudasService.pagar(id, data);
      setTimeout(async () => {
        setPayingId(null);
        await loadDeudas();
      }, 250);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <h2 onClick={onBack} style={{ cursor: 'pointer', marginBottom: '16px' }}>Deudas</h2>
      <div className="toolbar">
        <select
          className="input"
          value={filters.id_evento}
          onChange={(e) => setFilter('id_evento', e.target.value)}
        >
          <option value="">Filtrar por evento</option>
          {eventos.map((e) => (
            <option key={e.id_evento} value={e.id_evento}>
              {e.nombre}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={filters.id_participante}
          onChange={(e) => setFilter('id_participante', e.target.value)}
        >
          <option value="">Filtrar por participante</option>
          {participantes.map((p) => (
            <option key={p.id_participante} value={p.id_participante}>
              {p.nombre}
            </option>
          ))}
        </select>
        <button onClick={() => setFilters({ id_evento: '', id_participante: '' })}>
          Limpiar filtros
        </button>
      </div>
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
      <div style={{ marginTop: 12 }}>
        {totales.evento != null && <p>Total pendiente del evento: ${formatMoney(totales.evento)}</p>}
        {totales.participante != null && (
          <p>Total pendiente del participante: ${formatMoney(totales.participante)}</p>
        )}
      </div>
      <ul className="list">
        {deudas.map((d) => (
          <li key={d.id_deuda} className={`list-item ${payingId === d.id_deuda ? 'paid-anim' : ''}`}>
            <span style={{ flex: 1 }}>
              {d.participante?.nombre || ''} debe ${formatMoney(d.monto)}{' '}
              {d.debeA ? `a ${d.debeA}` : ''}
            </span>
            <span className={`pill ${d.estado === 'pagada' ? 'pill--ok' : 'pill--warn'}`}>
              {d.estado}
            </span>
            {d.estado === 'pendiente' && (
              <button onClick={() => pagar(d.id_deuda)}>Marcar pagada</button>
            )}
          </li>
        ))}
      </ul>
      {loading && <p>Cargando...</p>}
    </div>
  );
}

