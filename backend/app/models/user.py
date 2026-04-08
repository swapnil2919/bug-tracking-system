from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)

    projects = relationship("Project", back_populates="creator", cascade="all, delete-orphan")
    assigned_issues = relationship("Issue", back_populates="assignee", foreign_keys="Issue.assigned_to")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
