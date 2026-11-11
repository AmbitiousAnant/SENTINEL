from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import scorer, dashboard, alerts, voice, data

app = FastAPI(title="SENTINEL API · ZERO-EGRESS VERIFIED · BUILD FOR BHARAT 2026")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scorer.router, prefix="/api/scorer", tags=["scorer"])
app.include_router(data.router, prefix="/api/data", tags=["data"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
