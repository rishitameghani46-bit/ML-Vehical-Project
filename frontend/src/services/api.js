// src/services/api.js
// Client service for connecting to the FastAPI backend with health monitoring and fallbacks

import { DEFAULT_METRICS, SAMPLE_PRESETS } from '../data/mockData';

const API_BASE_URL = "http://127.0.0.1:8000";

export async function checkBackendHealth() {
  const startTime = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    if (response.ok) {
      const data = await response.json();
      return {
        online: true,
        latency,
        data,
        statusText: `Online (${latency}ms)`
      };
    }
    return {
      online: false,
      latency: null,
      statusText: `HTTP ${response.status}`
    };
  } catch (err) {
    return {
      online: false,
      latency: null,
      statusText: "Backend Offline (Demo Mode)"
    };
  }
}

export async function fetchMetrics() {
  try {
    const response = await fetch(`${API_BASE_URL}/metrics`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn("Using fallback evaluation metrics (Backend unavailable):", e);
  }
  return DEFAULT_METRICS;
}

export async function fetchPresets() {
  try {
    const response = await fetch(`${API_BASE_URL}/presets`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn("Using fallback presets:", e);
  }
  return SAMPLE_PRESETS;
}

export async function predictClaim(claimData) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimData)
    });

    if (response.ok) {
      const res = await response.json();
      return {
        success: true,
        data: res,
        source: "backend"
      };
    }
  } catch (e) {
    console.warn("Backend prediction call failed, using client-side decision logic:", e);
  }

  // Client-side fallback matching Decision Tree boundaries
  return simulatePrediction(claimData);
}

function simulatePrediction(data) {
  let score = 0;
  // Non-linear income check
  if (data.annual_income < 40000 || data.annual_income > 200000) score += 30;
  if (data.liab_prct > 60) score += 25;
  if (data.past_num_of_claims >= 2) score += 25;
  if (data.total_claim > 35000) score += 20;
  if (data.injury_claim > 10000) score += 15;
  if (data.witness_present === 0) score += 10;
  if (data.form_defects >= 1) score += 10;
  if (data.safety_rating < 50) score += 15;
  if (data.property_status === "Rent") score += 5;

  const isFraud = score >= 55;
  const fraudProb = isFraud ? Math.min(99.6, Math.max(70.0, score + 10)) : Math.max(0.4, 100 - score - 30);
  const confidence = isFraud ? fraudProb : (100 - fraudProb);

  return {
    success: true,
    data: {
      prediction: isFraud ? 1 : 0,
      result: isFraud ? "Fraud" : "Not Fraud",
      confidence: parseFloat(confidence.toFixed(2)),
      fraud_probability: parseFloat(fraudProb.toFixed(2)),
      non_fraud_probability: parseFloat((100 - fraudProb).toFixed(2)),
      risk_level: fraudProb >= 65 ? "High Risk" : (fraudProb >= 35 ? "Moderate Risk" : "Low Risk")
    },
    source: "local-simulation"
  };
}
