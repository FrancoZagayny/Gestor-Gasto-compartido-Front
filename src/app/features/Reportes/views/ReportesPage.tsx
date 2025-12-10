import { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  CreditCard,
  PieChart,
  FileText,
  Activity
} from 'lucide-react';
import { ReportesService } from '../services/ReportesService';
import {
  ResumenEvento,
  GastoPorCategoria,
  BalanceParticipante,
  EventoPorPeriodo,
  EstadisticasGenerales,
  EventoLista,
} from '../types/ReporteTypes';
import { formatMoney } from '../../../../shared/libs/utils';

interface ReportesPageProps {
  onBack?: () => void;
}

type Tab = 'generales' | 'evento' | 'periodo';

export default function ReportesPage({ onBack }: ReportesPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('generales');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para reportes generales
  const [statsGenerales, setStatsGenerales] = useState<EstadisticasGenerales | null>(null);

  // Estados para reportes por evento
  const [eventos, setEventos] = useState<EventoLista[]>([]);
  const [selectedEvento, setSelectedEvento] = useState('');
  const [resumenEvento, setResumenEvento] = useState<ResumenEvento | null>(null);
  const [gastosPorCategoria, setGastosPorCategoria] = useState<GastoPorCategoria[]>([]);
  const [balanceParticipantes, setBalanceParticipantes] = useState<BalanceParticipante[]>([]);

  // Estados para reportes por periodo
  const [tipoPeriodo, setTipoPeriodo] = useState<'mes' | 'anio'>('mes');
  const [diaDesde, setDiaDesde] = useState('1');
  const [mesDesde, setMesDesde] = useState('1');
  const [anioDesde, setAnioDesde] = useState('');
  const [diaHasta, setDiaHasta] = useState('');
  const [mesHasta, setMesHasta] = useState('');
  const [anioHasta, setAnioHasta] = useState('');
  const [eventosPorPeriodo, setEventosPorPeriodo] = useState<EventoPorPeriodo[]>([]);

  useEffect(() => {
    loadEventos();
    loadEstadisticasGenerales();
  }, []);

  async function loadEventos() {
    try {
      const data = await ReportesService.getEventosLista();
      setEventos(data);
      if (data.length > 0 && !selectedEvento) {
        setSelectedEvento(String(data[0].id_evento));
      }
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function loadEstadisticasGenerales() {
    setLoading(true);
    setError('');
    try {
      const data = await ReportesService.getEstadisticasGenerales();
      setStatsGenerales(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadReportesEvento(id: string) {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const [resumen, categorias, balance] = await Promise.all([
        ReportesService.getResumenEvento(Number(id)),
        ReportesService.getGastosPorCategoria(Number(id)),
        ReportesService.getBalanceParticipantes(Number(id)),
      ]);
      setResumenEvento(resumen);
      setGastosPorCategoria(categorias);
      setBalanceParticipantes(balance);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadEventosPorPeriodo() {
    setLoading(true);
    setError('');
    try {
      // Construir fechas desde los selectores
      let fechaDesde: string | undefined = undefined;
      let fechaHasta: string | undefined = undefined;

      if (anioDesde && mesDesde && diaDesde) {
        fechaDesde = `${anioDesde}-${mesDesde.padStart(2, '0')}-${diaDesde.padStart(2, '0')}`;
      }

      if (anioHasta && mesHasta && diaHasta) {
        fechaHasta = `${anioHasta}-${mesHasta.padStart(2, '0')}-${diaHasta.padStart(2, '0')}`;
      }

      const data = await ReportesService.getEventosPorPeriodo(
        tipoPeriodo,
        fechaDesde,
        fechaHasta,
      );
      setEventosPorPeriodo(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedEvento && activeTab === 'evento') {
      loadReportesEvento(selectedEvento);
    }
  }, [selectedEvento, activeTab]);

  useEffect(() => {
    if (activeTab === 'periodo') {
      loadEventosPorPeriodo();
    }
  }, [activeTab, tipoPeriodo]);

  function renderTabButtons() {
    const tabs: { key: Tab; label: string; icon: any; description: string }[] = [
      {
        key: 'generales',
        label: 'Estadísticas Generales',
        icon: Activity,
        description: 'Vista general del sistema'
      },
      {
        key: 'evento',
        label: 'Reportes por Evento',
        icon: TrendingUp,
        description: 'Análisis detallado de eventos'
      },
      {
        key: 'periodo',
        label: 'Análisis Temporal',
        icon: Calendar,
        description: 'Evolución en el tiempo'
      },
    ];

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
        gap: '20px',
        marginBottom: '32px',
        width: '100%',
        maxWidth: '100%'
      }}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="card"
              style={{
                padding: '32px 24px',
                background: isActive ? 'linear-gradient(135deg, var(--accent) 0%, #9d6dff 100%)' : undefined,
                borderColor: isActive ? 'var(--accent)' : undefined,
                color: isActive ? 'white' : undefined,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isActive ? '0 8px 24px rgba(124, 77, 255, 0.4)' : 'none',
                transition: 'all 0.3s ease',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                minHeight: '160px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 77, 255, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Decoración diagonal */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: '150px',
                  height: '150px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'rotate(45deg)',
                  pointerEvents: 'none',
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                <IconComponent
                  size={40}
                  strokeWidth={2}
                  style={{
                    color: isActive ? 'white' : 'var(--accent)',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '1.3em',
                    fontWeight: '700',
                    marginBottom: '6px',
                    lineHeight: 1.2
                  }}>
                    {tab.label}
                  </div>
                  <div style={{
                    fontSize: '0.9em',
                    opacity: isActive ? 0.95 : 0.7,
                    lineHeight: 1.4
                  }}>
                    {tab.description}
                  </div>
                </div>
              </div>

              {/* Indicador de selección */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '0 0 12px 12px',
                }} />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  function renderEstadisticasGenerales() {
    if (!statsGenerales) return <p>Cargando...</p>;

    return (
      <div className="section" style={{ animation: 'fadeIn 0.4s ease-in' }}>
        <div style={{
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '2px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Activity size={32} strokeWidth={2} style={{ color: 'var(--accent)' }} />
          <h3 style={{ margin: 0, fontSize: '1.8em' }}>Resumen Global</h3>
        </div>
        <div className="grid-cards">
          <div className="card" style={{
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 77, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '';
            }}>
            <Calendar size={28} style={{ color: 'var(--accent)', marginBottom: 12 }} />
            <div style={{ fontSize: '0.9em', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Total Eventos</div>
            <div style={{ fontSize: '2.2em', fontWeight: 'bold', color: 'var(--accent)', margin: '8px 0' }}>
              {statsGenerales.total_eventos}
            </div>
            <div style={{ fontSize: '0.85em', opacity: 0.7, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50', padding: '2px 8px', borderRadius: '4px' }}>
                {statsGenerales.eventos_activos} activos
              </span>
              <span style={{ background: 'rgba(158, 158, 158, 0.2)', color: '#9e9e9e', padding: '2px 8px', borderRadius: '4px' }}>
                {statsGenerales.eventos_finalizados} finalizados
              </span>
            </div>
          </div>

          <div className="card" style={{
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 77, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '';
            }}>
            <FileText size={28} style={{ color: 'var(--accent)', marginBottom: 12 }} />
            <div style={{ fontSize: '0.9em', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Gastos Registrados</div>
            <div style={{ fontSize: '2.2em', fontWeight: 'bold', color: 'var(--accent)', margin: '8px 0' }}>
              {statsGenerales.total_gastos_registrados}
            </div>
            <div style={{ fontSize: '1em', opacity: 0.8, fontWeight: '600' }}>
              ${formatMoney(statsGenerales.monto_total_gastado)}
            </div>
          </div>

          <div className="card" style={{
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 77, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '';
            }}>
            <Users size={28} style={{ color: 'var(--accent)', marginBottom: 12 }} />
            <div style={{ fontSize: '0.9em', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Participantes</div>
            <div style={{ fontSize: '2.2em', fontWeight: 'bold', color: 'var(--accent)', margin: '8px 0' }}>
              {statsGenerales.total_participantes_unicos}
            </div>
            <div style={{ fontSize: '0.85em', opacity: 0.7 }}>personas registradas</div>
          </div>

          <div className="card" style={{
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 77, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '';
            }}>
            <CreditCard size={28} style={{ color: 'var(--accent)', marginBottom: 12 }} />
            <div style={{ fontSize: '0.9em', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>Deudas</div>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold', margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ color: '#4caf50' }}>{statsGenerales.deudas_pagadas}</span>
              <span style={{ opacity: 0.5 }}>/</span>
              <span style={{ color: '#ff9800' }}>{statsGenerales.deudas_pendientes}</span>
            </div>
            <div style={{ fontSize: '0.85em', opacity: 0.7, display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <span>pagadas / pendientes</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderReportesEvento() {
    return (
      <div className="section" style={{ animation: 'fadeIn 0.4s ease-in' }}>
        <div className="field">
          <label style={{ fontSize: '1.1em', fontWeight: '500' }}>Selecciona un evento:</label>
          <select
            className="input"
            value={selectedEvento}
            onChange={(e) => setSelectedEvento(e.target.value)}
            style={{ maxWidth: '400px' }}
          >
            <option value="">-- Selecciona un evento --</option>
            {eventos.map((e) => (
              <option key={e.id_evento} value={e.id_evento}>
                {e.nombre} ({e.estado})
              </option>
            ))}
          </select>
        </div>

        {resumenEvento && (
          <>
            {/* Resumen General */}
            <div>
              <div style={{
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '2px solid var(--accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <TrendingUp size={28} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '1.5em' }}>
                  Resumen del Evento: {resumenEvento.nombre_evento}
                </h3>
              </div>
              <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))' }}>
                <div className="card">
                  <div style={{ fontSize: '0.85em', opacity: 0.7 }}>Total Gastado</div>
                  <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: 'var(--accent)' }}>
                    ${formatMoney(resumenEvento.total_gastado)}
                  </div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.85em', opacity: 0.7 }}>Gastos</div>
                  <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{resumenEvento.cantidad_gastos}</div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.85em', opacity: 0.7 }}>Participantes</div>
                  <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>{resumenEvento.cantidad_participantes}</div>
                </div>
                <div className="card">
                  <div style={{ fontSize: '0.85em', opacity: 0.7 }}>Promedio/Persona</div>
                  <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>
                    ${formatMoney(resumenEvento.promedio_por_persona)}
                  </div>
                </div>
              </div>
            </div>

            {/* Estado de Deudas */}
            <div>
              <div style={{
                marginBottom: '16px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(124, 77, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <DollarSign size={26} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: '1.4em' }}>Estado de Deudas</h3>
              </div>
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', width: '100%' }}>
                  <div style={{ minWidth: '120px' }}>
                    <div style={{ fontSize: '0.9em', opacity: 0.7 }}>Deudas Pagadas</div>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#4caf50' }}>
                      ${formatMoney(resumenEvento.total_deudas_pagadas)}
                    </div>
                  </div>
                  <div style={{ minWidth: '120px' }}>
                    <div style={{ fontSize: '0.9em', opacity: 0.7 }}>Deudas Pendientes</div>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#ff9800' }}>
                      ${formatMoney(resumenEvento.total_deudas_pendientes)}
                    </div>
                  </div>
                  <div style={{ flex: '1 1 100%', minWidth: 0, maxWidth: '100%' }}>
                    <div style={{ fontSize: '0.9em', opacity: 0.7, marginBottom: '8px' }}>
                      Progreso de Pagos: {resumenEvento.porcentaje_pagado.toFixed(1)}%
                    </div>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        height: '12px',
                        background: '#2b2b2b',
                        borderRadius: '6px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(resumenEvento.porcentaje_pagado, 100)}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #4caf50, #8bc34a)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gastos por Categoría */}
            {gastosPorCategoria.length > 0 && (
              <div>
                <div style={{
                  marginBottom: '16px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid rgba(124, 77, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <PieChart size={26} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.4em' }}>Gastos por Categoría</h3>
                </div>
                <div className="card">
                  <ul className="list">
                    {gastosPorCategoria.map((cat, idx) => (
                      <li key={idx} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '600', fontSize: '1.1em', wordBreak: 'break-word' }}>{cat.nombre_categoria}</div>
                            <div style={{ fontSize: '0.9em', opacity: 0.7 }}>
                              {cat.cantidad_gastos} gasto{cat.cantidad_gastos !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: 'var(--accent)' }}>
                              ${formatMoney(cat.total)}
                            </div>
                            <div style={{ fontSize: '0.9em', opacity: 0.7 }}>{cat.porcentaje.toFixed(1)}%</div>
                          </div>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '8px',
                            background: '#2b2b2b',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            marginTop: '12px',
                          }}
                        >
                          <div
                            style={{
                              width: `${cat.porcentaje}%`,
                              height: '100%',
                              background: `hsl(${(idx * 360) / gastosPorCategoria.length}, 70%, 60%)`,
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Balance de Participantes */}
            {balanceParticipantes.length > 0 && (
              <div>
                <div style={{
                  marginBottom: '16px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid rgba(124, 77, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Users size={26} strokeWidth={2} style={{ color: 'var(--accent)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.4em' }}>Balance de Participantes</h3>
                </div>
                <div className="card">
                  <ul className="list">
                    {balanceParticipantes.map((p) => (
                      <li key={p.id_participante} className="list-item">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: '600', fontSize: '1.1em', wordBreak: 'break-word' }}>{p.nombre}</div>
                          <div style={{ fontSize: '0.85em', opacity: 0.7 }}>
                            Pagó: ${formatMoney(p.total_pagado)} • Su parte: ${formatMoney(p.total_debe)}
                            {p.cantidad_gastos_realizados > 0 && ` • ${p.cantidad_gastos_realizados} gasto${p.cantidad_gastos_realizados !== 1 ? 's' : ''} realizado${p.cantidad_gastos_realizados !== 1 ? 's' : ''}`}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div
                            style={{
                              fontSize: '1.3em',
                              fontWeight: 'bold',
                              color: p.balance >= 0 ? '#4caf50' : '#f44336',
                            }}
                          >
                            {p.balance >= 0 ? '+' : ''}${formatMoney(Math.abs(p.balance))}
                          </div>
                          <div style={{ fontSize: '0.85em', opacity: 0.7 }}>
                            {p.balance > 0 ? 'A favor' : p.balance < 0 ? 'A pagar' : 'Equilibrado'}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  function renderAnalisisTemporal() {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    const meses = [
      { value: '1', label: 'Enero' },
      { value: '2', label: 'Febrero' },
      { value: '3', label: 'Marzo' },
      { value: '4', label: 'Abril' },
      { value: '5', label: 'Mayo' },
      { value: '6', label: 'Junio' },
      { value: '7', label: 'Julio' },
      { value: '8', label: 'Agosto' },
      { value: '9', label: 'Septiembre' },
      { value: '10', label: 'Octubre' },
      { value: '11', label: 'Noviembre' },
      { value: '12', label: 'Diciembre' },
    ];

    const getDiasDelMes = (mes: string, anio: string) => {
      if (!mes || !anio) return 31;
      const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const mesNum = parseInt(mes);
      let dias = diasPorMes[mesNum - 1];

      // Año bisiesto
      if (mesNum === 2) {
        const anioNum = parseInt(anio);
        if ((anioNum % 4 === 0 && anioNum % 100 !== 0) || anioNum % 400 === 0) {
          dias = 29;
        }
      }
      return dias;
    };

    const diasDesde = getDiasDelMes(mesDesde, anioDesde);
    const diasHasta = getDiasDelMes(mesHasta, anioHasta);

    return (
      <div className="section" style={{ animation: 'fadeIn 0.4s ease-in' }}>
        <div style={{
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '2px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Calendar size={32} strokeWidth={2} style={{ color: 'var(--accent)' }} />
          <h3 style={{ margin: 0, fontSize: '1.8em' }}>Análisis por Periodo</h3>
        </div>

        <div className="card" style={{ display: 'grid', gap: '16px' }}>
          <div className="field">
            <label>Tipo de Periodo:</label>
            <select
              className="input"
              value={tipoPeriodo}
              onChange={(e) => setTipoPeriodo(e.target.value as 'mes' | 'anio')}
            >
              <option value="mes">Por Mes</option>
              <option value="anio">Por Año</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Fecha Desde (opcional):</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
              <div className="field">
                <label style={{ fontSize: '0.9em', opacity: 0.8 }}>Día</label>
                <select className="input" value={diaDesde} onChange={(e) => setDiaDesde(e.target.value)}>
                  <option value="">-</option>
                  {Array.from({ length: diasDesde }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label style={{ fontSize: '0.9em', opacity: 0.8 }}>Mes</label>
                <select className="input" value={mesDesde} onChange={(e) => setMesDesde(e.target.value)}>
                  <option value="">-</option>
                  {meses.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label style={{ fontSize: '0.9em', opacity: 0.8 }}>Año</label>
                <select className="input" value={anioDesde} onChange={(e) => setAnioDesde(e.target.value)}>
                  <option value="">-</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Fecha Hasta (opcional):</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
              <div className="field">
                <label style={{ fontSize: '0.9em', opacity: 0.8 }}>Día</label>
                <select className="input" value={diaHasta} onChange={(e) => setDiaHasta(e.target.value)}>
                  <option value="">-</option>
                  {Array.from({ length: diasHasta }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label style={{ fontSize: '0.9em', opacity: 0.8 }}>Mes</label>
                <select className="input" value={mesHasta} onChange={(e) => setMesHasta(e.target.value)}>
                  <option value="">-</option>
                  {meses.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label style={{ fontSize: '0.9em', opacity: 0.8 }}>Año</label>
                <select className="input" value={anioHasta} onChange={(e) => setAnioHasta(e.target.value)}>
                  <option value="">-</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button onClick={loadEventosPorPeriodo} style={{ width: '100%' }}>Aplicar Filtros</button>
        </div>

        {eventosPorPeriodo.length > 0 ? (
          <div className="card">
            <ul className="list">
              {eventosPorPeriodo.map((ep) => (
                <li key={ep.periodo} className="list-item">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '1.2em', fontWeight: '600', wordBreak: 'break-word' }}>
                      {tipoPeriodo === 'mes'
                        ? new Date(ep.periodo + '-01').toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'long',
                        })
                        : ep.periodo}
                    </div>
                    <div style={{ fontSize: '0.9em', opacity: 0.7 }}>
                      {ep.cantidad_eventos} evento{ep.cantidad_eventos !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--accent)' }}>
                      ${formatMoney(ep.total_gastado)}
                    </div>
                    <div style={{ fontSize: '0.85em', opacity: 0.7 }}>total gastado</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="card">
            <p style={{ textAlign: 'center', opacity: 0.6 }}>
              No hay datos para el periodo seleccionado
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="section">
      <h2 onClick={onBack} style={{ cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        ← Reportes
        <BarChart3 size={32} strokeWidth={2} />
      </h2>

      {renderTabButtons()}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading && <p style={{ opacity: 0.7 }}>Cargando...</p>}

      {activeTab === 'generales' && renderEstadisticasGenerales()}
      {activeTab === 'evento' && renderReportesEvento()}
      {activeTab === 'periodo' && renderAnalisisTemporal()}
    </div>
  );
}

