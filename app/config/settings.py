from functools import lru_cache
from pydantic import BaseModel, Field


class PublicConfig(BaseModel):
    app_name: str = "粒子星系"
    version: str = "1.0.0"
    default_scene: str = "galaxy"
    particle_limits: dict[str, int] = {"low": 12000, "medium": 40000, "high": 90000}
    supported_scenes: list[str] = ["galaxy", "gravity", "nebula", "blackhole", "solar"]


class ClientPreferences(BaseModel):
    scene: str = Field("galaxy", pattern="^(galaxy|gravity|nebula|blackhole|solar)$")
    quality: str = Field("auto", pattern="^(auto|low|medium|high)$")
    particle_size: float = Field(1.0, ge=0.45, le=3.0)
    particle_speed: float = Field(1.0, ge=0.0, le=3.0)
    gravity: float = Field(1.0, ge=0.0, le=3.0)
    radius: float = Field(7.0, ge=1.0, le=18.0)
    theme: str = Field("violet", pattern="^(violet|gold|ice|red|mono)$")


@lru_cache
def get_public_config() -> PublicConfig:
    return PublicConfig()
