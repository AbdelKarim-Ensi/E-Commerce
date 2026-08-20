# E-Commerce Backend

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-red?style=flat)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=flat&logo=stripe&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

API backend d'e-commerce full-stack construite avec NestJS, pensée comme un projet
d'apprentissage approfondi : chaque brique (auth, paiements, sécurité, async processing,
tests) est implémentée avec un souci d'architecture et de robustesse propre à un
environnement de production.

> 🎓 Projet pédagogique — priorité donnée à la compréhension des concepts et aux bonnes
> pratiques plutôt qu'à la vitesse d'implémentation.

---

## 📋 Sommaire

- [Stack technique](#-stack-technique)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Endpoints API](#-endpoints-api-principaux)
- [Tests](#-tests)
- [Roadmap](#-roadmap)
- [Apprentissages clés](#-apprentissages-clés)

---

## 🛠 Stack technique

| Catégorie | Technologie |
|---|---|
| Framework backend | NestJS |
| Langage | TypeScript |
| Base de données | PostgreSQL |
| ORM | Prisma |
| Cache / Sessions | Redis (ioredis) |
| Files d'attente | BullMQ |
| Paiements | Stripe (PaymentIntents + Webhooks) |
| Stockage fichiers | Supabase Storage |
| Emails | Nodemailer + Brevo SMTP |
| Génération PDF | pdfkit |
| Traitement images | sharp |
| Tests unitaires | Jest + jest-mock-extended |
| Tests E2E | Supertest |
| Conteneurisation | Docker Compose |

---

## ✨ Fonctionnalités

### 🔐 Authentification & Sécurité
- JWT avec rotation de refresh tokens (stockage Redis, hash SHA-256, TTL)
- Cookies httpOnly, guards `JwtAuthGuard` / `RolesGuard`
- Décorateurs `@Roles()` / `@CurrentUser()`
- Détection de réutilisation de token → révocation complète de session
- Helmet (CSP, HSTS, X-Frame-Options), CORS restreint
- Validation globale (`ValidationPipe` whitelist/forbidNonWhitelisted)
- Rate limiting (100 req/min global, 5 req/min sur les routes d'auth)

### 🛒 Commandes & Stock
- Décrément atomique du stock (`updateMany` + `WHERE stock >= quantity`) — anti race condition
- Transactions Prisma en isolation `Serializable`
- State machine de statuts (`PENDING → PAID → SHIPPED → DELIVERED`, `CANCELLED` depuis `PENDING`/`PAID`)
- Restitution automatique du stock en cas d'annulation

### 💳 Paiements
- Intégration Stripe (PaymentIntent + Webhooks)
- Vérification de signature via raw body
- Idempotence des webhooks (`ProcessedWebhookEvent` keyé sur l'ID d'event Stripe)

### ⚙️ Traitement asynchrone
- Files BullMQ (`invoices`, `emails`) sur Redis
- Génération de factures PDF (`InvoiceProcessor`)
- Envoi d'emails de confirmation avec pièce jointe PDF (`EmailProcessor`)

### 📦 Upload de fichiers
- Stockage Supabase (bucket `product-images`, sortie WebP)
- Validation par magic bytes (`file-type`)
- Optimisation d'image + génération de thumbnails (`sharp`)
- Restriction par rôle (ADMIN / STOCK_MANAGER)

### ✅ Tests
- 86 tests automatisés (58 unitaires + 28 E2E), tous passants

---

## 🏗 Architecture

```
Client (Angular) 
      │
      ▼
   Nginx (reverse proxy / TLS) — à venir
      │
      ▼
┌─────────────────────────────────────────┐
│              NestJS API                 │
│  ┌───────────┐  ┌───────────┐           │
│  │   Auth     │  │  Orders   │           │
│  │  (JWT+RT)  │  │ (state    │           │
│  │            │  │  machine) │           │
│  └───────────┘  └───────────┘           │
│  ┌───────────┐  ┌───────────┐           │
│  │  Payment   │  │  Uploads  │           │
│  │  (Stripe)  │  │(Supabase) │           │
│  └───────────┘  └───────────┘           │
└─────────────────────────────────────────┘
      │              │              │
      ▼              ▼              ▼
 PostgreSQL       Redis          BullMQ Queues
 (Prisma)     (refresh tokens)  (invoices, emails)
```

---

## 📁 Structure du projet

```
src/
├── config/              # Validation d'env (Joi), namespaces typés
├── modules/
│   ├── auth/             # JWT, refresh tokens, guards, strategies
│   ├── categories/        
│   ├── notifications/     # Processors BullMQ (email, invoice), templates
│   ├── orders/             # State machine, DTO, entities
│   ├── payment/            # Stripe service + webhook controller
│   ├── products/            
│   └── uploads/            # Storage service (Supabase)
├── prisma/               # PrismaService, exception filter, mocks
└── main.ts

test/
├── utils/                # Setup app de test, seed helper, mocks Supabase
├── *.e2e-spec.ts         # Tests E2E (auth, orders, payment, uploads)
└── jest-e2e.json

prisma/
├── schema.prisma
└── migrations/
```

---

## 🚀 Installation

```bash
# Cloner le repo
git clone https://github.com/AbdelKarim-Ensi/E-Commerce-backend.git
cd E-Commerce-backend

# Installer les dépendances
npm install

# Copier et configurer l'environnement
cp .env.example .env

# Lancer l'infrastructure (Postgres, Redis)
docker compose up -d

# Appliquer les migrations Prisma
npx prisma migrate deploy

# Lancer en mode développement
npm run start:dev
```

L'API est disponible sur `http://localhost:3000` (ou le port configuré).

---

## 🔧 Variables d'environnement

Voir `.env.example` pour la liste complète. Principales catégories :

- `DATABASE_URL` — connexion PostgreSQL (Prisma)
- `REDIS_HOST` / `REDIS_PORT` — connexion Redis
- `JWT_SECRET` / `JWT_REFRESH_SECRET` — secrets JWT
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — Stripe
- `SUPABASE_URL` / `SUPABASE_KEY` — stockage fichiers
- `SMTP_*` — configuration Brevo pour l'envoi d'emails

---

## 📡 Endpoints API principaux

| Méthode | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Inscription | Public |
| `POST` | `/auth/login` | Connexion (retourne cookies httpOnly) | Public |
| `POST` | `/auth/refresh` | Rotation du refresh token | Refresh token |
| `POST` | `/auth/logout` | Révocation de session | JWT |
| `GET` | `/products` | Liste des produits | Public |
| `POST` | `/products/:id/image` | Upload image produit | ADMIN / STOCK_MANAGER |
| `POST` | `/orders` | Création de commande | JWT |
| `PATCH` | `/orders/:id/status` | Transition de statut (state machine) | ADMIN |
| `POST` | `/payment/create-intent` | Création PaymentIntent Stripe | JWT |
| `POST` | `/payment/webhook` | Webhook Stripe (raw body) | Signature Stripe |
| `GET` | `/categories` | Liste des catégories | Public |

---

## 🧪 Tests

```bash
npm test          # Tests unitaires (~2s) — 58 tests, 8 suites
npm run test:e2e  # Tests E2E (~5s, nécessite Postgres + Redis actifs) — 28 tests, 5 suites
```

**Couverture actuelle : 86 tests, tous passants.**

Stack de test :
- Jest + `jest-mock-extended` pour le mock profond de Prisma (tests unitaires)
- Supertest pour les requêtes HTTP réelles contre l'app NestJS (tests E2E)
- Base PostgreSQL de test isolée (`ecommerce_test`) + Redis réel pour les E2E

---

## 🗺 Roadmap

- [x] Phase 1-4 — Setup, Docker, CRUD NestJS
- [x] Phase 5 — Authentification JWT + refresh token rotation
- [x] Phase 6-7 — Configuration & sécurité OWASP
- [x] Phase 8 — Logique métier commandes (state machine, transactions)
- [x] Phase 9 — Paiements Stripe (webhooks, idempotence)
- [x] Phase 10 — Traitement asynchrone (BullMQ)
- [x] Phase 11 — Upload de fichiers (Supabase Storage)
- [x] Phase 12 — Tests automatisés (86 tests)
- [ ] Phase 13+ — Frontend Angular (SSR + Signals)
- [ ] Audit logging
- [ ] Nginx / TLS
- [ ] CI/CD (GitHub Actions + Trivy/Snyk)
- [ ] Déploiement production (connection pooling, monitoring)

---

## 💡 Apprentissages clés

- **Race conditions** : les patterns read-then-check-then-write sont dangereux pour la
  gestion de stock ; préférer un `updateMany` atomique avec `WHERE` conditionnel.
- **Idempotence webhooks** : toujours garder une trace des events déjà traités (par ID)
  pour éviter les doubles traitements Stripe.
- **Gestion d'erreurs métier** : lever des exceptions NestJS (`HttpException` et
  dérivées) plutôt que des `Error` génériques, sous peine de remonter des 500 au lieu
  de codes HTTP appropriés — détecté via les tests E2E de ce projet.
- **ESM vs CommonJS** : certains packages (ex. `file-type` v17+) nécessitent un import
  dynamique (`await import(...)`) dans un contexte NestJS CommonJS.

---

## 📄 Licence

MIT
