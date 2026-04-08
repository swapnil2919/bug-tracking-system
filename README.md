# Bug Tracking System

A full-stack mini issue tracker built with FastAPI, SQLAlchemy, SQLite, React, Vite, JavaScript, and Axios. It supports a simple Jira-style workflow for projects, issues, assignments, status updates, priority changes, and comments.

## Features

- User CRUD API with unique email validation.
- Project creation and project list/detail APIs.
- Issue creation, status updates, priority updates, assignment, detail view, project issue list, title search, and backend pagination.
- Issue comments with author details.
- Dashboard API with project and issue totals.
- React workspace for creating users/projects, browsing issues, changing status, assigning owners, and adding comments.
- SQLite database for simple local setup.

## Project Structure

```text
backend/
  app/
    api/          FastAPI routers and dependencies
    core/         Settings and environment config
    db/           SQLAlchemy engine/session/base
    models/       SQLAlchemy ORM models
    schemas/      Pydantic request/response schemas
    main.py       FastAPI application factory
    seed.py       Demo data script
frontend/
  src/
    App.jsx       React pages and workflows
    api.js        Axios API client
    App.css       Application styling
```

## Run Locally

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m app.seed
python -m uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`.

Useful endpoints:

- `GET /health`
- `GET /dashboard`
- `GET /users`
- `POST /projects`
- `GET /projects`
- `GET /projects/{project_id}`
- `POST /issues`
- `GET /projects/{project_id}/issues`
- `PUT /issues/{issue_id}/status`
- `PUT /issues/{issue_id}/priority`
- `PUT /issues/{issue_id}/assign`
- `GET /issues/{issue_id}`
- `POST /issues/{issue_id}/comments`
- `GET /issues/{issue_id}/comments`

OpenAPI docs are available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The React app runs at `http://localhost:5173`.

## Database Notes

The backend creates tables automatically on startup through SQLAlchemy metadata. For production work, add Alembic migrations, but this keeps the assignment easy to run and review.

Local SQLite is configured by `backend/.env`:

```env
DATABASE_URL=sqlite:///./bug_tracker.db
```

The SQLite database file is created locally as:

```text
backend/bug_tracker.db
```

This database file is ignored by Git and should not be pushed to GitHub.
