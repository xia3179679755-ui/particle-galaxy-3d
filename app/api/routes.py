from fastapi import APIRouter
from app.config.settings import ClientPreferences, get_public_config

router = APIRouter(prefix="/api", tags=["configuration"])


@router.get("/config")
def config() -> dict:
    """Return the safe browser configuration; no server-side rendering state is kept."""
    return get_public_config().model_dump()


@router.post("/validate-preferences")
def validate_preferences(preferences: ClientPreferences) -> dict:
    """Validate a settings payload before a client chooses to persist it locally."""
    return {"valid": True, "preferences": preferences.model_dump()}
