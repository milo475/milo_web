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
