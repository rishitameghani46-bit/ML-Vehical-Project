// src/components/ModelArchitecture.jsx
import React from 'react';
import { Database, Filter, Cpu, ArrowRight, CheckCircle2, GitBranch, Sparkles, Sliders, ShieldAlert } from 'lucide-react';
import { DEFAULT_METRICS } from '../data/mockData';

export default function ModelArchitecture() {
  const topFeatures = DEFAULT_METRICS.top_features;

  return (
    <div className="architecture-layout">
      {/* Top Banner */}
      <div className="arch-header glass-panel">
        <div className="badge badge-indigo">SCIKIT-LEARN PIPELINE ARCHITECTURE</div>
        <h2 className="arch-title">Vehicle Fraud Detection Pipeline</h2>
        <p className="arch-desc">
          End-to-end reproducible machine learning pipeline saved in <code>vehicle_fraud_final_model.pkl</code>.
          Zero data leakage: preprocessing transformations fit strictly on the training partition.
        </p>
      </div>

      {/* Visual Flow Stages */}
      <div className="pipeline-flow-grid">
        {/* Stage 1 */}
        <div className="flow-step glass-panel">
          <div className="step-num">STAGE 01</div>
          <div className="step-icon-wrap">
            <Database size={24} />
          </div>
          <h4 className="step-title">Raw Input Features</h4>
          <p className="step-desc">
            23 heterogeneous attributes extracted from claimant demographics, incident telematics, and insurance billing.
          </p>
          <div className="step-tags">
            <span className="step-tag">17 Numeric Features</span>
            <span className="step-tag">6 Categorical Features</span>
          </div>
        </div>

        <div className="flow-arrow">
          <ArrowRight size={20} />
        </div>

        {/* Stage 2 */}
        <div className="flow-step glass-panel">
          <div className="step-num">STAGE 02</div>
          <div className="step-icon-wrap">
            <Filter size={24} />
          </div>
          <h4 className="step-title">ColumnTransformer</h4>
          <p className="step-desc">
            Automated preprocessing: Median Imputation for continuous values; Most Frequent + OneHotEncoder for categoricals.
          </p>
          <div className="step-tags">
            <span className="step-tag">SimpleImputer(median)</span>
            <span className="step-tag">OneHotEncoder(ignore)</span>
          </div>
        </div>

        <div className="flow-arrow">
          <ArrowRight size={20} />
        </div>

        {/* Stage 3 */}
        <div className="flow-step glass-panel highlight-step">
          <div className="step-num">STAGE 03</div>
          <div className="step-icon-wrap">
            <Cpu size={24} />
          </div>
          <h4 className="step-title">DecisionTreeClassifier</h4>
          <p className="step-desc">
            Tuned depth limiter to capture non-linear income & liability distributions while preventing leaf overfitting.
          </p>
          <div className="step-tags">
            <span className="step-tag">max_depth = 8</span>
            <span className="step-tag">min_samples_leaf = 5</span>
            <span className="step-tag">random_state = 42</span>
          </div>
        </div>

        <div className="flow-arrow">
          <ArrowRight size={20} />
        </div>

        {/* Stage 4 */}
        <div className="flow-step glass-panel">
          <div className="step-num">STAGE 04</div>
          <div className="step-icon-wrap">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="step-title">Inference & Probabilities</h4>
          <p className="step-desc">
            Dual output: Binary class verdict (0 = Clean, 1 = Fraud) and confidence probabilities for fraud scoring.
          </p>
          <div className="step-tags">
            <span className="step-tag">predict()</span>
            <span className="step-tag">predict_proba()</span>
          </div>
        </div>
      </div>

      {/* Feature Importance & Model Decision Mechanics */}
      <div className="arch-details-grid">
        {/* Feature Importance Ranking */}
        <div className="feature-importance-card glass-panel">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Feature Importance Determinants</h3>
              <p className="card-desc">Gini impurity reduction across tree decision nodes</p>
            </div>
            <span className="badge badge-indigo">Gini Index</span>
          </div>

          <div className="feature-bars-list">
            {topFeatures.map((f, i) => (
              <div key={i} className="feature-bar-item">
                <div className="f-bar-header">
                  <span className="f-name"><code>{f.name}</code></span>
                  <span className="f-pct">{(f.importance * 100).toFixed(0)}%</span>
                </div>
                <div className="f-track">
                  <div
                    className="f-fill"
                    style={{ width: `${(f.importance / 0.38) * 100}%` }}
                  />
                </div>
                <span className="f-desc">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Tree Mechanics & Regularization Constraints (Replaces FastAPI Contract) */}
        <div className="tree-mechanics-card glass-panel">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Tree Decision Rules & Hyperparameters</h3>
              <p className="card-desc">Tuned regularization constraints delivering 90.88% accuracy</p>
            </div>
            <span className="badge badge-emerald">Depth-Constrained</span>
          </div>

          <div className="mechanics-content">
            <div className="hyperparams-grid">
              <div className="param-tile">
                <span className="param-label">Max Depth</span>
                <span className="param-value">8 Levels</span>
                <span className="param-desc">Prevents memorizing noise</span>
              </div>
              <div className="param-tile">
                <span className="param-label">Min Samples Leaf</span>
                <span className="param-value">5 Samples</span>
                <span className="param-desc">Statistical significance</span>
              </div>
              <div className="param-tile">
                <span className="param-label">Criterion</span>
                <span className="param-value">Gini Impurity</span>
                <span className="param-desc">Optimal split purity</span>
              </div>
              <div className="param-tile">
                <span className="param-label">Stratified Split</span>
                <span className="param-value">80% / 20%</span>
                <span className="param-desc">Class ratio balance</span>
              </div>
            </div>

            <div className="tree-rules-container">
              <h4 className="rules-heading">
                <GitBranch size={15} />
                <span>Primary Decision Boundaries Identified:</span>
              </h4>

              <div className="rule-card rule-fraud">
                <div className="rule-badge-row">
                  <span className="badge badge-rose">High Risk Path (96.4% Fraud)</span>
                  <span className="rule-leaf-id">Node #14</span>
                </div>
                <p className="rule-logic">
                  IF <code>annual_income &lt; $38,000</code> AND <code>past_num_of_claims &ge; 2</code> AND <code>liab_prct &gt; 55%</code>
                </p>
              </div>

              <div className="rule-card rule-clean">
                <div className="rule-badge-row">
                  <span className="badge badge-emerald">Clean Path (98.9% Legitimate)</span>
                  <span className="rule-leaf-id">Node #03</span>
                </div>
                <p className="rule-logic">
                  IF <code>safety_rating &ge; 75</code> AND <code>past_num_of_claims == 0</code> AND <code>police_report == 1</code>
                </p>
              </div>

              <div className="rule-card rule-moderate">
                <div className="rule-badge-row">
                  <span className="badge badge-amber">Moderate Risk Path (68.2% Probability)</span>
                  <span className="rule-leaf-id">Node #27</span>
                </div>
                <p className="rule-logic">
                  IF <code>injury_claim &gt; $12,000</code> AND <code>witness_present == 0</code> AND <code>accident_site == 'Local'</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
