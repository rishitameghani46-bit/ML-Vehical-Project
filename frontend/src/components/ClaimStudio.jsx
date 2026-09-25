// src/components/ClaimStudio.jsx
import React, { useState } from 'react';
import { 
  AlertTriangle, ShieldCheck, RefreshCw, Send, Sparkles, 
  HelpCircle, Download, FileText, ChevronRight, Check, CheckSquare, Square
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_PRESETS, INITIAL_CLAIM_FORM } from '../data/mockData';
import { predictClaim } from '../services/api';

// Custom Demure Checkbox Component with proper width, height, descent and tactile feedback
function DemureCheckbox({ id, checked, onChange, title, description, badge }) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      className={`demure-checkbox-tile ${checked ? 'is-checked' : ''}`}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onChange(!checked);
        }
      }}
    >
      <div className="checkbox-visual-box">
        <div className={`checkbox-custom-square ${checked ? 'checked' : ''}`}>
          {checked && <Check size={14} className="check-svg" strokeWidth={3} />}
        </div>
      </div>
      <div className="checkbox-text-content">
        <div className="checkbox-title-row">
          <span className="checkbox-title">{title}</span>
          {badge && <span className={`badge ${checked ? 'badge-indigo' : 'badge-subtle'}`}>{badge}</span>}
        </div>
        <p className="checkbox-description">{description}</p>
      </div>
    </div>
  );
}

export default function ClaimStudio({ onEvaluationRequested }) {
  const [formData, setFormData] = useState(INITIAL_CLAIM_FORM);
  const [activePreset, setActivePreset] = useState('clean-low-risk');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    prediction: 0,
    result: "Not Fraud",
    confidence: 99.6,
    fraud_probability: 0.4,
    non_fraud_probability: 99.6,
    risk_level: "Low Risk",
    source: "initial"
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePresetSelect = (preset) => {
    setActivePreset(preset.id);
    setFormData(preset.data);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#6366f1', '#38bdf8', '#a855f7']
      });
    } catch (e) {
      // ignore if canvas not supported
    }
  };

  const handleRunAssessment = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await predictClaim(formData);
      if (res && res.data) {
        setResult({
          ...res.data,
          source: res.source
        });
        if (res.data.prediction === 0 || res.data.result === 'Not Fraud') {
          triggerCelebration();
        }
      }
    } catch (err) {
      console.error("Assessment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      claim_inputs: formData,
      model_assessment: result,
      champion_model: "Optimized Decision Tree (Accuracy: 90.88%, Precision: 85.29%, Recall: 70.73%)"
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claim_assessment_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isFraud = result.result === "Fraud" || result.prediction === 1;

  return (
    <div className="studio-layout">
      {/* Quick Test Presets Bar */}
      <div className="preset-bar glass-panel">
        <div className="preset-bar-header">
          <Sparkles size={16} className="preset-sparkle" />
          <span className="preset-title">DEMURE TEST PRESETS:</span>
        </div>
        <div className="preset-buttons">
          {SAMPLE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`preset-btn ${activePreset === p.id ? 'active' : ''}`}
              onClick={() => handlePresetSelect(p)}
            >
              <span className={`preset-dot ${p.badgeType}`} />
              <span className="preset-btn-name">{p.name}</span>
              <span className={`badge badge-${p.badgeType}`}>{p.tag}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="studio-grid">
        {/* Form Inputs Column */}
        <form className="form-column" onSubmit={handleRunAssessment}>
          {/* Section 1: Driver & Insured Profile */}
          <div className="form-section glass-panel">
            <div className="section-header">
              <span className="section-number">01</span>
              <div>
                <h3 className="section-title">Driver & Policyholder Profile</h3>
                <p className="section-desc">Demographics, socio-economic baseline, and historical safety metrics</p>
              </div>
            </div>

            <div className="inputs-grid">
              <div className="form-group">
                <label className="form-label">
                  <span>Age of Driver</span>
                  <span className="val-preview">{formData.age_of_driver} yrs</span>
                </label>
                <input
                  type="number"
                  min="16"
                  max="100"
                  className="form-control"
                  value={formData.age_of_driver}
                  onChange={(e) => handleInputChange('age_of_driver', parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Annual Income ($)</span>
                  <span className="val-preview">${Number(formData.annual_income).toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  className="form-control"
                  value={formData.annual_income}
                  onChange={(e) => handleInputChange('annual_income', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Safety Rating</span>
                  <span className="val-preview">{formData.safety_rating} / 100</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  className="form-range"
                  value={formData.safety_rating}
                  onChange={(e) => handleInputChange('safety_rating', parseInt(e.target.value) || 50)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Property Ownership</label>
                <select
                  className="form-control"
                  value={formData.property_status}
                  onChange={(e) => handleInputChange('property_status', e.target.value)}
                >
                  <option value="Own">Owns Home / Property</option>
                  <option value="Rent">Rents Property</option>
                </select>
              </div>
            </div>

            {/* Checkbox Group 1: Policyholder Attributes with proper width, height and descent */}
            <div className="checkboxes-section">
              <span className="checkbox-section-label">Policyholder Verification Checkboxes:</span>
              <div className="checkboxes-grid">
                <DemureCheckbox
                  id="high_education"
                  checked={formData.high_education === 1}
                  onChange={(val) => handleInputChange('high_education', val ? 1 : 0)}
                  title="Higher Education Degree"
                  description="Policyholder holds an accredited college or university degree"
                  badge={formData.high_education === 1 ? "Verified" : "None"}
                />

                <DemureCheckbox
                  id="address_change"
                  checked={formData.address_change === 1}
                  onChange={(val) => handleInputChange('address_change', val ? 1 : 0)}
                  title="Recent Relocation"
                  description="Residential address was changed within the past 12 months"
                  badge={formData.address_change === 1 ? "Relocated" : "Established"}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Incident & Environmental Context */}
          <div className="form-section glass-panel">
            <div className="section-header">
              <span className="section-number">02</span>
              <div>
                <h3 className="section-title">Incident & Environmental Context</h3>
                <p className="section-desc">Accident location, reporting authority, and channel of filing</p>
              </div>
            </div>

            <div className="inputs-grid">
              <div className="form-group">
                <label className="form-label">Claim Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.claim_date}
                  onChange={(e) => handleInputChange('claim_date', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Day of Week</label>
                <select
                  className="form-control"
                  value={formData.claim_day_of_week}
                  onChange={(e) => handleInputChange('claim_day_of_week', e.target.value)}
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Accident Site</label>
                <select
                  className="form-control"
                  value={formData.accident_site}
                  onChange={(e) => handleInputChange('accident_site', e.target.value)}
                >
                  <option value="Highway">Highway</option>
                  <option value="Local">Local City Road</option>
                  <option value="Parking Lot">Parking Lot</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Filing Channel</label>
                <select
                  className="form-control"
                  value={formData.channel}
                  onChange={(e) => handleInputChange('channel', e.target.value)}
                >
                  <option value="Online">Online Portal</option>
                  <option value="Phone">Phone Agent</option>
                  <option value="Broker">Third-Party Broker</option>
                </select>
              </div>
            </div>

            {/* Checkbox Group 2: Incident Corroboration */}
            <div className="checkboxes-section">
              <span className="checkbox-section-label">Incident Corroboration Checkboxes:</span>
              <div className="checkboxes-grid">
                <DemureCheckbox
                  id="witness_present"
                  checked={formData.witness_present === 1}
                  onChange={(val) => handleInputChange('witness_present', val ? 1 : 0)}
                  title="Independent Witness Present"
                  description="One or more third-party witnesses observed and documented the incident"
                  badge={formData.witness_present === 1 ? "Present" : "No Witness"}
                />

                <DemureCheckbox
                  id="police_report"
                  checked={formData.police_report === 1}
                  onChange={(val) => handleInputChange('police_report', val ? 1 : 0)}
                  title="Official Police Report Filed"
                  description="Formal law enforcement report logged at scene and available for review"
                  badge={formData.police_report === 1 ? "Filed" : "Not Filed"}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Vehicle Particulars */}
          <div className="form-section glass-panel">
            <div className="section-header">
              <span className="section-number">03</span>
              <div>
                <h3 className="section-title">Vehicle Particulars</h3>
                <p className="section-desc">Vehicle specs, estimated valuation, and fault liability percentage</p>
              </div>
            </div>

            <div className="inputs-grid">
              <div className="form-group">
                <label className="form-label">
                  <span>Age of Vehicle</span>
                  <span className="val-preview">{formData.age_of_vehicle} yrs</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="35"
                  className="form-control"
                  value={formData.age_of_vehicle}
                  onChange={(e) => handleInputChange('age_of_vehicle', parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Category</label>
                <select
                  className="form-control"
                  value={formData.vehicle_category}
                  onChange={(e) => handleInputChange('vehicle_category', e.target.value)}
                >
                  <option value="Compact">Compact Sedan / Hatchback</option>
                  <option value="Medium">Medium Crossover / Sedan</option>
                  <option value="Large">Large SUV / Truck</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Vehicle Price ($)</span>
                  <span className="val-preview">${Number(formData.vehicle_price).toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  className="form-control"
                  value={formData.vehicle_price}
                  onChange={(e) => handleInputChange('vehicle_price', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Liability Percentage</span>
                  <span className="val-preview">{formData.liab_prct}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="form-range"
                  value={formData.liab_prct}
                  onChange={(e) => handleInputChange('liab_prct', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Claim Financials & Processing */}
          <div className="form-section glass-panel">
            <div className="section-header">
              <span className="section-number">04</span>
              <div>
                <h3 className="section-title">Claim Financials & Processing</h3>
                <p className="section-desc">Monetary amounts, deductible terms, claims history, and defect flags</p>
              </div>
            </div>

            <div className="inputs-grid">
              <div className="form-group">
                <label className="form-label">
                  <span>Past Number of Claims</span>
                  <span className="val-preview">{formData.past_num_of_claims} prior</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="form-control"
                  value={formData.past_num_of_claims}
                  onChange={(e) => handleInputChange('past_num_of_claims', parseInt(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Total Claim Amount ($)</span>
                  <span className="val-preview">${Number(formData.total_claim).toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  className="form-control"
                  value={formData.total_claim}
                  onChange={(e) => handleInputChange('total_claim', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Injury Claim Amount ($)</span>
                  <span className="val-preview">${Number(formData.injury_claim).toLocaleString()}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  className="form-control"
                  value={formData.injury_claim}
                  onChange={(e) => handleInputChange('injury_claim', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Policy Deductible ($)</label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  className="form-control"
                  value={formData.policy_deductible}
                  onChange={(e) => handleInputChange('policy_deductible', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Policy Premium ($)</label>
                <input
                  type="number"
                  min="200"
                  step="50"
                  className="form-control"
                  value={formData.annual_premium}
                  onChange={(e) => handleInputChange('annual_premium', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Days Open</span>
                  <span className="val-preview">{formData.days_open} days</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  className="form-control"
                  value={formData.days_open}
                  onChange={(e) => handleInputChange('days_open', parseFloat(e.target.value) || 1)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Filing Form Defects</label>
                <select
                  className="form-control"
                  value={formData.form_defects}
                  onChange={(e) => handleInputChange('form_defects', parseInt(e.target.value))}
                >
                  <option value={0}>0 (Clean Submission)</option>
                  <option value={1}>1 Defect (Minor missing document)</option>
                  <option value={2}>2+ Defects (Multiple inconsistencies)</option>
                </select>
              </div>
            </div>

            <div className="form-actions-bar">
              <button
                type="submit"
                className="btn-primary evaluate-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="spin-icon" size={18} />
                    <span>Analyzing Pipeline Features...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Assess Claim Risk</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Assessment Verdict & Analytics Column */}
        <div className="verdict-column">
          <div className={`verdict-card glass-panel ${isFraud ? 'verdict-fraud' : 'verdict-clean'}`}>
            <div className="verdict-top-bar">
              <span className="verdict-model-tag">CHAMPION MODEL EVALUATION</span>
              <span className={`badge ${isFraud ? 'badge-rose' : 'badge-emerald'}`}>
                {result.risk_level || (isFraud ? "High Risk" : "Low Risk")}
              </span>
            </div>

            <div className="verdict-hero">
              <div className="verdict-icon-container">
                {isFraud ? (
                  <AlertTriangle className="verdict-icon icon-rose" size={48} />
                ) : (
                  <ShieldCheck className="verdict-icon icon-emerald" size={48} />
                )}
              </div>

              <div className="verdict-headings">
                <h2 className="verdict-title">
                  {isFraud ? "FRAUD DETECTED" : "CLEAN CLAIM"}
                </h2>
                <p className="verdict-subtitle">
                  {isFraud
                    ? "Statistically anomalous pattern detected by decision boundaries."
                    : "Consistent with legitimate vehicle insurance claim characteristics."}
                </p>
              </div>
            </div>

            {/* Risk Probability Gauge Meter */}
            <div className="gauge-section">
              <div className="gauge-header">
                <span className="gauge-label">Fraud Probability Index</span>
                <span className="gauge-value">{result.fraud_probability}%</span>
              </div>
              <div className="gauge-track">
                <div
                  className="gauge-fill"
                  style={{
                    width: `${Math.max(4, Math.min(100, result.fraud_probability))}%`,
                    background: isFraud
                      ? 'linear-gradient(90deg, #f59e0b 0%, #f43f5e 100%)'
                      : 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)'
                  }}
                />
              </div>
              <div className="gauge-markers">
                <span>0% Safe</span>
                <span>35% Moderate</span>
                <span>65% High Risk</span>
                <span>100% Critical</span>
              </div>
            </div>

            {/* Key Metrics Breakdown */}
            <div className="verdict-stats-grid">
              <div className="stat-tile">
                <span className="stat-tile-label">Confidence</span>
                <span className="stat-tile-val">{result.confidence}%</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile-label">Model Accuracy</span>
                <span className="stat-tile-val">90.88%</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile-label">Precision</span>
                <span className="stat-tile-val">85.29%</span>
              </div>
              <div className="stat-tile">
                <span className="stat-tile-label">Recall</span>
                <span className="stat-tile-val">70.73%</span>
              </div>
            </div>

            {/* Risk Factors / Behavioral Indicators */}
            <div className="risk-factors-section">
              <h4 className="factors-title">Primary Pattern Determinants</h4>
              <ul className="factors-list">
                {formData.past_num_of_claims > 1 && (
                  <li className="factor-item alert">
                    <AlertTriangle size={14} />
                    <span>Prior claim history: {formData.past_num_of_claims} previous filings on record.</span>
                  </li>
                )}
                {formData.liab_prct > 50 && (
                  <li className="factor-item alert">
                    <AlertTriangle size={14} />
                    <span>High admitted liability ({formData.liab_prct}%) at incident scene.</span>
                  </li>
                )}
                {formData.injury_claim > 10000 && (
                  <li className="factor-item alert">
                    <AlertTriangle size={14} />
                    <span>Disproportionate bodily injury compensation (${Number(formData.injury_claim).toLocaleString()}).</span>
                  </li>
                )}
                {formData.witness_present === 0 && (
                  <li className="factor-item info">
                    <ChevronRight size={14} />
                    <span>Uncorroborated single-party incident without independent witnesses.</span>
                  </li>
                )}
                {formData.police_report === 1 && (
                  <li className="factor-item safe">
                    <Check size={14} />
                    <span>Official police department incident report verified on file.</span>
                  </li>
                )}
                {formData.safety_rating >= 80 && (
                  <li className="factor-item safe">
                    <Check size={14} />
                    <span>Favorable driver telematics safety score ({formData.safety_rating}/100).</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="verdict-footer-actions">
              <button
                type="button"
                className="btn-secondary export-btn"
                onClick={handleExportJSON}
              >
                <Download size={15} />
                <span>Export Assessment JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
