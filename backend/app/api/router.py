from fastapi import APIRouter

from app.api.routes import comments, dashboard, issues, projects, users

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(issues.router, prefix="/issues", tags=["issues"])
api_router.include_router(comments.router, tags=["comments"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
