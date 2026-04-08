from sqlalchemy import select

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.comment import Comment
from app.models.issue import Issue, IssuePriority, IssueStatus
from app.models.project import Project
from app.models.user import User


def run() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.scalar(select(User.id).limit(1)):
            print("Database already contains data. Seed skipped.")
            return

        users = [
            User(name="Aarav Mehta", email="aarav@example.com"),
            User(name="Maya Rao", email="maya@example.com"),
            User(name="Neha Shah", email="neha@example.com"),
        ]
        db.add_all(users)
        db.flush()

        project = Project(
            name="Issue Tracking System",
            description="A Jira-style workspace for tracking defects and delivery tasks.",
            created_by=users[0].id,
        )
        db.add(project)
        db.flush()

        issues = [
            Issue(
                title="Design project board layout",
                description="Create a clean overview for priorities, status, and ownership.",
                status=IssueStatus.IN_PROGRESS,
                priority=IssuePriority.HIGH,
                project_id=project.id,
                assigned_to=users[1].id,
            ),
            Issue(
                title="Add comment stream",
                description="Allow users to discuss progress directly on each issue.",
                status=IssueStatus.OPEN,
                priority=IssuePriority.MEDIUM,
                project_id=project.id,
                assigned_to=users[2].id,
            ),
        ]
        db.add_all(issues)
        db.flush()
        db.add(Comment(issue_id=issues[0].id, user_id=users[0].id, message="Please keep the status flow simple."))
        db.commit()
        print("Seed data created.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
