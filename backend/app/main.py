from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.models import *
from sqlalchemy import text
from app.core.config import settings
from app.database.engine import engine
from app.api.routes import auth
from app.api.routes import profile
from app.core.exceptions.exception_handler import http_exception_handler, validation_exception_handler, general_exception_handler
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.exceptions import RequestValidationError
from app.api.routes import health_metric
from app.api.routes import medication
from app.api.routes import appointment
from app.api.routes import medication_reminder
from app.api.routes import dashboard
from app.api.routes.ai import health_insight
from app.core.exceptions.ai import *
from app.core.exceptions.exception_handler import ai_exception_handler

from fastapi.middleware.cors import CORSMiddleware

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://aurea-zapper1.vercel.app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(AIProviderException, ai_exception_handler)
app.add_exception_handler(AIResponseParsingException, ai_exception_handler)
app.add_exception_handler(AIValidationException, ai_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(health_metric.router)
app.include_router(medication.router)
app.include_router(appointment.router)
app.include_router(medication_reminder.router)
app.include_router(dashboard.router)
app.include_router(health_insight.router)


@app.get("/")
def root():
    return {
        "message": "Healthcare Monitoring AI platform is running!",
        "status": "healthy"
        }



