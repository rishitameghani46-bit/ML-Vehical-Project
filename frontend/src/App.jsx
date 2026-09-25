// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsBanner from './components/MetricsBanner';
import ClaimStudio from './components/ClaimStudio';
import MetricsLab from './components/MetricsLab';
import BatchInspector from './components/BatchInspector';
import ModelArchitecture from './components/ModelArchitecture';
import Footer from './components/Footer';
import { fetchMetrics, checkBackendHealth } from './services/api';
import { DEFAULT_METRICS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sentinel_theme') || 'dark';
  });
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [health, setHealth] = useState({
    online: false,
    latency: null,
    statusText: 'Connecting...'
  });

  // Apply theme to root document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sentinel_theme', theme);
  }, [theme]);

  // Load metrics and check backend health on mount
  useEffect(() => {
    async function init() {
      const h = await checkBackendHealth();
      setHealth(h);

      const m = await fetchMetrics();
      if (m) setMetrics(m);
    }
    init();

    // Health check polling every 12 seconds
    const interval = setInterval(async () => {
      const h = await checkBackendHealth();
      setHealth(h);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-wrapper">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        health={health}
      />

      <main className="main-content-container">
        {/* Demure Hero Metrics Strip */}
        <MetricsBanner metrics={metrics} onTabSelect={setActiveTab} />

        {/* Dynamic Tab Views */}
        <div className="tab-view-container">
          {activeTab === 'studio' && (
            <ClaimStudio onEvaluationRequested={() => {}} />
          )}

          {activeTab === 'metrics' && (
            <MetricsLab metrics={metrics} />
          )}

          {activeTab === 'batch' && (
            <BatchInspector />
          )}

          {activeTab === 'architecture' && (
            <ModelArchitecture />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
