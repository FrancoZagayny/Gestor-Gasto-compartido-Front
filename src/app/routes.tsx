import { useState, useEffect } from 'react';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './features/Dashboard/views/DashboardPage';
import EventosPage from './features/Eventos/views/EventosPage';
import ParticipantesPage from './features/Participantes/views/ParticipantesPage';
import GastosPage from './features/Gastos/views/GastosPage';
import DeudasPage from './features/Deudas/views/DeudasPage';
import CategoriasPage from './features/Categorias/views/CategoriasPage';

type Route = 'home' | 'eventos' | 'participantes' | 'gastos' | 'deudas' | 'categorias';

export function AppRouter() {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');

  useEffect(() => {
    const savedRoute = localStorage.getItem('currentRoute') as Route | null;
    if (savedRoute && ['home', 'eventos', 'participantes', 'gastos', 'deudas', 'categorias'].includes(savedRoute)) {
      setCurrentRoute(savedRoute);
    }
  }, []);

  const handleNavigate = (route: string) => {
    const validRoute = route as Route;
    if (['home', 'eventos', 'participantes', 'gastos', 'deudas', 'categorias'].includes(route)) {
      setCurrentRoute(validRoute);
      localStorage.setItem('currentRoute', validRoute);
    }
  };

  const handleBack = () => {
    handleNavigate('home');
  };

  const renderRoute = () => {
    switch (currentRoute) {
      case 'home':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'eventos':
        return <EventosPage onBack={handleBack} />;
      case 'participantes':
        return <ParticipantesPage onBack={handleBack} />;
      case 'gastos':
        return <GastosPage onBack={handleBack} />;
      case 'deudas':
        return <DeudasPage onBack={handleBack} />;
      case 'categorias':
        return <CategoriasPage onBack={handleBack} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppLayout currentRoute={currentRoute} onNavigate={handleNavigate}>
      {renderRoute()}
    </AppLayout>
  );
}

