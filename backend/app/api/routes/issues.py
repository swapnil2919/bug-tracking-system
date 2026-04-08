from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_issue_or_404, get_project_or_404, get_user_or_404
from app.db.session import get_db
from app.models.issue import Issue
from app.schemas.issue import IssueAssign, IssueCreate, IssuePriorityUpdate, IssueRead, IssueStatusUpdate

router = APIRouter()


@router.post("", response_model=IssueRead, status_code=status.HTTP_201_CREATED)
def create_issue(payload: IssueCreate, db: Session = Depends(get_db)) -> Issue:
    get_project_or_404(db, payload.project_id)
    if payload.assigned_to is not None:
        get_user_or_404(db, payload.assigned_to)
    issue = Issue(**payload.model_dump())
    db.add(issue)
    db.commit()
    db.refresh(issue)
    return issue


@router.get("/{issue_id}", response_model=IssueRead)
def get_issue(issue_id: int, db: Session = Depends(get_db)) -> Issue:
    get_issue_or_404(db, issue_id)
    stmt = select(Issue).where(Issue.id == issue_id).options(selectinload(Issue.assignee))
    return db.scalars(stmt).one()


@router.put("/{issue_id}/status", response_model=IssueRead)
def update_issue_status(issue_id: int, payload: IssueStatusUpdate, db: Session = Depends(get_db)) -> Issue:
    issue = get_issue_or_404(db, issue_id)
    issue.status = payload.status
    db.commit()
    db.refresh(issue)
    return issue


@router.put("/{issue_id}/priority", response_model=IssueRead)
def update_issue_priority(issue_id: int, payload: IssuePriorityUpdate, db: Session = Depends(get_db)) -> Issue:
    issue = get_issue_or_404(db, issue_id)
    issue.priority = payload.priority
    db.commit()
    db.refresh(issue)
    return issue


@router.put("/{issue_id}/assign", response_model=IssueRead)
def assign_issue(issue_id: int, payload: IssueAssign, db: Session = Depends(get_db)) -> Issue:
    issue = get_issue_or_404(db, issue_id)
    if payload.assigned_to is not None:
        get_user_or_404(db, payload.assigned_to)
    issue.assigned_to = payload.assigned_to
    db.commit()
    db.refresh(issue)
    return issue
