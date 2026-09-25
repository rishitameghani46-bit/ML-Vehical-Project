// src/components/Footer.jsx
import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-container glass-panel">
      <div className="footer-content">
        <div className="footer-brand">
          <Shield size={18} className="footer-icon" />
          <span className="footer-title">SENTINEL FRAUD INTELLIGENCE PLATFORM</span>
        </div>

        <div className="footer-meta">
          <span>Accuracy: <strong>90.88%</strong></span>
          <span className="meta-sep">&bull;</span>
          <span>Precision: <strong>85.29%</strong></span>
          <span className="meta-sep">&bull;</span>
          <span>Recall: <strong>70.73%</strong></span>
          <span className="meta-sep">&bull;</span>
          <span>F1-Score: <strong>77.33%</strong></span>
        </div>

        <div className="footer-tags">
          <span className="badge badge-indigo">FastAPI</span>
          <span className="badge badge-indigo">Scikit-Learn</span>
          <span className="badge badge-indigo">React 19</span>
          <span className="badge badge-indigo">Vite</span>
        </div>
      </div>
    </footer>
  );
}
