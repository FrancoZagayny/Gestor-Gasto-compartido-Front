import { useEffect, useState } from 'react';
import { CategoriasService } from '../services/CategoriasService';
import { Categoria } from '../types/CategoriaTypes';

interface CategoriasPageProps {
  onBack?: () => void;
}

export default function CategoriasPage({ onBack }: CategoriasPageProps) {
  const [nombre, setNombre] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function load() {
    try {
      const data = await CategoriasService.getAll();
      setCategorias(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrors({ nombre: 'Requerido' });
      return;
    }
    setLoading(true);
    setError('');
    setErrors({});
    try {
      await CategoriasService.create({ nombre });
      setNombre('');
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
      await CategoriasService.delete(id);
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <h2 onClick={onBack} style={{ cursor: 'pointer', marginBottom: '16px' }}>← Categorías</h2>
      <form onSubmit={handleCreate} className="card" style={{ display: 'grid', gap: '16px' }}>
        <div className="field">
          <input
            className={`input ${errors.nombre ? 'input-error' : ''}`}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la categoría"
          />
          {errors.nombre && <span className="hint error">{errors.nombre}</span>}
        </div>
        <button disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Guardando...' : 'Crear Categoría'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
      <ul className="list">
        {categorias.map((c) => (
          <li key={c.id_categoria} className="list-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', fontSize: '1.1em' }}>{c.nombre}</div>
            </div>
            <button onClick={() => handleDelete(c.id_categoria)} disabled={loading}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

