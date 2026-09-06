from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_home_page_is_served():
    response = client.get("/")
    assert response.status_code == 200
    assert "粒子星系" in response.text


def test_static_stylesheet_is_served():
    response = client.get("/static/css/main.css")
    assert response.status_code == 200
    assert "--bg" in response.text


def test_bundled_threejs_is_served():
    response = client.get("/static/js/vendor/three.module.min.js")
    assert response.status_code == 200
    assert len(response.content) > 500_000


def test_public_config():
    response = client.get("/api/config")
    assert response.status_code == 200
    assert "solar" in response.json()["supported_scenes"]


def test_invalid_preferences_are_rejected():
    response = client.post("/api/validate-preferences", json={"quality": "ultra"})
    assert response.status_code == 422


def test_valid_preferences_are_accepted():
    response = client.post("/api/validate-preferences", json={"scene": "nebula", "particle_size": 1.2})
    assert response.status_code == 200
