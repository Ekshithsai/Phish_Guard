from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from predict         import router as predict_router
from whois_check     import router as whois_router
from urlhauscheck    import router as urlhaus_router
from virustotalcheck import router as vt_router
from combinedcheck   import router as scan_router
app = FastAPI()
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_methods=["*"],allow_headers=["*"],allow_credentials=True)
app.include_router(predict_router)
app.include_router(whois_router)
app.include_router(urlhaus_router)
app.include_router(vt_router)
app.include_router(scan_router)