import os
import httpx
import base64
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
# Load variables out of your local hidden configuration layout
load_dotenv()
router = APIRouter()
VIRUSTOTAL_KEY = os.getenv("VIRUSTOTAL_KEY")
class URLRequest(BaseModel):
    url: str
@router.post("/virustotal")
async def virustotal_check(req: URLRequest):
    url_id  = base64.urlsafe_b64encode(req.url.encode()).decode().strip("=")
    headers = {"x-apikey": VIRUSTOTAL_KEY}
    async with httpx.AsyncClient() as client:
        res  = await client.get(
            f"https://www.virustotal.com/api/v3/urls/{url_id}",
            headers=headers
        )
        data = res.json()
        # Handling API errors 
        if res.status_code == 401:
            return {"malicious": 0, "suspicious": 0, "clean": 0, "error": "Invalid API key"}
        if res.status_code == 404:
            return {"malicious": 0, "suspicious": 0, "clean": 0, "error": "URL not in VT database"}
        if "data" not in data:
            return {"malicious": 0, "suspicious": 0, "clean": 0, "error": data.get("error", {}).get("message", "Unknown VT error")}
        stats = data["data"]["attributes"]["last_analysis_stats"]
        return {
            "malicious":  stats["malicious"],
            "suspicious": stats["suspicious"],
            "clean":      stats["harmless"]
        }