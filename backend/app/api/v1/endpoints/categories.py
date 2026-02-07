from fastapi import APIRouter, Depends
from typing import List
import duckdb
from app.db.session import get_db
from app.db.repository import CategoryRepository
from app.schemas.base import Category, CategoryBase
from app.core.security import get_current_admin

router = APIRouter()

@router.get("/categories", response_model=List[Category])
def list_categories(db: duckdb.DuckDBPyConnection = Depends(get_db)):
    repo = CategoryRepository(db)
    return repo.list_all()

@router.post("/categories", response_model=Category)
def create_category(category: CategoryBase, db: duckdb.DuckDBPyConnection = Depends(get_db), admin: str = Depends(get_current_admin)):
    repo = CategoryRepository(db)
    repo.create(category)
    return category

@router.delete("/categories/{cat_id}")
def delete_category(cat_id: str, db: duckdb.DuckDBPyConnection = Depends(get_db), admin: str = Depends(get_current_admin)):
    repo = CategoryRepository(db)
    repo.delete(cat_id)
    return {"message": "Category deleted"}
