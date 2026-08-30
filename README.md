# TechGear — Full-Stack E-Commerce Platform

TechGear is a full-stack e-commerce platform for tech products (smartphones, laptops, audio gear, wearables), built as a portfolio project to demonstrate real-world engineering and cloud deployment experience. It covers the full lifecycle of an online store: product catalog, cart, checkout with Stripe, order management, authentication, an admin back-office with analytics, and production-grade monitoring.

🔗 **Live demo:** [techgear-frontend.vercel.app](https://techgear-frontend.vercel.app)
🔗 **Backend API:** [techgear-backend-ekrc.onrender.com](https://techgear-backend-ekrc.onrender.com)

---

## ✨ Features

### Storefront
- Product catalog with categories, search, and filtering
- Product detail pages with reviews and ratings
- Shopping cart and wishlist
- Secure checkout with Stripe payments
- User authentication (email/password + Google Sign-In via Firebase)
- Order history and tracking
- Newsletter subscription

### Admin Back-Office
- Dashboard with revenue, orders, and product analytics (interactive charts)
- Product and category management
- Order management with status tracking
- Review moderation
- User management
- Newsletter subscriber management

### Engineering
- Server-side rendering (SSR) for SEO and performance
- Cookie-based authentication with refresh token rotation and reuse detection
- Background job processing (email sending, etc.) via BullMQ
- Rate limiting and anti-enumeration protections on sensitive auth endpoints
- Error tracking and monitoring in production (Sentry)
- Automated security scanning in CI/CD (Trivy, npm audit)
- Fully containerized local development environment (Docker Compose + Nginx)

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **NestJS** | Backend framework (REST API) |
| **Prisma** | ORM for PostgreSQL |
| **PostgreSQL 16** | Primary database |
| **Redis 7 / BullMQ** | Caching and background job queues |
| **Stripe** | Payment processing |
| **Firebase Admin SDK** | Google Sign-In verification |
| **Supabase Storage** | Product image storage |
| **Brevo (HTTP API)** | Transactional email delivery |
| **Sentry** (`@sentry/nestjs`) | Error tracking |
| **Jest + Supertest** | Unit and E2E testing |

### Frontend
| Technology | Purpose |
|---|---|
| **Angular 21 (SSR)** | Frontend framework with server-side rendering |
| **Tailwind CSS v4** | Styling |
| **Lucide Angular** | Icon library |
| **Chart.js** | Admin dashboard analytics charts |
| **Sentry** (`@sentry/angular`) | Frontend error tracking |
| **Vitest** | Unit testing |

### Infrastructure & DevOps
| Technology | Purpose |
|---|---|
| **Docker Compose** | Local multi-container development |
| **Nginx** | Reverse proxy (local HTTPS) |
| **Render** | Backend, PostgreSQL, and Redis hosting |
| **Vercel** | Frontend hosting |
| **GitHub Actions** | CI/CD (backend, frontend, security scanning) |
| **Trivy** | Container vulnerability scanning |

---

## 🏗️ Architecture

This project is a **monorepo** containing both the backend and frontend applications:

```
E-Commerce/
├── backend/          # NestJS API (Prisma, PostgreSQL, Redis, Stripe, Firebase)
├── frontend/         # Angular 21 SSR application (Tailwind CSS v4)
├── .github/
│   └── workflows/    # CI/CD pipelines (backend-ci.yml, frontend-ci.yml, security-scan.yml)
└── docker-compose.yml
```

Locally, all traffic is routed through **Nginx** as a reverse proxy over HTTPS (`https://localhost`), with the backend and frontend containers exposed only internally (`expose`, not `ports`) — mirroring a production-like setup.

In production, the backend is deployed on **Render** (API + managed PostgreSQL + Redis) and the frontend is deployed on **Vercel**, communicating over HTTPS with cross-domain cookie-based authentication (`SameSite=None`).

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Docker & Docker Compose
- Node.js (for running scripts outside containers, if needed)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/AbdelKarim-Ensi/E-Commerce.git
   cd E-Commerce
   ```

2. Create your environment file:
   ```bash
   cp backend/.env.example backend/.env.docker
   ```
   Fill in the required values (database credentials, Stripe keys, Firebase service account, Supabase credentials, Brevo API key, Sentry DSN, etc.).

3. Start all services:
   ```bash
   docker compose up --build
   ```

4. The application will be available at:
   - **Storefront:** `https://localhost`
   - **Admin dashboard:** `https://localhost/admin`
   - **API:** `https://localhost/api`

> **Note (Windows):** If you hit an `EPERM` error running `npx prisma generate`, stop all running Node processes first:
> ```powershell
> Get-Process node | Stop-Process -Force
> ```

---

## 🔐 Environment Variables

Key environment variables (see `backend/.env.example` for the full list):

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe payment processing |
| `FIREBASE_*` | Firebase Admin SDK credentials (Google Sign-In) |
| `SUPABASE_*` | Supabase Storage credentials |
| `BREVO_API_KEY` | Transactional email delivery |
| `SENTRY_DSN` | Error tracking |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Auth token signing |

Environment variables are managed via platform dashboards in production (Render, Vercel) and are never committed to source control.

---

## 🧪 Testing

```bash
# Backend unit + E2E tests
cd backend
npm run test
npm run test:e2e

# Frontend unit tests
cd frontend
npm run test
```

---

## 📦 CI/CD

GitHub Actions pipelines run on every push/PR:
- `backend-ci.yml` — lint, build, and test the NestJS API
- `frontend-ci.yml` — lint, build, and test the Angular application
- `security-scan.yml` — Trivy container vulnerability scanning and `npm audit`

---

## 📄 License

This project was built for educational and portfolio purposes.

---

## 👤 Author

**Abdel Karim** — Student Developer at ENSI
🔗 [GitHub](https://github.com/AbdelKarim-Ensi)