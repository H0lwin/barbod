from fastapi import APIRouter, Depends
import duckdb
from app.db.session import get_db
from app.db.repository import SettingsRepository
from app.schemas.base import SiteSettings, SiteSettingsBase
from app.core.security import get_current_admin

router = APIRouter()

@router.get("/settings", response_model=SiteSettings)
def get_settings(db: duckdb.DuckDBPyConnection = Depends(get_db)):
    repo = SettingsRepository(db)
    return repo.get()

@router.put("/settings", response_model=SiteSettings)
def update_settings(settings: SiteSettingsBase, db: duckdb.DuckDBPyConnection = Depends(get_db), admin: str = Depends(get_current_admin)):
    repo = SettingsRepository(db)
    repo.update(settings)
    return {**settings.dict(), "id": 1}
