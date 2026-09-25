from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
from pathlib import Path
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "model" / "vehicle_fraud_final_model.pkl"
model = joblib.load(MODEL_PATH)
print("MODEL TYPE:", type(model))

if hasattr(model, "feature_names_in_"):
    print("MODEL FEATURES:")
    print(model.feature_names_in_)

# Official evaluation metrics extracted from the final trained pipeline
EVALUATION_METRICS = {
    "model_name": "Optimized Decision Tree Pipeline",
    "architecture": "Pipeline(ColumnTransformer -> DecisionTreeClassifier)",
    "dataset": "Insurance Fraud Filtered Dataset (1,861 records, 23 features)",
    "test_split": "20% Stratified Test Split (373 evaluation samples)",
    "accuracy": 90.88,
    "precision": 85.29,
    "recall": 70.73,
    "f1_score": 77.33,
    "confusion_matrix": {
        "true_negatives": 281,
        "false_positives": 10,
        "false_negatives": 24,
        "true_positives": 58,
        "total_test_samples": 373,
        "labels": ["Not Fraud (0)", "Fraud (1)"]
    },
    "classification_report": {
        "Not Fraud": {
            "precision": 0.92,
            "recall": 0.97,
            "f1_score": 0.94,
            "support": 291
        },
        "Fraud": {
            "precision": 0.85,
            "recall": 0.71,
            "f1_score": 0.77,
            "support": 82
        },
        "macro_avg": {
            "precision": 0.89,
            "recall": 0.84,
            "f1_score": 0.86,
            "support": 373
        },
        "weighted_avg": {
            "precision": 0.91,
            "recall": 0.91,
            "f1_score": 0.91,
            "support": 373
        }
    },
    "model_comparison": [
        {
            "model": "Logistic Regression",
            "train_acc": 76.5,
            "test_acc": 76.8,
            "precision": 62.0,
            "recall": 18.5,
            "f1": 28.5,
            "status": "Baseline"
        },
        {
            "model": "AdaBoost Classifier",
            "train_acc": 78.4,
            "test_acc": 77.53,
            "precision": 85.92,
            "recall": 10.34,
            "f1": 18.46,
            "status": "High Precision / Low Recall"
        },
        {
            "model": "Gradient Boosting",
            "train_acc": 81.2,
            "test_acc": 78.03,
            "precision": 98.46,
            "recall": 10.85,
            "f1": 19.54,
            "status": "Conservative Ensemble"
        },
        {
            "model": "Random Forest",
            "train_acc": 99.8,
            "test_acc": 77.10,
            "precision": 68.20,
            "recall": 12.70,
            "f1": 21.40,
            "status": "Overfitting Risk"
        },
        {
            "model": "Optimized Decision Tree (Current)",
            "train_acc": 94.2,
            "test_acc": 90.88,
            "precision": 85.29,
            "recall": 70.73,
            "f1": 77.33,
            "status": "Champion Model (Production)"
        }
    ]
}

SAMPLE_PRESETS = [
    {
        "id": "fraud-high-risk",
        "name": "High-Risk Fraud Profile",
        "tag": "High Risk",
        "description": "Multiple past claims, high liability percentage, discrepancy in injury/total claim ratio.",
        "data": {
            "age_of_driver": 38,
            "safety_rating": 42,
            "annual_income": 32000.0,
            "high_education": 0,
            "address_change": 1,
            "property_status": "Rent",
            "claim_date": "2024-03-15",
            "claim_day_of_week": "Friday",
            "accident_site": "Parking Lot",
            "past_num_of_claims": 3,
            "witness_present": 0,
            "liab_prct": 75.0,
            "channel": "Broker",
            "police_report": 0,
            "age_of_vehicle": 8,
            "vehicle_category": "Compact",
            "vehicle_price": 28000.0,
            "total_claim": 42500.0,
            "injury_claim": 22000.0,
            "policy_deductible": 500.0,
            "annual_premium": 1450.0,
            "days_open": 18.0,
            "form_defects": 2
        }
    },
    {
        "id": "clean-low-risk",
        "name": "Clean Low-Risk Profile",
        "tag": "Low Risk",
        "description": "High driver safety score, zero past claims, police report filed, moderate liability.",
        "data": {
            "age_of_driver": 48,
            "safety_rating": 89,
            "annual_income": 95000.0,
            "high_education": 1,
            "address_change": 0,
            "property_status": "Own",
            "claim_date": "2024-04-10",
            "claim_day_of_week": "Tuesday",
            "accident_site": "Highway",
            "past_num_of_claims": 0,
            "witness_present": 1,
            "liab_prct": 15.0,
            "channel": "Online",
            "police_report": 1,
            "age_of_vehicle": 3,
            "vehicle_category": "Medium",
            "vehicle_price": 45000.0,
            "total_claim": 6800.0,
            "injury_claim": 0.0,
            "policy_deductible": 1000.0,
            "annual_premium": 1200.0,
            "days_open": 4.0,
            "form_defects": 0
        }
    },
    {
        "id": "questionable-injury",
        "name": "Questionable Soft-Tissue Claim",
        "tag": "Moderate Risk",
        "description": "High injury claim relative to minor total damage, no witness, local accident site.",
        "data": {
            "age_of_driver": 29,
            "safety_rating": 62,
            "annual_income": 48000.0,
            "high_education": 1,
            "address_change": 1,
            "property_status": "Rent",
            "claim_date": "2024-05-20",
            "claim_day_of_week": "Sunday",
            "accident_site": "Local",
            "past_num_of_claims": 1,
            "witness_present": 0,
            "liab_prct": 50.0,
            "channel": "Phone",
            "police_report": 0,
            "age_of_vehicle": 5,
            "vehicle_category": "Medium",
            "vehicle_price": 22000.0,
            "total_claim": 18500.0,
            "injury_claim": 15000.0,
            "policy_deductible": 500.0,
            "annual_premium": 1380.0,
            "days_open": 22.0,
            "form_defects": 1
        }
    },
    {
        "id": "luxury-vehicle-loss",
        "name": "Luxury Vehicle High-Value Claim",
        "tag": "Elevated Risk",
        "description": "Large vehicle category, recent address change, substantial total claim value.",
        "data": {
            "age_of_driver": 34,
            "safety_rating": 55,
            "annual_income": 88000.0,
            "high_education": 1,
            "address_change": 1,
            "property_status": "Rent",
            "claim_date": "2024-06-02",
            "claim_day_of_week": "Saturday",
            "accident_site": "Highway",
            "past_num_of_claims": 2,
            "witness_present": 0,
            "liab_prct": 60.0,
            "channel": "Broker",
            "police_report": 1,
            "age_of_vehicle": 2,
            "vehicle_category": "Large",
            "vehicle_price": 68000.0,
            "total_claim": 58000.0,
            "injury_claim": 12000.0,
            "policy_deductible": 1500.0,
            "annual_premium": 2100.0,
            "days_open": 31.0,
            "form_defects": 1
        }
    }
]

class VehicleData(BaseModel):
    age_of_driver: int
    safety_rating: int
    annual_income: float
    high_education: int
    address_change: int
    property_status: str
    claim_date: str
    claim_day_of_week: str
    accident_site: str
    past_num_of_claims: int
    witness_present: int
    liab_prct: float
    channel: str
    police_report: int
    age_of_vehicle: int
    vehicle_category: str
    vehicle_price: float
    total_claim: float
    injury_claim: float
    policy_deductible: float
    annual_premium: float
    days_open: float
    form_defects: int

def format_row(data: VehicleData) -> dict:
    return {
        "age_of_driver": data.age_of_driver,
        "safety_rating": data.safety_rating,
        "annual_income": data.annual_income,
        "high_education": data.high_education,
        "address_change": data.address_change,
        "property_status": data.property_status,
        "claim_date": data.claim_date,
        "claim_day_of_week": data.claim_day_of_week,
        "accident_site": data.accident_site,
        "past_num_of_claims": data.past_num_of_claims,
        "witness_present": data.witness_present,
        "liab_prct": data.liab_prct,
        "channel": data.channel,
        "police_report": data.police_report,
        "age_of_vehicle": data.age_of_vehicle,
        "vehicle_category": data.vehicle_category,
        "vehicle_price": data.vehicle_price,
        "total_claim": data.total_claim,
        "injury_claim": data.injury_claim,
        "policy deductible": data.policy_deductible,
        "annual premium": data.annual_premium,
        "days open": data.days_open,
        "form defects": data.form_defects
    }

@app.get("/")
def home():
    return {
        "message": "Vehicle Fraud Detection API is running",
        "model": "Optimized Decision Tree Classifier",
        "status": "online",
        "accuracy": 90.88,
        "precision": 85.29,
        "recall": 70.73,
        "f1_score": 77.33
    }

@app.get("/metrics")
def get_metrics():
    """Returns official accuracy, recall, precision, confusion matrix, and model comparison."""
    return EVALUATION_METRICS

@app.get("/presets")
def get_presets():
    """Returns quick test presets for one-click UI evaluation."""
    return SAMPLE_PRESETS

@app.post("/predict")
def predict(data: VehicleData):
    input_data = pd.DataFrame([format_row(data)])
    prediction = model.predict(input_data)[0]

    # Calculate probabilities if supported
    fraud_prob = 1.0 if prediction == 1 else 0.0
    non_fraud_prob = 0.0 if prediction == 1 else 1.0
    if hasattr(model, "predict_proba"):
        try:
            probas = model.predict_proba(input_data)[0]
            non_fraud_prob = float(probas[0])
            fraud_prob = float(probas[1])
        except Exception as e:
            print("predict_proba error:", e)

    if prediction == 1:
        result = "Fraud"
    else:
        result = "Not Fraud"

    fraud_percentage = round(fraud_prob * 100, 2)
    confidence = round(max(fraud_prob, non_fraud_prob) * 100, 2)

    if fraud_percentage >= 65:
        risk_level = "High Risk"
    elif fraud_percentage >= 35:
        risk_level = "Moderate Risk"
    else:
        risk_level = "Low Risk"

    return {
        "prediction": int(prediction),
        "result": result,
        "confidence": confidence,
        "fraud_probability": fraud_percentage,
        "non_fraud_probability": round(non_fraud_prob * 100, 2),
        "risk_level": risk_level
    }

@app.post("/batch-predict")
def batch_predict(claims: list[VehicleData]):
    rows = [format_row(c) for c in claims]
    input_df = pd.DataFrame(rows)
    predictions = model.predict(input_df)

    probas = None
    if hasattr(model, "predict_proba"):
        try:
            probas = model.predict_proba(input_df)
        except Exception:
            pass

    results = []
    for idx, pred in enumerate(predictions):
        p_val = int(pred)
        if probas is not None:
            f_prob = float(probas[idx][1])
            nf_prob = float(probas[idx][0])
        else:
            f_prob = 1.0 if p_val == 1 else 0.0
            nf_prob = 0.0 if p_val == 1 else 1.0

        f_perc = round(f_prob * 100, 2)
        results.append({
            "index": idx,
            "prediction": p_val,
            "result": "Fraud" if p_val == 1 else "Not Fraud",
            "fraud_probability": f_perc,
            "confidence": round(max(f_prob, nf_prob) * 100, 2),
            "risk_level": "High Risk" if f_perc >= 65 else ("Moderate Risk" if f_perc >= 35 else "Low Risk")
        })

    return {
        "total": len(results),
        "fraud_count": sum(1 for r in results if r["prediction"] == 1),
        "not_fraud_count": sum(1 for r in results if r["prediction"] == 0),
        "results": results
    }