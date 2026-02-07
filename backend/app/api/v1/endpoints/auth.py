from fastapi import APIRouter, Depends, HTTPException
import duckdb
from app.db.session import get_db
from app.db.repository import AdminRepository
from app.schemas.base import AdminLogin
from app.core.security import verify_password, create_access_token, get_current_admin

router = APIRouter()

@router.post("/login")
def login(data: AdminLogin, db: duckdb.DuckDBPyConnection = Depends(get_db)):
    repo = AdminRepository(db)
    res = repo.get_by_username(data.username)
    if not res or not verify_password(data.password, res[0]):
        raise HTTPException(status_code=401, detail="نام کاربری یا رمز عبور اشتباه است")
    
    token = create_access_token(data.username)
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
def get_me(admin: str = Depends(get_current_admin)):
    return {"username": admin}
