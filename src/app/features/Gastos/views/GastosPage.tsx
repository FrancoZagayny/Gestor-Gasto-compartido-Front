import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { GastosService } from '../services/GastosService';
import { Gasto, GastoFormData } from '../types/GastoTypes';
import { Evento } from '../../Eventos/types/EventoTypes';
import { Categoria } from '../../Categorias/types/CategoriaTypes';
import { Participante } from '../../Participantes/types/ParticipanteTypes';
import { formatMoney } from '../../../../shared/libs/utils';

interface GastosPageProps {
  onBack?: () => void;
}

export default function GastosPage({ onBack }: GastosPageProps) {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [items, setItems] = useState<Gasto[]>([]);
  const [form, setForm] = useState<GastoFormData>({
    descripcion: '',
    monto: '',
    id_evento: '',
    id_participante: '',
    id_categoria: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function load() {
    try {
      const [evs, cats, gastos, parts] = await Promise.all([
        GastosService.getEventos(),
        GastosService.getCategorias(),
        GastosService.getAll(),
        GastosService.getParticipantes(),
      ]);
      setEventos(evs);
      setCategorias(cats);
      setItems(gastos);
      setParticipantes(parts);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  function updateField(key: keyof GastoFormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.descripcion.trim() || !form.monto || !form.id_evento || !form.id_participante) {
      setErrors({
        descripcion: !form.descripcion.trim() ? 'Requerido' : undefined,
        monto: !form.monto ? 'Requerido' : undefined,
        id_evento: !form.id_evento ? 'Selecciona un evento' : undefined,
        id_participante: !form.id_participante ? 'Selecciona un participante' : undefined,
      } as Record<string, string>);
      return;
    }
    setLoading(true);
    setError('');
    setErrors({});
    try {
      await GastosService.create(form);
      setForm({
        descripcion: '',
        monto: '',
        id_evento: '',
        id_participante: '',
        id_categoria: '',
      });
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
      await GastosService.delete(id);
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
        ← Gastos
        <Wallet size={32} strokeWidth={2} />
      </h2>
      <form onSubmit={submit} className="card" style={{ display: 'grid', gap: '16px' }}>
        <div className="field">
          <input
            className={`input ${errors.descripcion ? 'input-error' : ''}`}
            value={form.descripcion}
            onChange={(e) => updateField('descripcion', e.target.value)}
            placeholder="Descripción"
          />
          {errors.descripcion && <span className="hint error">{errors.descripcion}</span>}
        </div>
        <div className="field">
          <input
            className={`input ${errors.monto ? 'input-error' : ''}`}
            value={form.monto}
            onChange={(e) => updateField('monto', e.target.value)}
            placeholder="Monto"
            type="number"
            step="0.01"
          />
          {errors.monto && <span className="hint error">{errors.monto}</span>}
        </div>
        <div className="field">
          <select
            className={`input ${errors.id_evento ? 'input-error' : ''}`}
            value={form.id_evento}
            onChange={(e) => updateField('id_evento', e.target.value)}
          >
            <option value="">Evento</option>
            {eventos.map((e) => (
              <option key={e.id_evento} value={e.id_evento}>
                {e.nombre}
              </option>
            ))}
          </select>
          {errors.id_evento && <span className="hint error">{errors.id_evento}</span>}
        </div>
        <div className="field">
          <select
            className={`input ${errors.id_participante ? 'input-error' : ''}`}
            value={form.id_participante}
            onChange={(e) => updateField('id_participante', e.target.value)}
          >
            <option value="">Participante</option>
            {participantes
              .filter(
                (p) =>
                  String(typeof p.evento === 'object' ? p.evento?.id_evento : p.evento) === String(form.id_evento) || !form.id_evento
              )
              .map((p) => (
                <option key={p.id_participante} value={p.id_participante}>
                  {p.nombre}
                </option>
              ))}
          </select>
          {errors.id_participante && <span className="hint error">{errors.id_participante}</span>}
        </div>
        <div className="field">
          <select
            className="input"
            value={form.id_categoria}
            onChange={(e) => updateField('id_categoria', e.target.value)}
          >
            <option value="">Sin categoría (opcional)</option>
            {categorias.map((c) => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <button disabled={loading} style={{ width: '100%' }}>Crear Gasto</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
      <ul className="list">
        {items.map((g) => (
          <li key={g.id_gasto} className="list-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', fontSize: '1.1em' }}>{g.descripcion}</div>
              <div style={{ fontSize: '0.9em', opacity: 0.8, marginTop: '4px' }}>
                ${formatMoney(g.monto)} • {g.evento?.nombre || ''} • {g.participante?.nombre || ''}{' '}
                {g.categoria?.nombre && `• ${g.categoria.nombre}`}
              </div>
            </div>
            <button onClick={() => handleDelete(g.id_gasto)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

