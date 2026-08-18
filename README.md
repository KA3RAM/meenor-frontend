<div align="center">

# Meenor | مینور

### مقایسه هوشمند محصولات با قدرت هوش مصنوعی

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Django](https://img.shields.io/badge/Django-REST-092E20?logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

[دمو](#) · [گزارش باگ](#) · [درخواست ویژگی](#)

</div>

---

## درباره پروژه

**Meenor** پلتفرمی است که به کاربران کمک می‌کند تا محصولات مختلف (موبایل، لپ‌تاپ، لوازم دیجیتال و…) را با کمک الگوریتم‌های هوش مصنوعی و تحلیل داده مقایسه کنند و بهترین تصمیم خرید را بر اساس **قیمت**، **کیفیت** و **تجربه‌ی سایر کاربران** بگیرند.

علاوه بر ابزار مقایسه، Meenor یک فضای اجتماعی به نام «نقد‌نگار» هم دارد که در آن کاربران می‌توانند تجربه‌ی خرید خود را با دیگران به اشتراک بگذارند — شبیه یک تایم‌لاین نقد و بررسی واقعی.

---

## ویژگی‌های کلیدی

| ویژگی | توضیح |
|---|---|
| مقایسه با هوش مصنوعی | وارد کردن نام دو محصول و دریافت تحلیل مقایسه‌ای هوشمند |
| چت تعاملی | گفتگو با دستیار هوش مصنوعی درباره‌ی نتایج مقایسه |
| نقد‌نگار | اشتراک‌گذاری تجربه‌ی خرید در قالب پست، عکس و نظر |
| تعاملات اجتماعی | لایک، ذخیره، بازنشر و کامنت روی پست‌ها |
| احراز هویت | ثبت‌نام، ورود و مدیریت پروفایل کاربری |
| PWA | قابلیت نصب به‌عنوان اپلیکیشن روی موبایل و دسکتاپ |
| راست‌به‌چپ | طراحی کامل برای زبان فارسی (RTL) |
| واکنش‌گرا | تجربه‌ی یکسان روی موبایل، تبلت و دسکتاپ |

---

## تکنولوژی‌های استفاده‌شده

**فرانت‌اند**
- React 18 (Create React App)
- React Router v6
- Axios
- Framer Motion (انیمیشن‌ها)
- Swiper.js (اسلایدرها)
- Lottie React (انیمیشن‌های وکتور)
- CSS Modules

**بک‌اند**
- Django + Django REST Framework
- PostgreSQL

**زیرساخت**
- Service Worker سفارشی + Web App Manifest برای PWA

---

## ساختار پروژه (فرانت‌اند)

```
src/
├── assets/          # فونت‌ها، آیکون‌ها، تصاویر
├── components/      # کامپوننت‌های قابل استفاده مجدد (Navbar, Footer, Background, ...)
├── layouts/         # چیدمان‌های اصلی صفحات (MainLayout, AuthLayout, ChatLayout)
├── pages/           # صفحات اصلی (Home, Chat, Profile, Naghdnegar, ...)
├── routes/          # تعریف مسیرهای برنامه (Router.jsx)
├── services/        # ارتباط با API (Axios)
├── styles/          # استایل‌های سراسری و فونت‌ها
├── utils/           # توابع کمکی
├── App.js
├── index.js
└── serviceWorkerRegistration.js
```

---

## شروع به کار

### پیش‌نیازها

- Node.js نسخه ۱۸ یا بالاتر
- Python نسخه ۳.۱۰ یا بالاتر
- PostgreSQL نسخه ۱۴ یا بالاتر

### ۱. کلون کردن پروژه

```bash
git clone <repository-url>
cd meenor
```

### ۲. راه‌اندازی فرانت‌اند

```bash
cd meenor-frontend
npm install
npm start
```

پروژه روی [http://localhost:3000](http://localhost:3000) بالا می‌آید.

### ۳. راه‌اندازی بک‌اند

```bash
cd meenor-backend
python -m venv venv
source venv/bin/activate      # ویندوز: venv\Scripts\activate
pip install -r requirements.txt
```

فایل `.env` را در ریشه‌ی بک‌اند بسازید:

```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_NAME=meenor_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your-password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

سپس:

```bash
python manage.py migrate
python manage.py runserver
```

بک‌اند روی [http://127.0.0.1:8000](http://127.0.0.1:8000) در دسترس خواهد بود.

### ۴. ساخت دیتابیس (در صورت نبود)

```sql
psql -U postgres
CREATE DATABASE meenor_db;
```

---

## اجرا به‌صورت اپلیکیشن موبایل (PWA)

Meenor به‌صورت Progressive Web App پیاده‌سازی شده و قابل نصب روی صفحه‌ی اصلی گوشی است.

```bash
npm run build
npx serve -s build
```

سپس در Chrome (اندروید) یا Safari (آیفون) سایت را باز کرده و از منو گزینه‌ی «Add to Home Screen» یا «Install App» را انتخاب کنید.

> برای جزئیات بیشتر، فایل‌های `manifest.json` و `service-worker.js` را در پوشه‌ی `public/` بررسی کنید.

---

## راهنمای مشارکت (Contributing)

1. یک برنچ جدید از `main` بسازید:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. تغییرات خود را commit کنید:
   ```bash
   git commit -m "feat: توضیح کوتاه تغییر"
   ```
3. برنچ را push کنید و یک Pull Request به `main` بزنید.
4. منتظر بررسی و تایید کد بمانید.

**قوانین کامیت پیشنهادی:**

| پیشوند | کاربرد |
|---|---|
| `feat:` | افزودن ویژگی جدید |
| `fix:` | رفع باگ |
| `style:` | تغییرات ظاهری/CSS |
| `refactor:` | بازنویسی بدون تغییر رفتار |
| `docs:` | تغییرات مستندات |

---

## نقشه راه (Roadmap)

- [ ] افزودن قابلیت جست‌وجوی محصولات
- [ ] بخش ذخیره‌ها (Bookmarks) کامل
- [ ] اتصال چت به مدل هوش مصنوعی واقعی
- [ ] نسخه‌ی انگلیسی سایت
- [ ] تست‌های خودکار (Unit / E2E)

---

## لایسنس

این پروژه تحت لایسنس **MIT** منتشر شده است — برای جزئیات بیشتر فایل `LICENSE` را ببینید.

---

<div align="center">

ساخته‌شده توسط تیم Meenor

© 2026 Meenor - All Rights Reserved

</div>