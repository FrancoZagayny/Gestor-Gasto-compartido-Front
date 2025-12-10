import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { EventosService } from '../services/EventosService';
import { Evento, EventoFormData } from '../types/EventoTypes';

interface EventosPageProps {
  onBack?: () => void;
}

export default function EventosPage({ onBack }: EventosPageProps) {
  const [items, setItems] = useState<Evento[]>([]);
  const [form, setForm] = useState<EventoFormData>({ nombre: '', descripcion: '' });
  const [editing, setEditing] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function load() {
    try {
      const data = await EventosService.getAll();
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  function updateField(key: keyof EventoFormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setErrors({ nombre: 'Requerido' });
      return;
    }
    setLoading(true);
    setError('');
    setErrors({});
    try {
      if (editing) {
        await EventosService.update(editing.id_evento, form);
      } else {
        await EventosService.create(form);
      }
      setForm({ nombre: '', descripcion: '' });
      setEditing(null);
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
      await EventosService.delete(id);
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <h2 onClick={onBack} style={{ cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        ← Eventos
        <Calendar size={32} strokeWidth={2} />
      </h2>
      <form onSubmit={submit} className="card" style={{ display: 'grid', gap: '16px' }}>
        <div className="field">
          <input
            className={`input ${errors.nombre ? 'input-error' : ''}`}
            value={form.nombre}
            onChange={(e) => updateField('nombre', e.target.value)}
            placeholder="Nombre del evento"
          />
          {errors.nombre && <span className="hint error">{errors.nombre}</span>}
        </div>
        <div className="field">
          <input
            className="input"
            value={form.descripcion}
            onChange={(e) => updateField('descripcion', e.target.value)}
            placeholder="Descripción (opcional)"
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button disabled={loading} style={{ flex: 1 }}>
            {editing ? 'Guardar Cambios' : 'Crear Evento'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({ nombre: '', descripcion: '' });
              }}
              style={{ flex: 1 }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
      <ul className="list">
        {items.map((ev) => (
          <li key={ev.id_evento} className="list-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', fontSize: '1.1em' }}>{ev.nombre}</div>
              {ev.descripcion && (
                <div style={{ fontSize: '0.9em', opacity: 0.8, marginTop: '4px' }}>
                  {ev.descripcion}
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setEditing(ev);
                setForm({ nombre: ev.nombre || '', descripcion: ev.descripcion || '' });
              }}
            >
              Editar
            </button>
            <button onClick={() => handleDelete(ev.id_evento)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

