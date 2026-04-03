from pydantic import BaseModel


class VerifyResponse(BaseModel):
    id: str
    email: str | None = None


class GenerateRequest(BaseModel):
    team_id: str


class GenerateResponse(BaseModel):
    content: str
