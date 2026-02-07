from pydantic import BaseModel, Field
from typing import List, Optional

# --- Site Settings ---
class SiteSettingsBase(BaseModel):
    nameFa: str = Field(..., alias="nameFa")
    nameEn: str = Field(..., alias="nameEn")
    logoUrl: Optional[str] = Field("", alias="logoUrl")
    footerText: Optional[str] = Field("", alias="footerText")

    class Config:
        populate_by_name = True

class SiteSettings(SiteSettingsBase):
    id: int = 1

# --- Category ---
class CategoryBase(BaseModel):
    id: str
    label: str
    icon: str

class Category(CategoryBase):
    pass

# --- Product ---
class ProductBase(BaseModel):
    id: Optional[str] = None
    name: str
    price: str
    icon: Optional[str] = "package"
    category: str
    coverUrl: Optional[str] = Field("", alias="coverUrl")
    badge: Optional[str] = ""
    details: List[str] = []
    telegram: Optional[str] = ""
    popular: Optional[bool] = False

    class Config:
        populate_by_name = True

class Product(ProductBase):
    pass

# --- Contact ---
class ContactBase(BaseModel):
    id: Optional[str] = None
    label: str
    username: str
    url: Optional[str] = ""

class Contact(ContactBase):
    pass

# --- Auth ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class AdminLogin(BaseModel):
    username: str
    password: str
