from fastapi import FastAPI

app = FastAPI(
    title = "Healthcare Monitoring AI platform",
    description = "AI-powered healthcare monitoring and insights platform",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Healthcare Monitoring AI platform is running!",
        "status": "healthy"
    }