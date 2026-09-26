import React from 'react';
import {
  Sprout,
  LayoutDashboard,
  Trees,
  Sparkles,
  FlaskConical,
  Droplets,
  CalendarCheck2,
    WalletCards,
  HardHat,
  HelpCircle,
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendOnline, onOpenExplainer }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'farms', label: 'Farms', icon: Trees },
    { id: 'crop-recommendation', label: 'Crop Decision', icon: Sparkles },
    { id: 'fertilizer', label: 'Fertilizer Guide', icon: FlaskConical },
    { id: 'irrigation', label: 'Water & Irrigation', icon: Droplets },
    { id: 'activities', label: 'Activities', icon: CalendarCheck2 },
    { id: 'expenses', label: 'Expenses', icon: WalletCards },
    { id: 'labour', label: 'Labour Diary', icon: HardHat },
  ];

  return (
    <header className="header-navbar">
      <div className="nav-inner">
        <div className="brand-logo" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">
            <Sprout size={22} />
          </div>
          <div>
            <div>Smart Crop System</div>
            <span className="brand-sub">Decision Support & Farm Management</span>
          </div>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenExplainer}
            title="Understand rule-based decision logic"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
          >
            <HelpCircle size={15} color="#16a34a" />
            <span>Logic Guide</span>
          </button>

          <div
            className={`nav-status-badge ${backendOnline ? '' : 'offline'}`}
            title={backendOnline ? 'Spring Boot REST API connected' : 'Cannot reach backend'}
          >
            <span className="nav-status-dot"></span>
            <span>{backendOnline ? 'Backend Online' : 'Connecting...'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
