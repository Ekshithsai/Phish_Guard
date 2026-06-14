import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import joblib
import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel
from features import extract_feat
router = APIRouter()
#absolute path so it works regardless of where uvicorn is run from
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "phishing_model.pkl")
print(MODEL_PATH)   #for debugging
model = joblib.load(MODEL_PATH)
class URLRequest(BaseModel):
    url: str
@router.post("/predict")
async def predict(req: URLRequest):
    feat = extract_feat(req.url, lbl=None)
    feat.pop("url"); feat.pop("dom"); feat.pop("label");feat.pop("has_ip")
    prob = model.predict_proba(pd.DataFrame([feat]))[0][1]
    return {
        "url":        req.url,
        "label":      "phishing" if prob > 0.59 else "safe",
        "confidence": round(float(prob), 4)
    }