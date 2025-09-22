# 🛡️ AlertaCordón - Reportes Anónimos de Seguridad

Plataforma comunitaria para reportar anónimamente incidentes de seguridad en el barrio Cordón (Montevideo). Inspirado en un atraco real en Paullier entre Rivera y Rodó (19/09/25).

## 🚀 Status
✅ **MVP LIVE** - 2 reportes reales en Neon cloud
✅ **Frontend** - Next.js 15.5.3 + Tailwind CSS
✅ **Backend** - API routes + Prisma 6.16.2
✅ **Database** - Neon PostgreSQL serverless
✅ **Anónimo** - No login, no tracking

## 📊 Reportes Activos
| # | Ubicación | Categoría | Fecha |
|---|-----------|-----------|-------|
| 1 | Paullier entre Rivera y Rodó | Narcos | 19/09/25 |
| 2 | 18 de Julio y Ejido | Sospechoso | 22/09/25 |

## 🛠️ Stack Técnico
- **Frontend**: Next.js 15.5.3 (App Router, TypeScript)
- **Estilos**: Tailwind CSS 3.4.0
- **Backend**: Next.js API Routes
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Prisma 6.16.2
- **Deploy**: Vercel (upcoming)

## 🎯 Features MVP
- [x] Form anónimo de reportes (ubicación, descripción, categoría)
- [x] Validación frontend/backend
- [x] Almacenamiento seguro en Neon cloud
- [x] API RESTful (POST /api/reports, GET /api/reports)
- [x] UX responsive + focus states
- [ ] Suscripciones email (Resend)
- [ ] Auto-post a X (Twitter API)
- [ ] Dashboard admin
- [ ] Mapa interactivo (Leaflet)

## 🔧 Setup Local
```bash
npm install
cp .env.example .env.local  # Configurar DATABASE_URL (Neon)
npx prisma generate
npx prisma db push
npm run dev
