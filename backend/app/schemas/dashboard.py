from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_projects: int
    total_issues: int
    open_issues: int
    in_progress_issues: int
    done_issues: int
