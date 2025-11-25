import { Calendar, Users, DollarSign, CreditCard, Tag, BarChart3 } from 'lucide-react';

interface DashboardPageProps {
  onNavigate?: (route: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const modules = [
    { key: 'eventos', title: 'Eventos', desc: 'Crear y editar eventos', icon: Calendar },
    { key: 'participantes', title: 'Participantes', desc: 'Agregar personas', icon: Users },
    { key: 'gastos', title: 'Gastos', desc: 'Cargar consumos', icon: DollarSign },
    { key: 'deudas', title: 'Deudas', desc: 'Ver y pagar', icon: CreditCard },
    { key: 'categorias', title: 'Categorías', desc: 'Gestionar categorías', icon: Tag },
    { key: 'reportes', title: 'Reportes', desc: 'Estadísticas y análisis', icon: BarChart3 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0' }}>
      {modules.map((c) => {
        const Icon = c.icon;
        return (
          <button
            key={c.key}
            onClick={() => onNavigate?.(c.key)}
            style={{
              width: '100%',
              padding: '18px 28px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              border: '1px solid #333',
              borderRadius: '10px',
              background: '#1a1a1a',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(110deg, #7c4dff 0%, #b794ff 100%)';
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(124, 77, 255, 0.5)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateX(8px)';
              const icon = e.currentTarget.querySelector('svg') as SVGElement;
              if (icon) icon.style.color = 'white';
              const diagonal1 = e.currentTarget.querySelector('.diagonal-1') as HTMLElement;
              if (diagonal1) diagonal1.style.opacity = '1';
              const diagonal2 = e.currentTarget.querySelector('.diagonal-2') as HTMLElement;
              if (diagonal2) diagonal2.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#1a1a1a';
              e.currentTarget.style.borderColor = '#333';
              e.currentTarget.style.boxShadow = '';
              e.currentTarget.style.color = '';
              e.currentTarget.style.transform = 'translateX(0)';
              const icon = e.currentTarget.querySelector('svg') as SVGElement;
              if (icon) icon.style.color = 'var(--accent)';
              const diagonal1 = e.currentTarget.querySelector('.diagonal-1') as HTMLElement;
              if (diagonal1) diagonal1.style.opacity = '0';
              const diagonal2 = e.currentTarget.querySelector('.diagonal-2') as HTMLElement;
              if (diagonal2) diagonal2.style.opacity = '0';
            }}
          >
            {/* Decoración diagonal capa 1 - área sombreada */}
            <div 
              className="diagonal-1"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '50%',
                background: 'linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.15) 100%)',
                clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)',
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }} 
            />
            
            {/* Decoración diagonal capa 2 - línea diagonal */}
            <div 
              className="diagonal-2"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                clipPath: 'polygon(40% 0, 42% 0, 2% 100%, 0% 100%)',
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }} 
            />
            
            <Icon 
              size={32} 
              strokeWidth={2} 
              style={{ 
                color: 'var(--accent)',
                flexShrink: 0,
                transition: 'color 0.3s ease',
                zIndex: 1
              }} 
            />
            
            <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
              <div style={{ 
                fontSize: '1.2em', 
                fontWeight: '700',
                marginBottom: '2px',
                lineHeight: 1.1
              }}>
                {c.title}
              </div>
              <div style={{ 
                fontSize: '0.85em', 
                opacity: 0.75,
                lineHeight: 1.2
              }}>
                {c.desc}
              </div>
            </div>
            
            {/* Flecha indicadora */}
            <div style={{ 
              fontSize: '1.3em', 
              opacity: 0.5,
              transition: 'opacity 0.3s ease',
              zIndex: 1
            }}>
              →
            </div>
          </button>
        );
      })}
    </div>
  );
}

