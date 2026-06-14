import httpx
from fastapi import APIRouter
from pydantic import BaseModel
router      = APIRouter()
URLHAUS_API = "https://urlhaus-api.abuse.ch/v1/url/"
class URLRequest(BaseModel):
    url: str
@router.post("/urlhaus")
async def urlhaus_check(req: URLRequest):
    async with httpx.AsyncClient() as client:
        res  = await client.post(URLHAUS_API, data={"url": req.url})
        data = res.json()
        return {
            "is_malicious": data.get("query_status") == "is_listed",
            "threat":       data.get("threat", "none"),
            "tags":         data.get("tags", [])
        }