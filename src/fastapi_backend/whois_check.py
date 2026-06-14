import whois as whois_lib
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
router = APIRouter()
class URLRequest(BaseModel):
    url: str    
@router.post("/whois")
async def whois_lookup(req: URLRequest):
    try:
        w = whois_lib.whois(req.url)
        
        # Handle both single date and list of dates
        creation = w.creation_date
        if isinstance(creation, list):
            creation = creation[0]
        
        expiration = w.expiration_date
        if isinstance(expiration, list):
            expiration = expiration[0]

        return {
            "registrar":       w.registrar,
            "creation_date":   creation.strftime("%Y-%m-%d") if creation else None,
            "expiration_date": expiration.strftime("%Y-%m-%d") if expiration else None,
            "country":         w.country
        }
    except Exception as e:
        return {"error": str(e)}