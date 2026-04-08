# Bug Tracking System

A full-stack mini issue tracker built for the assignment: FastAPI, SQLAlchemy, React, and a clean Jira-style workflow for projects, issues, assignments, status updates, and comments.

## Features

- User CRUD API with unique email validation.
- Project creation and project list/detail APIs.
- Issue creation, status updates, assignment, detail view, project issue list, title search, and pagination parameters.
- Issue comments with author details.
- Dashboard API with project and issue totals.
- React workspace for creating users/projects, browsing issues, changing status, assigning owners, and adding comments.
- SQLite by default for local setup, with Docker Compose support for PostgreSQL.

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
    api.js        Fetch API client
    styles.css    Application styling
docker-compose.yml
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

## Run With Docker

```bash
docker compose up --build
```

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

## Database Notes

The backend creates tables automatically on startup through SQLAlchemy metadata. For production work, add Alembic migrations, but this keeps the assignment easy to run and review.

Local SQLite is configured by `backend/.env`:

```env
DATABASE_URL=sqlite:///./bug_tracker.db
```

Docker uses PostgreSQL:

```env
DATABASE_URL=postgresql+psycopg://bug_tracker:bug_tracker@db:5432/bug_tracker
```
