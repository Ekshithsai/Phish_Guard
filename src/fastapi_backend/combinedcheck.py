import httpx
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from predict         import predict
from whois_check           import whois_lookup
from urlhauscheck    import urlhaus_check
from virustotalcheck import virustotal_check
router = APIRouter()
class URLRequest(BaseModel):
    url: str
@router.post("/scan")
async def full_scan(req: URLRequest):
    ml = await predict(req)
    wi = await whois_lookup(req)
    uh = await urlhaus_check(req)
    vt = await virustotal_check(req)
    age_flag = False
    if wi.get("creation_date"):
        try:
            created = wi["creation_date"]
            if isinstance(created, list):
                created = created[0]
            age_days = (datetime.now() - created).days
            age_flag = age_days < 90
        except:
            pass
    risk_score = ml["confidence"]
    if uh["is_malicious"]:   risk_score = min(1.0, risk_score + 0.3)
    if vt.get("malicious", 0) > 2:  risk_score = min(1.0, risk_score + 0.2)
    if age_flag:             risk_score = min(1.0, risk_score + 0.15)
    return {
        "url":        req.url,
        "risk_score": round(risk_score, 4),
        "verdict":    "phishing" if risk_score > 0.5 else "safe",
        "ml":         ml,
        "whois":      wi,
        "urlhaus":    uh,
        "virustotal": vt,
        "new_domain": age_flag
    }
