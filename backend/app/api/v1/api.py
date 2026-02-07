from fastapi import APIRouter
from app.api.v1.endpoints import auth, products, categories, settings, contacts, media

api_router = APIRouter()

api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(media.router, tags=["media"])
api_router.include_router(settings.router, tags=["settings"])
api_router.include_router(categories.router, tags=["categories"])
api_router.include_router(products.router, tags=["products"])
api_router.include_router(contacts.router, tags=["contacts"])
