from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_project_or_404, get_user_or_404
from app.db.session import get_db
from app.models.issue import Issue
from app.models.project import Project
from app.schemas.issue import IssueRead
from app.schemas.project import ProjectCreate, ProjectRead

router = APIRouter()


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)) -> Project:
    get_user_or_404(db, payload.created_by)
    project = Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db)) -> list[Project]:
    stmt = select(Project).options(selectinload(Project.creator)).order_by(Project.created_at.desc())
    return list(db.scalars(stmt).all())


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db)) -> Project:
    get_project_or_404(db, project_id)
    stmt = select(Project).where(Project.id == project_id).options(selectinload(Project.creator))
    return db.scalars(stmt).one()


@router.get("/{project_id}/issues", response_model=list[IssueRead])
def list_project_issues(
    project_id: int,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    search: str | None = Query(default=None, min_length=1),
) -> list[Issue]:
    get_project_or_404(db, project_id)
    stmt = (
        select(Issue)
        .where(Issue.project_id == project_id)
        .options(selectinload(Issue.assignee))
        .order_by(Issue.created_at.desc())
        .offset(skip)
        .limit(min(limit, 100))
    )
    if search:
        stmt = stmt.where(Issue.title.ilike(f"%{search}%"))
    return list(db.scalars(stmt).all())
