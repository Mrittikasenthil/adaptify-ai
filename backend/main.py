import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import init_db
from seed_data import seed_initial_data
from config import GEMINI_API_KEY, DEFAULT_GEMINI_MODEL
from routers.auth_router import router as auth_router
from routers.brand_router import router as brand_router
from routers.content_router import router as content_router
from routers.project_router import router as project_router
from routers.stats_router import router as stats_router
from routers.tutor_router import router as tutor_router
from routers.wispr_router import router as wispr_router

app = FastAPI(
    title="ADAPTIFY AI API",
    description="Adaptive Exam-Prep Tutor & Personal Learning Platform with Wispr Flow Voice Integration",
    version="2.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(tutor_router)
app.include_router(wispr_router)
app.include_router(auth_router)
app.include_router(brand_router)
app.include_router(content_router)
app.include_router(project_router)
app.include_router(stats_router)

@app.on_event("startup")
def on_startup():
    init_db()
    seed_initial_data()
    print("[ADAPTIFY AI] Database initialized with study materials and adaptive learner profiles.")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "ADAPTIFY AI",
        "tagline": "Learn Faster. Understand Better. Achieve More.",
        "gemini_configured": bool(GEMINI_API_KEY),
        "gemini_model": DEFAULT_GEMINI_MODEL,
        "mode": "Live Gemini API" if GEMINI_API_KEY else "Adaptify Contextual AI Engine (Local / Demo Mode)"
    }

# Serve Frontend static assets if built
DIST_DIR = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        file_path = DIST_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(DIST_DIR / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

