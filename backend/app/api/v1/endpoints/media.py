from fastapi import APIRouter, Depends, File, UploadFile
import os
import shutil
import uuid
from app.core.security import get_current_admin

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), admin: str = Depends(get_current_admin)):
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join("uploads", unique_filename)
    
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
        
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the full URL
    return {"url": f"http://localhost:8000/uploads/{unique_filename}"}
