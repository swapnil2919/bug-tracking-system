from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.user import UserRead

class CommentCreate(BaseModel):
    user_id: int
    message: str = Field(..., min_length=1, max_length=5000)

class CommentRead(BaseModel):
    id: int
    issue_id: int
    user_id: int
    message: str
    created_at: datetime
    author: UserRead

    model_config = ConfigDict(from_attributes=True)
