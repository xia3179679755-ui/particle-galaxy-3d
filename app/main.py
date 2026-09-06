from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.api.routes import router

ROOT = Path(__file__).resolve().parent.parent
app = FastAPI(title="Particle Galaxy", version="1.0.0", docs_url="/api/docs")
templates = Jinja2Templates(directory=str(ROOT / "templates"))
app.mount("/static", StaticFiles(directory=str(ROOT / "static")), name="static")
app.include_router(router)


@app.get("/", response_class=HTMLResponse, include_in_schema=False)
def index(request: Request):
    return templates.TemplateResponse(request, "index.html", {"app_title": "粒子星系"})


@app.get("/health", include_in_schema=False)
def health() -> dict:
    return {"status": "ok"}
