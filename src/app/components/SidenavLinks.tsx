interface SidenavLinksProps {
  currentRoute?: string;
  onNavigate?: (route: string) => void;
}

export default function SidenavLinks({ currentRoute, onNavigate }: SidenavLinksProps) {
  const links = [
    { key: 'home', label: 'Inicio' },
  ];

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {links.map((link) => (
        <button
          key={link.key}
          onClick={() => onNavigate?.(link.key)}
          className={`card ${currentRoute === link.key ? 'active' : ''}`}
          style={{
            textAlign: 'left',
            background: currentRoute === link.key ? 'rgba(124, 77, 255, 0.2)' : undefined,
            borderColor: currentRoute === link.key ? 'var(--accent)' : undefined,
          }}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
}

