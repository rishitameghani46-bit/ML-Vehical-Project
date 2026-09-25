// src/components/MetricsBanner.jsx
import React from 'react';
import { Target, CheckCircle2, Search, Zap, Info } from 'lucide-react';

export default function MetricsBanner({ metrics, onTabSelect }) {
  const m = metrics || {
    accuracy: 90.88,
    precision: 85.29,
    recall: 70.73,
    f1_score: 77.33
  };

  const metricCards = [
    {
      id: 'accuracy',
      label: 'Model Accuracy',
      value: `${m.accuracy}%`,
      percentage: m.accuracy,
      tag: 'Target 85–90% Exceeded',
      subtext: '339 correct out of 373 test claims',
      icon: <Target className="metric-icon" size={20} />,
      colorVar: '--accent-primary',
      gradient: 'linear-gradient(90deg, #6366f1, #818cf8)',
      badgeClass: 'badge-indigo',
      tooltip: 'Accuracy measures total correct predictions (TN + TP) over all evaluated insurance claims.'
    },
    {
      id: 'precision',
      label: 'Precision (Fraud)',
      value: `${m.precision}%`,
      percentage: m.precision,
      tag: 'Minimal False Accusations',
      subtext: '85.3% of flagged claims are verified fraud',
      icon: <CheckCircle2 className="metric-icon" size={20} />,
      colorVar: '--safe-emerald',
      gradient: 'linear-gradient(90deg, #10b981, #34d399)',
      badgeClass: 'badge-emerald',
      tooltip: 'Precision measures reliability of fraud flags: only 10 false alarms out of 291 genuine policyholders.'
    },
    {
      id: 'recall',
      label: 'Recall / Sensitivity',
      value: `${m.recall}%`,
      percentage: m.recall,
      tag: '70.7% Fraud Intercepted',
      subtext: '58 of 82 fraudulent claims intercepted',
      icon: <Search className="metric-icon" size={20} />,
      colorVar: '--fraud-rose',
      gradient: 'linear-gradient(90deg, #f43f5e, #fb7185)',
      badgeClass: 'badge-rose',
      tooltip: 'Recall measures fraud capture rate: 58 true fraud claims caught out of 82 total fraud cases.'
    },
    {
      id: 'f1',
      label: 'F1-Score (Harmonic)',
      value: `${m.f1_score}%`,
      percentage: m.f1_score,
      tag: 'Demure Precision/Recall Balance',
      subtext: 'High trade-off optimization',
      icon: <Zap className="metric-icon" size={20} />,
      colorVar: '--warn-amber',
      gradient: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
      badgeClass: 'badge-amber',
      tooltip: 'F1-Score is the harmonic mean of precision and recall, ensuring neither metric is compromised.'
    }
  ];

  return (
    <section className="metrics-banner-grid">
      {metricCards.map((card) => (
        <div
          key={card.id}
          className="metric-card glass-panel"
          onClick={() => onTabSelect && onTabSelect('metrics')}
          title="Click to inspect full evaluation breakdown in Lab"
        >
          <div className="metric-card-header">
            <span className="metric-card-title">{card.label}</span>
            <div className="metric-icon-wrap" style={{ color: `var(${card.colorVar})` }}>
              {card.icon}
            </div>
          </div>

          <div className="metric-card-body">
            <div className="metric-value-row">
              <span className="metric-number">{card.value}</span>
              <span className={`badge ${card.badgeClass}`}>{card.tag}</span>
            </div>

            {/* Glowing mini progress bar */}
            <div className="metric-card-progress">
              <div
                className="metric-progress-fill"
                style={{
                  width: `${card.percentage}%`,
                  background: card.gradient
                }}
              />
            </div>

            <p className="metric-subtext">{card.subtext}</p>
          </div>

          <div className="metric-card-footer">
            <span className="metric-formula-hint">
              <Info size={12} />
              <span>{card.tooltip}</span>
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
