import duckdb
import json
from typing import List, Optional, Any
from app.schemas.base import Product, Category, SiteSettings, Contact

class BaseRepository:
    def __init__(self, db: duckdb.DuckDBPyConnection):
        self.db = db

class SettingsRepository(BaseRepository):
    def get(self) -> SiteSettings:
        res = self.db.execute("SELECT * FROM site_settings WHERE id = 1").fetchone()
        if not res:
            return SiteSettings(nameFa="گوجو استور", nameEn="GOJUSTORE")
        return SiteSettings(id=res[0], nameFa=res[1], nameEn=res[2], logoUrl=res[3], footerText=res[4])

    def update(self, settings: Any) -> None:
        self.db.execute("""
            INSERT OR REPLACE INTO site_settings (id, name_fa, name_en, logo_url, footer_text)
            VALUES (1, ?, ?, ?, ?)
        """, [settings.nameFa, settings.nameEn, settings.logoUrl, settings.footerText])

class CategoryRepository(BaseRepository):
    def list_all(self) -> List[Category]:
        rows = self.db.execute("SELECT * FROM categories").fetchall()
        return [Category(id=r[0], label=r[1], icon=r[2]) for r in rows]

    def create(self, category: Any) -> None:
        self.db.execute("INSERT OR REPLACE INTO categories (id, label, icon) VALUES (?, ?, ?)", 
                       [category.id, category.label, category.icon])

    def delete(self, cat_id: str) -> None:
        self.db.execute("DELETE FROM categories WHERE id = ?", [cat_id])

class ProductRepository(BaseRepository):
    def list_all(self) -> List[Product]:
        rows = self.db.execute("SELECT * FROM products").fetchall()
        result = []
        for r in rows:
            result.append(Product(
                id=r[0], name=r[1], price=r[2], category=r[3], 
                coverUrl=r[4], badge=r[5], details=json.loads(r[6]), 
                telegram=r[7], popular=bool(r[8]), icon=r[9]
            ))
        return result

    def create(self, product: Any, prod_id: str) -> None:
        self.db.execute("""
            INSERT OR REPLACE INTO products (id, name, price, category, cover_url, badge, details, telegram, popular, icon)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, [
            prod_id, product.name, product.price, product.category, 
            product.coverUrl, product.badge, json.dumps(product.details), 
            product.telegram, product.popular, product.icon
        ])

    def delete(self, prod_id: str) -> None:
        self.db.execute("DELETE FROM products WHERE id = ?", [prod_id])

class ContactRepository(BaseRepository):
    def list_all(self) -> List[Contact]:
        rows = self.db.execute("SELECT * FROM contacts").fetchall()
        return [Contact(id=r[0], label=r[1], username=r[2], url=r[3]) for r in rows]

    def create(self, contact: Any, cid: str) -> None:
        self.db.execute("INSERT OR REPLACE INTO contacts (id, label, username, url) VALUES (?, ?, ?, ?)", 
                       [cid, contact.label, contact.username, contact.url])

    def delete(self, cid: str) -> None:
        self.db.execute("DELETE FROM contacts WHERE id = ?", [cid])

class AdminRepository(BaseRepository):
    def get_by_username(self, username: str) -> Optional[Any]:
        return self.db.execute("SELECT hashed_password FROM admins WHERE username = ?", [username]).fetchone()
