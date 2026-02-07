import getpass
import duckdb
import os
import sys

# Add current directory to path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.security import get_password_hash
from app.db.session import DB_PATH, init_db

def create_admin():
    # Ensure database and tables are up to date
    init_db()
    
    print("--- ایجاد مدیر جدید برای سایت ---")
    username = input("نام کاربری: ")
    email = input("ایمیل: ")
    
    while True:
        password = getpass.getpass("رمز عبور: ")
        confirm_password = getpass.getpass("تایید رمز عبور: ")
        
        if password != confirm_password:
            print("خطا: رمز عبور و تایید آن مطابقت ندارند. دوباره تلاش کنید.")
        elif len(password) < 4:
            print("خطا: رمز عبور باید حداقل ۴ کاراکتر باشد.")
        else:
            break
            
    hashed_password = get_password_hash(password)
    
    try:
        conn = duckdb.connect(DB_PATH)
        # Check if username exists
        exists = conn.execute("SELECT 1 FROM admins WHERE username = ?", [username]).fetchone()
        if exists:
            print(f"خطا: نام کاربری '{username}' قبلا انتخاب شده است.")
            return

        conn.execute("""
            INSERT INTO admins (username, email, hashed_password)
            VALUES (?, ?, ?)
        """, [username, email, hashed_password])
        conn.close()
        print(f"\nتبریک! مدیر '{username}' با موفقیت ساخته شد.")
    except Exception as e:
        print(f"خطا در اتصال به دیتابیس: {e}")

if __name__ == "__main__":
    create_admin()
