import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  currentRoute?: string;
  onNavigate?: (route: string) => void;
}

export default function AppLayout({ children, currentRoute, onNavigate }: AppLayoutProps) {
  const isHome = currentRoute === 'home';
  
  return (
    <div className="container">
      {isHome && (
        <h1 onClick={() => onNavigate?.('home')} style={{ cursor: 'pointer', textAlign: 'center' }}>
          GESTOR DE GASTOS COMPARTIDOS
        </h1>
      )}
      {children}
    </div>
  );
}

