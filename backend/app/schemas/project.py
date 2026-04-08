from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.user import UserRead

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=180)
    description: str = Field(default="", max_length=5000)

class ProjectCreate(ProjectBase):
    created_by: int

class ProjectRead(ProjectBase):
    id: int
    created_by: int
    created_at: datetime
    creator: UserRead
    model_config = ConfigDict(from_attributes=True)
