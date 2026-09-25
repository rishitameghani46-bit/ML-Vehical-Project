// src/components/MetricsLab.jsx
import React, { useState } from 'react';
import { Target, CheckCircle2, Search, Zap, Layers, BarChart3, HelpCircle, ArrowUpRight } from 'lucide-react';
import { DEFAULT_METRICS } from '../data/mockData';

export default function MetricsLab({ metrics }) {
  const m = metrics || DEFAULT_METRICS;
  const cm = m.confusion_matrix || DEFAULT_METRICS.confusion_matrix;
  const [selectedCell, setSelectedCell] = useState('tp');

  const cellDetails = {
    tn: {
      title: "True Negatives (TN): 281 Cases",
      desc: "Legitimate claims correctly identified as clean. No friction for genuine policyholders.",
      percentage: "75.3% of total test set (281 / 373)",
      status: "Correct Non-Fraud"
    },
    fp: {
      title: "False Positives (FP): 10 Cases (Type I Error)",
      desc: "Clean claims flagged erroneously as fraud. Very low false alarm rate (<3.4%).",
      percentage: "2.7% of total test set (10 / 373)",
      status: "False Alarm"
    },
    fn: {
      title: "False Negatives (FN): 24 Cases (Type II Error)",
      desc: "Fraudulent claims that slipped through without an alert. Controlled leakage.",
      percentage: "6.4% of total test set (24 / 373)",
      status: "Undetected Fraud"
    },
    tp: {
      title: "True Positives (TP): 58 Cases",
      desc: "Fraudulent claims accurately intercepted and flagged for special investigation.",
      percentage: "15.5% of total test set (58 / 373)",
      status: "Successfully Caught Fraud"
    }
  };

  return (
    <div className="metrics-lab-layout">
      {/* Top Section: Comprehensive KPI Summary */}
      <div className="lab-header glass-panel">
        <div>
          <div className="badge badge-indigo">EVALUATION BENCHMARK &bull; PRODUCTION READY</div>
          <h2 className="lab-title">Model Performance & Error Analysis</h2>
          <p className="lab-subtitle">
            Evaluating the Champion Decision Tree Pipeline on a stratified 20% holdout test set (373 samples).
            Target accuracy range was 85–90%; our final pipeline achieved <strong>90.88% accuracy</strong>.
          </p>
        </div>

        <div className="lab-summary-strip">
          <div className="strip-item">
            <span className="strip-label">Test Samples</span>
            <span className="strip-val">373</span>
          </div>
          <div className="strip-item">
            <span className="strip-label">Total Features</span>
            <span className="strip-val">23</span>
          </div>
          <div className="strip-item">
            <span className="strip-label">Target Class</span>
            <span className="strip-val">fraud reported (0/1)</span>
          </div>
        </div>
      </div>

      <div className="lab-grid">
        {/* Left Column: Interactive Confusion Matrix */}
        <div className="cm-card glass-panel">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Interactive Confusion Matrix</h3>
              <p className="card-desc">Click any quadrant to inspect classification impact</p>
            </div>
            <span className="badge badge-indigo">N = 373 Test Claims</span>
          </div>

          <div className="cm-matrix-wrapper">
            <div className="cm-matrix-grid">
              {/* Header Corner */}
              <div className="cm-corner-label">
                <span>Actual \ Pred</span>
              </div>
              <div className="cm-col-header">
                <span>Pred: Clean (0)</span>
              </div>
              <div className="cm-col-header">
                <span>Pred: Fraud (1)</span>
              </div>

              {/* Row 1: Actual Clean */}
              <div className="cm-row-header">
                <span>Actual: Clean (0)</span>
                <span className="row-total">291 total</span>
              </div>
              <div
                className={`cm-cell tn-cell ${selectedCell === 'tn' ? 'selected' : ''}`}
                onClick={() => setSelectedCell('tn')}
              >
                <span className="cm-count">{cm.true_negatives}</span>
                <span className="cm-tag">True Negative (TN)</span>
                <span className="cm-rate">96.6% Specificity</span>
              </div>
              <div
                className={`cm-cell fp-cell ${selectedCell === 'fp' ? 'selected' : ''}`}
                onClick={() => setSelectedCell('fp')}
              >
                <span className="cm-count">{cm.false_positives}</span>
                <span className="cm-tag">False Positive (FP)</span>
                <span className="cm-rate">Type I Error</span>
              </div>

              {/* Row 2: Actual Fraud */}
              <div className="cm-row-header">
                <span>Actual: Fraud (1)</span>
                <span className="row-total">82 total</span>
              </div>
              <div
                className={`cm-cell fn-cell ${selectedCell === 'fn' ? 'selected' : ''}`}
                onClick={() => setSelectedCell('fn')}
              >
                <span className="cm-count">{cm.false_negatives}</span>
                <span className="cm-tag">False Negative (FN)</span>
                <span className="cm-rate">Type II Error</span>
              </div>
              <div
                className={`cm-cell tp-cell ${selectedCell === 'tp' ? 'selected' : ''}`}
                onClick={() => setSelectedCell('tp')}
              >
                <span className="cm-count">{cm.true_positives}</span>
                <span className="cm-tag">True Positive (TP)</span>
                <span className="cm-rate">70.7% Sensitivity</span>
              </div>
            </div>
          </div>

          {/* Cell Details Drawer */}
          <div className="cm-cell-inspector">
            <h4 className="inspector-title">{cellDetails[selectedCell].title}</h4>
            <p className="inspector-desc">{cellDetails[selectedCell].desc}</p>
            <div className="inspector-meta">
              <span className="badge badge-indigo">{cellDetails[selectedCell].status}</span>
              <span className="inspector-pct">{cellDetails[selectedCell].percentage}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Classification Report Table & Formulas */}
        <div className="report-card glass-panel">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Classification Report</h3>
              <p className="card-desc">Per-class precision, recall, and harmonic f1-scores</p>
            </div>
            <span className="badge badge-emerald">Decision Tree Champion</span>
          </div>

          <div className="table-responsive">
            <table className="demure-table">
              <thead>
                <tr>
                  <th>Class Label</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1-Score</th>
                  <th>Support</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="class-label-cell">
                      <span className="status-dot safe" />
                      <strong>Not Fraud (0)</strong>
                    </div>
                  </td>
                  <td><span className="num-pill green">92%</span></td>
                  <td><span className="num-pill green">97%</span></td>
                  <td><span className="num-pill green">94%</span></td>
                  <td>291 claims</td>
                </tr>
                <tr>
                  <td>
                    <div className="class-label-cell">
                      <span className="status-dot alert" />
                      <strong>Fraud (1)</strong>
                    </div>
                  </td>
                  <td><span className="num-pill purple">85.29%</span></td>
                  <td><span className="num-pill purple">70.73%</span></td>
                  <td><span className="num-pill purple">77.33%</span></td>
                  <td>82 claims</td>
                </tr>
                <tr className="table-divider-row">
                  <td><strong>Accuracy</strong></td>
                  <td colSpan="3">
                    <span className="accuracy-highlight">90.88% (339 / 373)</span>
                  </td>
                  <td>373 claims</td>
                </tr>
                <tr>
                  <td>Macro Average</td>
                  <td>89%</td>
                  <td>84%</td>
                  <td>86%</td>
                  <td>373 claims</td>
                </tr>
                <tr>
                  <td>Weighted Average</td>
                  <td>91%</td>
                  <td>91%</td>
                  <td>91%</td>
                  <td>373 claims</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mathematical Formulations */}
          <div className="formulas-box">
            <div className="formula-item">
              <span className="formula-name">Accuracy = (TP + TN) / Total</span>
              <span className="formula-calc">(58 + 281) / 373 = 90.88%</span>
            </div>
            <div className="formula-item">
              <span className="formula-name">Precision = TP / (TP + FP)</span>
              <span className="formula-calc">58 / (58 + 10) = 85.29%</span>
            </div>
            <div className="formula-item">
              <span className="formula-name">Recall = TP / (TP + FN)</span>
              <span className="formula-calc">58 / (58 + 24) = 70.73%</span>
            </div>
            <div className="formula-item">
              <span className="formula-name">F1 = 2 &times; (P &times; R) / (P + R)</span>
              <span className="formula-calc">2 &times; (0.8529 &times; 0.7073) / 1.5602 = 77.33%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison Section */}
      <div className="comparison-section glass-panel">
        <div className="card-header-row">
          <div>
            <h3 className="card-title">Model Architecture Benchmarking</h3>
            <p className="card-desc">Comparative analysis across algorithms evaluated during pipeline selection</p>
          </div>
          <span className="badge badge-indigo">5 Algorithms Compared</span>
        </div>

        <div className="benchmark-cards-grid">
          {m.model_comparison.map((mc, idx) => (
            <div
              key={idx}
              className={`benchmark-card ${mc.model.includes('Decision Tree') ? 'champion' : ''}`}
            >
              <div className="bm-top">
                <span className="bm-title">{mc.model}</span>
                {mc.model.includes('Decision Tree') && (
                  <span className="badge badge-emerald">PROD CHAMPION</span>
                )}
              </div>

              <div className="bm-metrics-row">
                <div className="bm-metric">
                  <span className="bm-lbl">Test Acc</span>
                  <span className="bm-val highlight">{mc.test_acc}%</span>
                </div>
                <div className="bm-metric">
                  <span className="bm-lbl">Precision</span>
                  <span className="bm-val">{mc.precision}%</span>
                </div>
                <div className="bm-metric">
                  <span className="bm-lbl">Recall</span>
                  <span className="bm-val">{mc.recall}%</span>
                </div>
                <div className="bm-metric">
                  <span className="bm-lbl">F1 Score</span>
                  <span className="bm-val">{mc.f1}%</span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="bm-bar-track">
                <div
                  className="bm-bar-fill"
                  style={{
                    width: `${mc.test_acc}%`,
                    background: mc.model.includes('Decision Tree')
                      ? 'linear-gradient(90deg, #6366f1, #10b981)'
                      : 'var(--text-dim)'
                  }}
                />
              </div>

              <span className="bm-status-text">{mc.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
