from fastapi import APIRouter, Depends
from typing import List
import duckdb
from app.db.session import get_db
from app.db.repository import ContactRepository
from app.schemas.base import Contact, ContactBase
from app.core.security import get_current_admin

router = APIRouter()

@router.get("/contacts", response_model=List[Contact])
def list_contacts(db: duckdb.DuckDBPyConnection = Depends(get_db)):
    repo = ContactRepository(db)
    return repo.list_all()

@router.post("/contacts", response_model=Contact)
def create_contact(contact: ContactBase, db: duckdb.DuckDBPyConnection = Depends(get_db), admin: str = Depends(get_current_admin)):
    repo = ContactRepository(db)
    cid = contact.id or f"c-{len(repo.list_all()) + 1}"
    repo.create(contact, cid)
    return {**contact.dict(), "id": cid}

@router.delete("/contacts/{cid}")
def delete_contact(cid: str, db: duckdb.DuckDBPyConnection = Depends(get_db), admin: str = Depends(get_current_admin)):
    repo = ContactRepository(db)
    repo.delete(cid)
    return {"message": "Contact deleted"}
