from fastapi import APIRouter, Depends
from app.models import GenerateRequest, GenerateResponse
from app.services.auth import get_bearer_token, verify_token
from app.services.gemini import generate_copy
from app.services.team_context import build_pitch_context, build_readme_context, ensure_team_access

router = APIRouter(prefix="/api", tags=["generate"])


def require_user(token: str = Depends(get_bearer_token)) -> dict:
    return verify_token(token)


@router.post("/pitch/generate", response_model=GenerateResponse)
def generate_pitch(body: GenerateRequest, _: dict = Depends(require_user)) -> GenerateResponse:
    ensure_team_access(body.team_id, _["sub"])
    content = generate_copy("pitch", build_pitch_context(body.team_id))
    return GenerateResponse(content=content)


@router.post("/readme/generate", response_model=GenerateResponse)
def generate_readme(body: GenerateRequest, _: dict = Depends(require_user)) -> GenerateResponse:
    ensure_team_access(body.team_id, _["sub"])
    content = generate_copy("readme", build_readme_context(body.team_id))
    return GenerateResponse(content=content)
