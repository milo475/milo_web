# milo_web — Мөнх-Очир Portfolio

Мөнх-Очирын танилцуулга (portfolio) вэб. **React + Vite** дээр бүтээгдсэн.

## Технологи
- React 18
- Vite 6
- Цэвэр CSS (particle constellation canvas background)

## Ажиллуулах

```bash
npm install      # хамаарлуудыг суулгах
npm run dev      # хөгжүүлэлтийн server (http://localhost:5173)
npm run build    # production build (dist/)
npm run preview  # build-ийг үзэх
```

## Бүтэц

```
src/
├─ main.jsx              # entry point
├─ App.jsx               # бүх хэсгийг угсардаг
├─ data.js               # контент (нэр, ур чадвар, төслүүд, холбоо барих)
├─ styles.css            # бүх загвар
├─ components/           # Nav, Hero, About, Skills, Work, Contact, Footer, Constellation
└─ hooks/useReveal.js    # scroll-on-reveal анимац
```

Контентоо засахдаа `src/data.js`-г засна.

`legacy/` хавтсанд анхны static HTML/CSS/JS хувилбар хадгалагдсан.

## Сургалтын мэдээллийн сан (MySQL/MariaDB)

kali-linux хэсгийн бүх хичээл MySQL (MariaDB) санд хадгалагдсан. Сайт
курсуудыг API-аас татаж, амжилтгүй бол `src/data/courses.js` доторх локал
өгөгдөл рүү автоматаар найдварлана (offline fallback).

```
server/
├─ schema.sql   # courses, lessons (blocks JSON) хүснэгтүүд
├─ db.js        # mysql2 connection pool
├─ seed.mjs     # courses.js → MySQL рүү бичих (npm run seed)
└─ index.js     # Express REST API (npm run server)
```

### Анх тохируулах

```bash
# 1) Схем + (root-оор) хэрэглэгч үүсгэх
mysql -u root < server/schema.sql

# 2) .env үүсгэх (.env.example-ийг хуулж утгуудаа нөх)
cp .env.example .env

# 3) Хичээлүүдийг санд хадгалах
npm run seed       # → "5 курс, 37 хичээл"
```

### Ажиллуулах

```bash
npm run server     # API → http://localhost:4000/api/courses
npm run dev        # frontend (vite /api-г 4000 руу proxy хийнэ)
```

API төгсгөлүүд: `GET /api/health`, `GET /api/courses`, `GET /api/courses/:id`.

> Тэмдэглэл: энэ API нэвтрэлтгүй (read-only хичээлийн контент). `.env`-д
> сангийн нууц үг агуулагддаг тул git-д ороогүй (`.gitignore`).
