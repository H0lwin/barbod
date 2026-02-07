from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.db.session import init_db
from app.api.v1.api import api_router

app = FastAPI(
    title="Gojo Store API",
    description="Backend for Gojo Store digital products shop using DuckDB",
    version="1.0.0"
)

# Initialize database on startup
@app.on_event("startup")
def on_startup():
    init_db()
    # Ensure uploads directory exists
    if not os.path.exists("uploads"):
        os.makedirs("uploads")

# Set up CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add production frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount uploads directory to serve files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to Gojo Store API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
