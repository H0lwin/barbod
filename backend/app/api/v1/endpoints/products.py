from fastapi import APIRouter, Depends
from typing import List
import duckdb
from app.db.session import get_db
from app.db.repository import ProductRepository
from app.schemas.base import Product, ProductBase
from app.core.security import get_current_admin

router = APIRouter()

@router.get("/products", response_model=List[Product])
def list_products(db: duckdb.DuckDBPyConnection = Depends(get_db)):
    repo = ProductRepository(db)
    return repo.list_all()

@router.post("/products", response_model=Product)
def create_product(product: ProductBase, db: duckdb.DuckDBPyConnection = Depends(get_db), admin: str = Depends(get_current_admin)):
    repo = ProductRepository(db)
    prod_id = product.id or f"p-{len(repo.list_all()) + 1}"
    repo.create(product, prod_id)
    return {**product.dict(), "id": prod_id}

@router.delete("/products/{prod_id}")
def delete_product(prod_id: str, db: duckdb.DuckDBPyConnection = Depends(get_db), admin: str = Depends(get_current_admin)):
    repo = ProductRepository(db)
    repo.delete(prod_id)
    return {"message": "Product deleted"}
