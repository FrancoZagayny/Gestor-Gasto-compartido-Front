interface DashboardPageProps {
  onNavigate?: (route: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const modules = [
    { key: 'eventos', title: 'Eventos', desc: 'Crear y editar eventos' },
    { key: 'participantes', title: 'Participantes', desc: 'Agregar personas' },
    { key: 'gastos', title: 'Gastos', desc: 'Cargar consumos' },
    { key: 'deudas', title: 'Deudas', desc: 'Ver y pagar' },
    { key: 'categorias', title: 'Categorías', desc: 'Opcional' },
  ];

  return (
    <div className="section" style={{ textAlign: 'center' }}>
      <p style={{ opacity: 0.8, marginTop: -8, fontSize: '1.1em' }}>Seleccioná un módulo para comenzar.</p>
      <div className="grid-cards" style={{ marginTop: 0, maxWidth: '1200px', margin: '0 auto' }}>
        {modules.map((c) => (
          <button
            key={c.key}
            onClick={() => onNavigate?.(c.key)}
            className="card"
            style={{ textAlign: 'left' }}
          >
            <div className="section" style={{ gap: 6 }}>
              <strong style={{ fontSize: '1.2em' }}>{c.title}</strong>
              <span style={{ opacity: 0.8, fontSize: 14 }}>{c.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

