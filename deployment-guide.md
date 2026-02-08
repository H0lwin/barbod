# راهنمای جامع استقرار پروژه (Deployment Guide)
این راهنما برای راه‌اندازی پروژه **Next.js** و **FastAPI** روی سرور **Ubuntu 22.04** با استفاده از **Apache** تهیه شده است.

---

## مشخصات سرور شما
- **IP**: `139.162.175.91`
- **Domain**: `gojustore.site`
- **OS**: Ubuntu 22.04

---

## مرحله ۱: ورود به سرور و به‌روزرسانی
ابتدا ترمینال خود را باز کرده و با دستور زیر وارد سرور شوید (رمز عبور را هنگام درخواست وارد کنید):

```bash
ssh root@139.162.175.91
```

سپس سیستم را به‌روزرسانی کنید:
```bash
sudo apt update && sudo apt upgrade -y
```

---

## مرحله ۲: نصب ابزارهای مورد نیاز
ابزارهای پایه شامل پایتون، آپاچی و گیت را نصب کنید:
```bash
sudo apt install -y python3-pip python3-venv apache2 git curl
```

---

## مرحله ۳: نصب Node.js (برای فرانت‌اند)
برای اجرای Next.js به نسخه جدید Node نیاز دارید:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## مرحله ۴: انتقال کد به سرور
شما می‌توانید کد خود را با `git` به سرور منتقل کنید یا از طریق `SCP` فایل‌ها را کپی کنید. در اینجا فرض می‌کنیم کد در مسیر `/var/www/persian-website` قرار می‌گیرد:
```bash
sudo mkdir -p /var/www/persian-website
sudo chown -R $USER:$USER /var/www/persian-website
cd /var/www/persian-website
# کدهای خود را اینجا کپی یا کلون کنید
```

---

## مرحله ۵: راه‌اندازی بک‌اند (FastAPI)
۱. وارد پوشه بک‌اند شوید:
```bash
cd /var/www/persian-website/backend
```
۲. یک محیط مجازی (Virtual Environment) بسازید و آن را فعال کنید:
```bash
python3 -m venv venv
source venv/bin/activate
```
۳. کتابخانه‌های مورد نیاز را نصب کنید:
```bash
pip install -r requirements.txt
pip install gunicorn uvicorn
```

---

## مرحله ۶: راه‌اندازی فرانت‌اند (Next.js)
۱. وارد پوشه فرانت‌اند شوید:
```bash
cd /var/www/persian-website/frontend
```
۲. پکیج‌ها را نصب و پروژه را بیلد کنید:
```bash
npm install
npm run build
```

---

## مرحله ۷: مدیریت پروسه‌ها با PM2
برای اینکه با بستن ترمینال، سایت از دسترس خارج نشود، از PM2 استفاده می‌کنیم:
```bash
sudo npm install -g pm2

# اجرای بک‌اند (پورت 8000)
cd /var/www/persian-website/backend
pm2 start "source venv/bin/activate && gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000" --name backend

# اجرای فرانت‌اند (پورت 3000)
cd /var/www/persian-website/frontend
pm2 start npm --name frontend -- start
```

---

## مرحله ۸: تنظیمات Apache (Reverse Proxy)
ما باید آپاچی را طوری تنظیم کنیم که درخواست‌های دامنه شما را به پورت‌های ۳۰۰۰ و ۸۰۰۰ هدایت کند.

۱. ماژول‌های مورد نیاز را فعال کنید:
```bash
sudo a2enmod proxy proxy_http rewrite ssl
```
۲. فایل تنظیمات را بسازید:
```bash
sudo nano /etc/apache2/sites-available/gojustore.site.conf
```
۳. متن زیر را دقیقاً کپی و در فایل قرار دهید:
```apache
<VirtualHost *:80>
    ServerName gojustore.site
    ServerAlias www.gojustore.site

    # هدایت درخواست‌های API به بک‌اند
    ProxyPass /api http://localhost:8000/api
    ProxyPassReverse /api http://localhost:8000/api

    # هدایت سایر درخواست‌ها به فرانت‌اند (Next.js)
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/gojustore_error.log
    CustomLog ${APACHE_LOG_DIR}/gojustore_access.log combined
</VirtualHost>
```
۴. سایت را فعال و آپاچی را ری‌استارت کنید:
```bash
sudo a2ensite gojustore.site.conf
sudo systemctl restart apache2
```

---

## مرحله ۹: نصب SSL (رایگان و خودکار)
برای فعال‌سازی HTTPS دستورات زیر را بزنید:
```bash
sudo apt install python3-certbot-apache -y
sudo certbot --apache -d gojustore.site -d www.gojustore.site
```
(در مراحل نصب، ایمیل خود را وارد کرده و گزینه‌ها را تایید کنید تا تغییر مسیر خودکار به HTTPS فعال شود).

---

## نکات کاربردی
- **مشاهده وضعیت سرویس‌ها**: `pm2 status`
- **مشاهده لاگ‌ها**: `pm2 logs`
- **ری‌استارت کردن پس از تغییر کد**: `pm2 restart all`
- **فایروال**: اگر سایت باز نشد، دستور `sudo ufw allow 'Apache Full'` را اجرا کنید.
