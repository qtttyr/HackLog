from fastapi import HTTPException, status
from app.services.supabase_client import create_service_client


def ensure_team_access(team_id: str, user_id: str) -> None:
    response = (
        create_service_client()
        .table("members")
        .select("id")
        .eq("team_id", team_id)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    if not response.data:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "User is not a member of this team")


def fetch_decisions(team_id: str) -> list[str]:
    response = create_service_client().table("decisions").select("content").eq("team_id", team_id).execute()
    return [item["content"] for item in response.data or []]


def fetch_tasks(team_id: str) -> list[dict]:
    response = create_service_client().table("tasks").select("title,status").eq("team_id", team_id).execute()
    return response.data or []


def build_pitch_context(team_id: str) -> str:
    decisions = fetch_decisions(team_id)
    if not decisions:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No decisions found for team")
    return "\n".join(f"- {item}" for item in decisions)


def build_readme_context(team_id: str) -> str:
    tasks = fetch_tasks(team_id)
    decisions = fetch_decisions(team_id)
    if not tasks and not decisions:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No team context found")
    lines = [f"- [{task['status']}] {task['title']}" for task in tasks]
    lines += [f"- Decision: {item}" for item in decisions]
    return "\n".join(lines)
