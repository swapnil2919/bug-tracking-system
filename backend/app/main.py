from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.router import api_router
from app.core.config import get_settings
from app.db.base import Base
from app.db.session import engine

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    print("Starting app...")
    # Create database tables
    Base.metadata.create_all(bind=engine)
    yield  # App runs here
    print("Shutting down app...")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(api_router)
