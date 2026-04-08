from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.issue import IssuePriority, IssueStatus
from app.schemas.user import UserRead


class IssueBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=220)
    description: str = Field(default="", max_length=10000)
    priority: IssuePriority = IssuePriority.MEDIUM


class IssueCreate(IssueBase):
    project_id: int
    assigned_to: int | None = None


class IssueStatusUpdate(BaseModel):
    status: IssueStatus


class IssuePriorityUpdate(BaseModel):
    priority: IssuePriority


class IssueAssign(BaseModel):
    assigned_to: int | None = None


class IssueRead(IssueBase):
    id: int
    status: IssueStatus
    project_id: int
    assigned_to: int | None
    created_at: datetime
    assignee: UserRead | None = None

    model_config = ConfigDict(from_attributes=True)
