from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_issue_or_404, get_user_or_404
from app.db.session import get_db
from app.models.comment import Comment
from app.schemas.comment import CommentCreate, CommentRead

router = APIRouter()


@router.post("/issues/{issue_id}/comments", response_model=CommentRead, status_code=status.HTTP_201_CREATED)
def create_comment(issue_id: int, payload: CommentCreate, db: Session = Depends(get_db)) -> Comment:
    get_issue_or_404(db, issue_id)
    get_user_or_404(db, payload.user_id)
    comment = Comment(issue_id=issue_id, **payload.model_dump())
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.get("/issues/{issue_id}/comments", response_model=list[CommentRead])
def list_comments(issue_id: int, db: Session = Depends(get_db)) -> list[Comment]:
    get_issue_or_404(db, issue_id)
    stmt = (
        select(Comment)
        .where(Comment.issue_id == issue_id)
        .options(selectinload(Comment.author))
        .order_by(Comment.created_at.asc())
    )
    return list(db.scalars(stmt).all())
