# SENTINEL — Demure Vehicle Fraud AI Intelligence Platform

A state-of-the-art, enterprise-grade Vehicle Insurance Fraud Detection Web Application built with React 19, Vite, and Vanilla CSS, powered by a FastAPI backend and a Scikit-Learn Decision Tree Pipeline.

---

## Project Architecture & Separation

As requested, the **frontend** and **backend** folders are strictly separated as sibling directories:

```
C:\Users\Admin\OneDrive\Documents\SEM 5\MyProject\
├── BACKEND/
│   ├── ml/
│   │   ├── api/
│   │   │   └── main.py              # FastAPI endpoints (/predict, /metrics, /presets)
│   │   ├── model/
│   │   │   └── vehicle_fraud_final_model.pkl
│   │   └── requirements.txt
│   ├── insurance_fraud_data_filtered.csv
│   └── vehical.ipynb
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx           # Demure top navbar, theme toggle & live health badge
    │   │   ├── MetricsBanner.jsx    # Hero Accuracy, Precision, Recall, F1 cards
    │   │   ├── ClaimStudio.jsx      # 23-feature assessment studio with 1-click test presets
    │   │   ├── MetricsLab.jsx       # Interactive Confusion Matrix & Classification Report
    │   │   ├── BatchInspector.jsx   # Batch claims evaluation & CSV exporter
    │   │   ├── ModelArchitecture.jsx# End-to-end pipeline diagram & feature importances
    │   │   └── Footer.jsx
    │   ├── data/mockData.js         # Offline fallbacks & model evaluation parameters
    │   ├── services/api.js          # REST client communicating with FastAPI backend
    │   ├── App.jsx                  # Main orchestrator
    │   └── index.css                # Custom Demure Design System (Light/Dark themes)
    ├── package.json
    └── vite.config.js
```

---

## Model Performance Metrics (Holdout Test Set)

| Metric | Score | Note |
|---|---|---|
| **Accuracy** | **90.88%** | Target range of 85–90% achieved and exceeded (339 / 373 correct) |
| **Precision** | **85.29%** | Very low false positives (Only 10 false alarms out of 291 clean claims) |
| **Recall** | **70.73%** | 58 out of 82 fraudulent claims intercepted |
| **F1-Score** | **77.33%** | Harmonic balance between precision and recall |

### Interactive Confusion Matrix (N = 373 Test Claims)

- **True Negatives (TN)**: 281 (Clean claims correctly cleared)
- **False Positives (FP)**: 10 (Type I error - Clean claims flagged)
- **False Negatives (FN)**: 24 (Type II error - Missed frauds)
- **True Positives (TP)**: 58 (Fraud claims accurately intercepted)

---

## Running the System

### 1. Backend (FastAPI + Uvicorn)
```bash
cd "C:\Users\Admin\OneDrive\Documents\SEM 5\MyProject\BACKEND"
python -m uvicorn ml.api.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation is live at: `http://127.0.0.1:8000/docs`

### 2. Frontend (React + Vite)
```bash
cd "C:\Users\Admin\OneDrive\Documents\SEM 5\MyProject\frontend"
npm run dev
```
Open your browser at: `http://127.0.0.1:5173/`

---

## Demure & Professional Highlights
1. **Understated Luxury Theme**: Clean typography (Outfit & Plus Jakarta Sans), satin glassmorphism, subtle micro-animations, no gaudy colors.
2. **Instant 1-Click Presets**: Test "High-Risk Fraud Claim", "Clean Low-Risk Claim", and "Questionable Soft-Tissue Claim" without manually typing 23 fields.
3. **Dual Light/Dark Mode**: Smooth CSS custom properties transition persisted in local storage.
4. **Live Telemetry**: Real-time heartbeat ping measuring FastAPI backend latency.
