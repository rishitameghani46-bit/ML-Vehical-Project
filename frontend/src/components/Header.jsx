// src/components/Header.jsx
import React from 'react';
import { Shield, Activity, Sun, Moon, Cpu, Layers, FileText, Database } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, theme, setTheme, health }) {
  return (
    <header className="header-container glass-panel">
      <div className="header-left">
        <div className="brand-logo">
          <Shield className="logo-icon" size={24} />
          <div className="brand-titles">
            <div className="brand-main">
              <span className="brand-name">SENTINEL</span>
              <span className="brand-divider">//</span>
              <span className="brand-subtitle">FRAUD INTELLIGENCE</span>
            </div>
            <span className="brand-meta">DEMURE DECISION PIPELINE &bull; ML PRODUCTION</span>
          </div>
        </div>
      </div>

      <nav className="header-nav">
        <button
          className={`nav-tab ${activeTab === 'studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('studio')}
        >
          <Activity size={16} />
          <span>Claim Studio</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          <Cpu size={16} />
          <span>Evaluation Lab</span>
          <span className="nav-pill-badge">90.88%</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'batch' ? 'active' : ''}`}
          onClick={() => setActiveTab('batch')}
        >
          <Layers size={16} />
          <span>Batch Claims</span>
        </button>

        <button
          className={`nav-tab ${activeTab === 'architecture' ? 'active' : ''}`}
          onClick={() => setActiveTab('architecture')}
        >
          <Database size={16} />
          <span>Architecture</span>
        </button>
      </nav>

      <div className="header-right">
        {/* Backend health indicator */}
        <div className={`health-badge ${health.online ? 'online' : 'offline'}`} title="FastAPI Backend Status">
          <span className={`pulsing-dot ${health.online ? '' : 'offline'}`} />
          <span className="health-text">{health.statusText}</span>
        </div>

        {/* Theme toggle */}
        <button
          className="theme-toggle-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
