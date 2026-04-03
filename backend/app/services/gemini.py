import google.generativeai as genai
from app.config import get_settings


PROMPTS = {
    "pitch": "Create a concise hackathon pitch from these team decisions.",
    "readme": "Create a polished README from these tasks and decisions.",
}


def generate_copy(kind: str, context: str) -> str:
    settings = get_settings()
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(settings.gemini_model)
    prompt = f"{PROMPTS[kind]}\n\nContext:\n{context}"
    response = model.generate_content(prompt)
    return (response.text or "").strip()
