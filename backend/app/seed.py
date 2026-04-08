from sqlalchemy import select

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.issue import Issue, IssuePriority, IssueStatus
from app.models.project import Project
from app.models.user import User


def get_or_create_user(db, name: str, email: str) -> User:
    user = db.scalar(select(User).where(User.email == email))
    if user:
        return user

    user = User(name=name, email=email)
    db.add(user)
    db.flush()
    return user


def get_or_create_project(db, created_by: int) -> Project:
    project = db.scalar(select(Project).where(Project.name == "Temporary Demo Project"))
    if project:
        return project

    project = Project(
        name="Temporary Demo Project",
        description="Project created for adding 100 temporary issue records.",
        created_by=created_by,
    )
    db.add(project)
    db.flush()
    return project


def run() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        users = [
            get_or_create_user(db, "Temp User 1", "temp.user1@example.com"),
            get_or_create_user(db, "Temp User 2", "temp.user2@example.com"),
            get_or_create_user(db, "Temp User 3", "temp.user3@example.com"),
            get_or_create_user(db, "Temp User 4", "temp.user4@example.com"),
            get_or_create_user(db, "Temp User 5", "temp.user5@example.com"),
        ]
        project = get_or_create_project(db, users[0].id)

        existing_count = len(
            db.scalars(
                select(Issue).where(
                    Issue.project_id == project.id,
                    Issue.title.like("Temporary Issue %"),
                )
            ).all()
        )

        if existing_count >= 100:
            print("100 temporary issue records already exist. No new records added.")
            return

        statuses = [IssueStatus.OPEN, IssueStatus.IN_PROGRESS, IssueStatus.DONE]
        priorities = [IssuePriority.LOW, IssuePriority.MEDIUM, IssuePriority.HIGH]

        for number in range(existing_count + 1, 101):
            issue = Issue(
                title=f"Temporary Issue {number}",
                description=f"This is temporary issue record number {number}.",
                status=statuses[number % len(statuses)],
                priority=priorities[number % len(priorities)],
                project_id=project.id,
                assigned_to=users[number % len(users)].id,
            )
            db.add(issue)

        db.commit()
        print(f"Added {100 - existing_count} temporary issue records.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
