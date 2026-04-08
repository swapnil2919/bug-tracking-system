from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.issue import Issue, IssueStatus
from app.models.project import Project
from app.schemas.dashboard import DashboardStats

router = APIRouter()


@router.get("", response_model=DashboardStats)
def get_dashboard(db: Session = Depends(get_db)) -> DashboardStats:
    total_projects = db.scalar(select(func.count(Project.id))) or 0
    total_issues = db.scalar(select(func.count(Issue.id))) or 0
    open_issues = db.scalar(select(func.count(Issue.id)).where(Issue.status == IssueStatus.OPEN)) or 0
    in_progress_issues = db.scalar(select(func.count(Issue.id)).where(Issue.status == IssueStatus.IN_PROGRESS)) or 0
    done_issues = db.scalar(select(func.count(Issue.id)).where(Issue.status == IssueStatus.DONE)) or 0
    return DashboardStats(
        total_projects=total_projects,
        total_issues=total_issues,
        open_issues=open_issues,
        in_progress_issues=in_progress_issues,
        done_issues=done_issues,
    )
