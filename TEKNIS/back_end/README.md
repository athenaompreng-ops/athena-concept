# 🔧 ATHENA Backend — API Server

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/BullMQ-FF6600?style=for-the-badge&logo=redis&logoColor=white" alt="BullMQ"/>
</p>

Backend API untuk platform ATHENA, dibangun dengan **NestJS** (berbasis Express.js) dan **TypeScript**. Menangani autentikasi, manajemen kredit, job queue pemrosesan 4A Shield, integrasi payment gateway, dan orkestrasi ML pipeline.

---

## Daftar Isi

- [Arsitektur](#arsitektur)
- [Tech Stack](#tech-stack)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [API Endpoints](#api-endpoints)
- [Module Structure](#module-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)

---

## Arsitektur

```mermaid
flowchart TB
    subgraph CLIENT["Client Layer"]
        Web["React PWA"]
        Mobile["React Native<br/>(Phase 2)"]
    end

    subgraph API["NestJS API Gateway"]
        Auth["Auth Module<br/>(Supabase JWT)"]
        Upload["Upload Module<br/>(Multer + Validation)"]
        Job["Job Module<br/>(BullMQ Producer)"]
        Credit["Credit Module<br/>(Transaction Manager)"]
        Payment["Payment Module<br/>(Midtrans)"]
        Shield["Shield Module<br/>(Hash Verification)"]
        Score["Score Module<br/>(ATHENA Score API)"]
    end

    subgraph WORKER["Background Workers"]
        QueueWorker["BullMQ Consumer<br/>(Job Processor)"]
        MLBridge["ML Bridge<br/>(Python Subprocess / Replicate API)"]
    end

    subgraph DATA["Data Layer"]
        PG["PostgreSQL<br/>(Supabase)"]
        Redis["Redis<br/>(Upstash)"]
        R2["Cloudflare R2<br/>(File Storage)"]
    end

    subgraph ML["ML Pipeline"]
        Replicate["Replicate.com<br/>(GPU Inference)"]
        PyWorker["Python Worker<br/>(CA-PGD + Ensemble)"]
    end

    Web --> Auth & Upload
    Mobile --> Auth & Upload
    Upload --> Job
    Job --> QueueWorker
    QueueWorker --> MLBridge
    MLBridge --> Replicate & PyWorker
    Credit --> Payment
    Auth --> PG
    Credit --> PG
    Job --> Redis
    Upload --> R2
    Shield --> PG

    style API fill:#1B2838,stroke:#C9A84C,color:#fff
    style WORKER fill:#2c3e50,stroke:#e74c3c,color:#fff
    style DATA fill:#1a3a2a,stroke:#2ecc71,color:#fff
    style ML fill:#3a1a3a,stroke:#9b59b6,color:#fff
```

---

## Tech Stack

| Layer | Teknologi | Peran |
|-------|-----------|-------|
| Framework | NestJS 11 + Express | Modular API framework, dependency injection, guards, pipes |
| Language | TypeScript (strict mode) | Type safety, maintainability, self-documenting code |
| Database | PostgreSQL via Supabase | Data persisten: users, jobs, credits, subscriptions |
| Cache & Queue | Redis via Upstash + BullMQ | Job queue, session cache, rate limiting |
| Auth | Supabase Auth (JWT) | Authentication, refresh tokens, row-level security |
| File Storage | Cloudflare R2 | Temporary encrypted file storage, presigned URLs |
| Payment | Midtrans | QRIS, GoPay, OVO, kartu kredit/debit |
| ML Inference | Replicate.com API | Pay-per-use GPU untuk CA-PGD + ensemble attack |
| Security | AES-256, ClamAV, magic bytes | Encryption at rest, virus scanning, format validation |
| Monitoring | BetterStack | Uptime monitoring, log aggregation, alerting |

---

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ JOB : "creates"
    USER ||--o{ CREDIT_TRANSACTION : "purchases"
    USER ||--o| SUBSCRIPTION : "subscribes to"
    USER ||--o{ AUDIT_LOG : "generates"
    JOB ||--|| SHIELD_RESULT : "produces"
    JOB }o--|| JOB_QUEUE : "enters"
    CREDIT_TRANSACTION }o--|| PAYMENT : "linked to"

    USER {
        uuid id PK "Supabase Auth UID"
        varchar email UK "User email"
        varchar name "Display name"
        varchar role "free | credit | pro | enterprise"
        integer credit_balance "Current credit count"
        integer daily_free_count "Free tier usage today"
        boolean is_verified "Email verification status"
        timestamp created_at
        timestamp updated_at
    }

    JOB {
        uuid id PK "Job identifier"
        uuid user_id FK "References USER"
        varchar status "pending | processing | completed | failed"
        varchar tier "free | credit | pro | enterprise"
        varchar shield_type "anti_ai | anti_nsfw | anti_deepfake | anti_training | full"
        varchar input_path "R2 encrypted path"
        varchar output_path "R2 result path"
        varchar shield_hash "Verifiable deletion hash"
        integer resolution "Max resolution applied"
        float processing_time "Seconds elapsed"
        jsonb metadata "Additional job metadata"
        timestamp created_at
        timestamp completed_at
        timestamp expires_at "Auto-delete timestamp"
    }

    SHIELD_RESULT {
        uuid id PK
        uuid job_id FK "References JOB"
        varchar shield_hash UK "Public verification hash"
        varchar athena_seal_id "Invisible watermark ID"
        jsonb perturbation_metrics "Epsilon, L-inf norm, model scores"
        boolean compression_aware "CA-PGD applied flag"
        varchar ensemble_models "Models used in attack"
        timestamp verified_at "Last verification timestamp"
    }

    CREDIT_TRANSACTION {
        uuid id PK
        uuid user_id FK "References USER"
        varchar type "purchase | consume | refund | bonus"
        integer amount "Credit amount (positive or negative)"
        integer balance_after "Balance after transaction"
        varchar description "Transaction description"
        uuid payment_id FK "References PAYMENT if purchase"
        timestamp created_at
    }

    SUBSCRIPTION {
        uuid id PK
        uuid user_id FK "References USER"
        varchar plan "pro_monthly | pro_yearly | enterprise"
        decimal price "Subscription price in IDR"
        timestamp start_date
        timestamp end_date
        boolean is_active
        boolean auto_renew
        varchar midtrans_subscription_id "Payment gateway reference"
        timestamp created_at
    }

    PAYMENT {
        uuid id PK
        uuid user_id FK "References USER"
        varchar midtrans_order_id UK "Midtrans order reference"
        varchar status "pending | settlement | expire | cancel | deny"
        decimal amount "Amount in IDR"
        varchar payment_type "qris | gopay | ovo | credit_card | bank_transfer"
        jsonb midtrans_response "Raw gateway response"
        timestamp created_at
        timestamp settled_at
    }

    AUDIT_LOG {
        uuid id PK
        uuid user_id FK "References USER"
        varchar action "upload | download | delete | verify | login"
        varchar resource_type "job | credit | subscription | shield"
        uuid resource_id "Referenced resource"
        varchar ip_address
        jsonb metadata
        timestamp created_at
    }

    JOB_QUEUE {
        uuid id PK
        uuid job_id FK "References JOB"
        varchar priority "low | normal | high | critical"
        integer attempts "Retry count"
        integer max_attempts "Max retries (default: 3)"
        varchar worker_id "Assigned worker"
        timestamp queued_at
        timestamp started_at
        timestamp completed_at
    }
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/api/v1/auth/register` | Registrasi user baru via Supabase | — |
| `POST` | `/api/v1/auth/login` | Login dan dapatkan JWT | — |
| `POST` | `/api/v1/auth/refresh` | Refresh access token | 🔑 |
| `GET` | `/api/v1/auth/me` | Profil user saat ini | 🔑 |
| `POST` | `/api/v1/auth/logout` | Invalidasi refresh token | 🔑 |

### Shield Processing (Core)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/api/v1/shield/process` | Upload foto dan mulai 4A Shield processing | 🔑 |
| `GET` | `/api/v1/shield/status/:jobId` | Cek status job (WebSocket juga tersedia) | 🔑 |
| `GET` | `/api/v1/shield/download/:jobId` | Download foto terproteksi (presigned URL) | 🔑 |
| `GET` | `/api/v1/shield/verify/:hash` | Verifikasi Shield Hash (publik) | — |
| `POST` | `/api/v1/shield/batch` | Batch upload untuk Enterprise tier | 🔑 |

### Credits & Payment

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/v1/credits/balance` | Cek saldo kredit user | 🔑 |
| `POST` | `/api/v1/credits/purchase` | Beli paket kredit (redirect Midtrans) | 🔑 |
| `GET` | `/api/v1/credits/history` | Riwayat transaksi kredit | 🔑 |
| `POST` | `/api/v1/payment/notification` | Midtrans webhook callback | — |

### Subscription

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/v1/subscription/current` | Detail langganan aktif | 🔑 |
| `POST` | `/api/v1/subscription/subscribe` | Subscribe ke Pro/Enterprise | 🔑 |
| `POST` | `/api/v1/subscription/cancel` | Batalkan langganan | 🔑 |

### ATHENA Score (Public Dashboard)

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/v1/score/overview` | Total foto terproteksi, estimasi dampak | — |
| `GET` | `/api/v1/score/leaderboard` | Leaderboard komunitas paling aktif | — |
| `GET` | `/api/v1/score/breakdown` | Breakdown per kota dan kategori | — |

---

## Module Structure

```
src/
├── app.module.ts                  ← Root module
├── main.ts                        ← Bootstrap & global config
│
├── common/                        ← Shared utilities
│   ├── decorators/                ← Custom decorators (@CurrentUser, @Roles)
│   ├── filters/                   ← Exception filters (HttpException, Validation)
│   ├── guards/                    ← Auth guard (JWT), Role guard, Throttle guard
│   ├── interceptors/              ← Logging, Transform response
│   ├── pipes/                     ← Validation pipe, ParseUUID
│   └── dto/                       ← Shared DTOs (pagination, response wrapper)
│
├── auth/                          ← Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/                ← JWT strategy (Supabase)
│   └── dto/                       ← LoginDto, RegisterDto
│
├── shield/                        ← Core 4A Shield processing
│   ├── shield.module.ts
│   ├── shield.controller.ts
│   ├── shield.service.ts
│   ├── shield.gateway.ts          ← WebSocket gateway (real-time progress)
│   ├── processors/                ← BullMQ job processors
│   └── dto/                       ← ProcessDto, BatchDto
│
├── credit/                        ← Credit management
│   ├── credit.module.ts
│   ├── credit.controller.ts
│   └── credit.service.ts
│
├── payment/                       ← Midtrans integration
│   ├── payment.module.ts
│   ├── payment.controller.ts
│   └── payment.service.ts
│
├── subscription/                  ← Subscription management
│   ├── subscription.module.ts
│   ├── subscription.controller.ts
│   └── subscription.service.ts
│
├── score/                         ← ATHENA Score dashboard API
│   ├── score.module.ts
│   ├── score.controller.ts
│   └── score.service.ts
│
├── storage/                       ← Cloudflare R2 integration
│   ├── storage.module.ts
│   └── storage.service.ts
│
├── audit/                         ← Audit logging
│   ├── audit.module.ts
│   └── audit.service.ts
│
└── config/                        ← Configuration module
    ├── config.module.ts
    ├── database.config.ts
    ├── redis.config.ts
    ├── supabase.config.ts
    └── midtrans.config.ts
```

---

## Environment Variables

```env
# Application
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Redis (Upstash)
REDIS_URL=redis://default:password@endpoint.upstash.io:6379

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=athena-uploads
R2_PUBLIC_URL=https://your-r2-domain.com

# Midtrans
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_IS_PRODUCTION=false

# Replicate (ML Inference)
REPLICATE_API_TOKEN=your-replicate-token

# Security
ENCRYPTION_KEY=your-256-bit-encryption-key
ALLOWED_ORIGINS=http://localhost:5173,https://athena.id

# Monitoring
BETTERSTACK_SOURCE_TOKEN=your-betterstack-token
```

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Redis instance (atau [Upstash](https://upstash.com) untuk serverless)
- PostgreSQL instance (atau [Supabase](https://supabase.com) free tier)

### Installation

```bash
# Clone dan masuk ke direktori
cd TEKNIS/back_end

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Jalankan development server
npm run start:dev
```

Server akan berjalan di `http://localhost:3000`.

---

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run start` | Jalankan production server |
| `npm run start:dev` | Jalankan development server (watch mode) |
| `npm run start:debug` | Jalankan dengan debug mode |
| `npm run build` | Build untuk production |
| `npm run test` | Jalankan unit tests |
| `npm run test:e2e` | Jalankan end-to-end tests |
| `npm run test:cov` | Jalankan tests dengan coverage report |
| `npm run lint` | Lint codebase |

---

<p align="center">
  <sub>ATHENA Backend — Built with NestJS + TypeScript</sub><br>
  <sub>FIKSI 2026 | Teknologi Digital</sub>
</p>
