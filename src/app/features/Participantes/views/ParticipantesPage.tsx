import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { ParticipantesService } from '../services/ParticipantesService';
import { Participante, ParticipanteFormData } from '../types/ParticipanteTypes';
import { Evento } from '../../Eventos/types/EventoTypes';

interface ParticipantesPageProps {
  onBack?: () => void;
}

export default function ParticipantesPage({ onBack }: ParticipantesPageProps) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [items, setItems] = useState<Participante[]>([]);
  const [form, setForm] = useState<ParticipanteFormData>({ nombre: '', id_evento: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEvento, setSelectedEvento] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function load() {
    try {
      const [evs, parts] = await Promise.all([
        ParticipantesService.getEventos(),
        ParticipantesService.getAll(),
      ]);
      setEventos(evs);
      setItems(parts);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (selectedEvento) {
      setForm((f) => ({ ...f, id_evento: selectedEvento }));
    }
  }, [selectedEvento]);

  function updateField(key: keyof ParticipanteFormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const idEvento = selectedEvento || form.id_evento;
    if (!form.nombre.trim() || !idEvento) {
      setErrors({
        nombre: !form.nombre.trim() ? 'Requerido' : undefined,
        id_evento: !idEvento ? 'Selecciona un evento' : undefined,
      } as Record<string, string>);
      return;
    }
    setLoading(true);
    setError('');
    setErrors({});
    try {
      await ParticipantesService.create({ nombre: form.nombre, id_evento: idEvento });
      setForm({ nombre: '', id_evento: selectedEvento || '' });
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setLoading(true);
    setError('');
    try {
      await ParticipantesService.delete(id);
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const countsByEvento = eventos.map((e) => ({
    ...e,
    count: items.filter((p) => {
      const eventoId = typeof p.evento === 'number' ? p.evento : p.evento?.id_evento;
      return String(eventoId) === String(e.id_evento);
    }).length,
  }));

  return (
    <div className="section">
      <h2 onClick={onBack} style={{ cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        ← Participantes
        <Users size={32} strokeWidth={2} />
      </h2>
      {!selectedEvento && (
        <div className="grid-cards-compact">
          {countsByEvento.map((ev) => (
            <button
              key={ev.id_evento}
              className="card"
              style={{ textAlign: 'left' }}
              onClick={() => {
                const v = String(ev.id_evento);
                setSelectedEvento(v);
                setForm((f) => ({ ...f, id_evento: v }));
              }}
            >
              <div className="section" style={{ gap: 4 }}>
                <strong>{ev.nombre}</strong>
                <span className="hint">{ev.count} participantes</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedEvento && (
        <div className="toolbar" style={{ justifyContent: 'space-between' }}>
          <button
            onClick={() => {
              setSelectedEvento('');
              setForm({ nombre: '', id_evento: '' });
            }}
          >
            ← Volver
          </button>
          <span className="hint">
            Mostrando participantes de "{eventos.find((e) => String(e.id_evento) === selectedEvento)?.nombre || ''}"
          </span>
        </div>
      )}
      {!selectedEvento && (
        <form onSubmit={submit} className="card" style={{ display: 'grid', gap: '16px' }}>
          <div className="field">
            <input
              className={`input ${errors.nombre ? 'input-error' : ''}`}
              value={form.nombre}
              onChange={(e) => updateField('nombre', e.target.value)}
              placeholder="Nombre del participante"
            />
            {errors.nombre && <span className="hint error">{errors.nombre}</span>}
          </div>
          <div className="field">
            <select
              className={`input ${errors.id_evento ? 'input-error' : ''}`}
              value={form.id_evento || selectedEvento}
              onChange={(e) => updateField('id_evento', e.target.value)}
            >
              <option value="">Selecciona un evento</option>
              {eventos.map((e) => (
                <option key={e.id_evento} value={e.id_evento}>
                  {e.nombre}
                </option>
              ))}
            </select>
            {errors.id_evento && <span className="hint error">{errors.id_evento}</span>}
          </div>
          <button disabled={loading} style={{ width: '100%' }}>Crear Participante</button>
        </form>
      )}
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
      {selectedEvento && (
        <form onSubmit={submit} className="card" style={{ display: 'grid', gap: '16px' }}>
          <div className="field">
            <input
              className={`input ${errors.nombre ? 'input-error' : ''}`}
              value={form.nombre}
              onChange={(e) => updateField('nombre', e.target.value)}
              placeholder="Nombre del participante"
            />
            {errors.nombre && <span className="hint error">{errors.nombre}</span>}
          </div>
          <div className="field">
            <select
              className={`input ${errors.id_evento ? 'input-error' : ''}`}
              value={form.id_evento || selectedEvento}
              onChange={(e) => updateField('id_evento', e.target.value)}
            >
              <option value="">Selecciona un evento</option>
              {eventos.map((e) => (
                <option key={e.id_evento} value={e.id_evento}>
                  {e.nombre}
                </option>
              ))}
            </select>
            {errors.id_evento && <span className="hint error">{errors.id_evento}</span>}
          </div>
          <button disabled={loading} style={{ width: '100%' }}>Crear Participante</button>
        </form>
      )}
      {selectedEvento && (
        <ul className="list" style={{ marginTop: 0 }}>
          {items
            .filter((p) => {
              const eventoId = typeof p.evento === 'number' ? p.evento : p.evento?.id_evento;
              return String(eventoId) === selectedEvento;
            })
            .map((p) => (
              <li key={p.id_participante} className="list-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: '1.1em' }}>{p.nombre}</div>
                  <div style={{ fontSize: '0.9em', opacity: 0.8, marginTop: '4px' }}>
                    Evento: {typeof p.evento === 'object' ? p.evento.nombre : p.evento}
                  </div>
                </div>
                <button onClick={() => handleDelete(p.id_participante)}>Eliminar</button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

