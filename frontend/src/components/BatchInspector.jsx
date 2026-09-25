// src/components/BatchInspector.jsx
import React, { useState } from 'react';
import { Layers, Filter, Search, Download, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SAMPLE_BATCH_CLAIMS } from '../data/mockData';

export default function BatchInspector() {
  const [claims, setClaims] = useState(SAMPLE_BATCH_CLAIMS);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClaims = claims.filter(c => {
    const matchesFilter =
      filter === 'ALL' ? true :
      filter === 'FRAUD' ? c.predicted_label === 'Fraud' :
      c.predicted_label === 'Not Fraud';

    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.driver.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const fraudCount = claims.filter(c => c.predicted_label === 'Fraud').length;
  const cleanCount = claims.filter(c => c.predicted_label === 'Not Fraud').length;

  const handleExportCSV = () => {
    const headers = ["Claim ID", "Policyholder", "Annual Income", "Vehicle", "Total Claim", "Injury Claim", "Past Claims", "Liability %", "Prediction", "Fraud Probability", "Risk Tier"];
    const rows = filteredClaims.map(c => [
      c.id, `"${c.driver}"`, c.annual_income, `"${c.vehicle}"`, c.total_claim, c.injury_claim, c.past_claims, c.liab_prct, c.predicted_label, `${c.fraud_prob}%`, c.risk_level
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch_claims_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="batch-layout">
      {/* KPI Stats Strip */}
      <div className="batch-stats-strip">
        <div className="batch-stat-box glass-panel">
          <span className="batch-stat-num">{claims.length}</span>
          <span className="batch-stat-label">Total Claims Inspected</span>
        </div>

        <div className="batch-stat-box glass-panel">
          <span className="batch-stat-num text-rose">{fraudCount}</span>
          <span className="batch-stat-label">Flagged Fraud ({(fraudCount / claims.length * 100).toFixed(1)}%)</span>
        </div>

        <div className="batch-stat-box glass-panel">
          <span className="batch-stat-num text-emerald">{cleanCount}</span>
          <span className="batch-stat-label">Cleared As Clean ({(cleanCount / claims.length * 100).toFixed(1)}%)</span>
        </div>

        <div className="batch-stat-box glass-panel">
          <span className="batch-stat-num">90.88%</span>
          <span className="batch-stat-label">Model Accuracy Alignment</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="batch-table-container glass-panel">
        <div className="batch-controls-row">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Filter by Claim ID or Policyholder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-button-group">
            <button
              className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilter('ALL')}
            >
              All Claims ({claims.length})
            </button>
            <button
              className={`filter-btn ${filter === 'FRAUD' ? 'active' : ''}`}
              onClick={() => setFilter('FRAUD')}
            >
              Fraud Only ({fraudCount})
            </button>
            <button
              className={`filter-btn ${filter === 'CLEAN' ? 'active' : ''}`}
              onClick={() => setFilter('CLEAN')}
            >
              Clean Only ({cleanCount})
            </button>

            <button
              className="btn-secondary export-csv-btn"
              onClick={handleExportCSV}
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="demure-table">
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Policyholder Profile</th>
                <th>Vehicle Specs</th>
                <th>Total Claim</th>
                <th>Injury Claim</th>
                <th>Prior Claims</th>
                <th>Liability %</th>
                <th>Risk Score</th>
                <th>AI Verdict</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((claim) => {
                const isF = claim.predicted_label === 'Fraud';
                return (
                  <tr key={claim.id}>
                    <td>
                      <span className="claim-id-badge">{claim.id}</span>
                    </td>
                    <td>
                      <div className="driver-name">{claim.driver}</div>
                      <div className="driver-sub">Income: ${claim.annual_income.toLocaleString()}</div>
                    </td>
                    <td>{claim.vehicle}</td>
                    <td>
                      <strong>${claim.total_claim.toLocaleString()}</strong>
                    </td>
                    <td>${claim.injury_claim.toLocaleString()}</td>
                    <td>{claim.past_claims} prior</td>
                    <td>
                      <span className={`liab-pill ${claim.liab_prct > 50 ? 'high' : 'low'}`}>
                        {claim.liab_prct}%
                      </span>
                    </td>
                    <td>
                      <div className="prob-meter-row">
                        <span className="prob-text">{claim.fraud_prob}%</span>
                        <div className="mini-prob-track">
                          <div
                            className="mini-prob-fill"
                            style={{
                              width: `${claim.fraud_prob}%`,
                              background: isF ? 'var(--fraud-rose)' : 'var(--safe-emerald)'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${isF ? 'badge-rose' : 'badge-emerald'}`}>
                        {isF ? 'FRAUD DETECTED' : 'CLEAN'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
