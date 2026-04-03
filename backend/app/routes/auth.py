from fastapi import APIRouter, Depends
from app.models import VerifyResponse
from app.services.auth import get_bearer_token, verify_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/verify", response_model=VerifyResponse)
def verify(authorization: str = Depends(get_bearer_token)) -> VerifyResponse:
    payload = verify_token(authorization)
    return VerifyResponse(id=payload["sub"], email=payload.get("email"))
