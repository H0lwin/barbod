import duckdb
from typing import Generator
import os

DB_PATH = os.getenv("DATABASE_URL", "gojo_store.db").replace("sqlite:///", "")

def get_db():
    conn = duckdb.connect(DB_PATH)
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Initialize the database tables if they don't exist"""
    conn = duckdb.connect(DB_PATH)
    
    # Site Settings Table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS site_settings (
            id INTEGER PRIMARY KEY DEFAULT 1,
            name_fa TEXT,
            name_en TEXT,
            logo_url TEXT,
            footer_text TEXT
        )
    """)
    
    # Categories Table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            label TEXT,
            icon TEXT
        )
    """)
    
    # Products Table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT,
            price TEXT,
            category TEXT,
            cover_url TEXT,
            badge TEXT,
            details TEXT,  -- Stored as JSON string
            telegram TEXT,
            popular BOOLEAN DEFAULT FALSE,
            icon TEXT DEFAULT 'package'
        )
    """)
    
    # Contacts Table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id TEXT PRIMARY KEY,
            label TEXT,
            username TEXT,
            url TEXT
        )
    """)
    
    # Admin User Table (for simple auth)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS admins (
            username TEXT PRIMARY KEY,
            hashed_password TEXT
        )
    """)
    
    # Migration: Add email column if not exists
    try:
        conn.execute("ALTER TABLE admins ADD COLUMN email TEXT")
    except:
        pass # Column already exists
    
    # Seed default data if empty
    settings_count = conn.execute("SELECT count(*) FROM site_settings").fetchone()[0]
    if settings_count == 0:
        conn.execute("""
            INSERT INTO site_settings (id, name_fa, name_en, logo_url, footer_text)
            VALUES (1, 'گوجو استور', 'GOJUSTORE', '', 'جهت سفارش طراحی سایت اختصاصی خود به آیدی‌های بالا پیام دهید.')
        """)
        
    cat_count = conn.execute("SELECT count(*) FROM categories").fetchone()[0]
    if cat_count == 0:
        conn.execute("INSERT INTO categories (id, label, icon) VALUES ('config', 'کانفیگ اختصاصی', 'rocket')")
        conn.execute("INSERT INTO categories (id, label, icon) VALUES ('account', 'اکانت‌های ویژه', 'crown')")
        conn.execute("INSERT INTO categories (id, label, icon) VALUES ('game', 'محصولات گیمینگ', 'gamepad')")
        
    prod_count = conn.execute("SELECT count(*) FROM products").fetchone()[0]
    if prod_count == 0:
        import json
        # Example products
        products = [
            ("p1", "اکانت ChatGPT Plus", "1,200,000 تومان", "account", "", "تحویل فوری", json.dumps(["دسترسی به GPT-4", "پاسخ‌دهی سریع", "بدون محدودیت"]), "https://t.me/BARBODINHO", True, "brain"),
            ("p2", "تلگرام پریمیوم ۱ ساله", "2,500,000 تومان", "account", "", "ویژه", json.dumps(["استیکرهای متحرک", "آپلود ۴ گیگابایت", "بدون تبلیغات"]), "https://t.me/BARBODINHO", True, "star"),
            ("p3", "کانفیگ V2Ray پرسرعت", "150,000 تومان", "config", "", "آی‌پی ثابت", json.dumps(["بدون قطعی", "مناسب اینستاگرام", "حجم نامحدود"]), "https://t.me/BARBODINHO", False, "zap")
        ]
        for p in products:
            conn.execute("""
                INSERT INTO products (id, name, price, category, cover_url, badge, details, telegram, popular, icon)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, p)

    contact_count = conn.execute("SELECT count(*) FROM contacts").fetchone()[0]
    if contact_count == 0:
        conn.execute("INSERT INTO contacts (id, label, username, url) VALUES ('c1', 'ادمین اصلی', '@BARBODINHO', 'https://t.me/BARBODINHO')")
        conn.execute("INSERT INTO contacts (id, label, username, url) VALUES ('c2', 'ربات فروش پنل', '@Panelsellrobot', 'https://t.me/Panelsellrobot')")

    # Admin User
    admin_count = conn.execute("SELECT count(*) FROM admins").fetchone()[0]
    if admin_count == 0:
        from app.core.security import get_password_hash
        hashed_pw = get_password_hash("admin")
        conn.execute("INSERT INTO admins (username, hashed_password) VALUES (?, ?)", ["admin", hashed_pw])
        
    conn.close()
