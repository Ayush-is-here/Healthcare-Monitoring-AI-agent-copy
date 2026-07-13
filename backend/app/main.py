from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.models import *
from sqlalchemy import text
from app.core.config import settings
from app.database.engine import engine
from app.api.routes import auth
from app.api.routes import profile

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("Database connected Successfully")
    except Exception as e:
        print(f"Database connection failed {e}")
    
    yield


app = FastAPI(
    title = settings.app_name,
    description = "AI-powered healthcare monitoring and insights platform",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(auth.router)
app.include_router(profile.router)


@app.get("/")
def root():
    return {
        "message": "Healthcare Monitoring AI platform is running!",
        "status": "healthy"
        }
