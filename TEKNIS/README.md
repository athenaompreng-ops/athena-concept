# ⚙️ Teknis — Arsitektur & Implementasi ATHENA

Folder ini berisi seluruh komponen teknis proyek ATHENA, mulai dari dokumen konteks hingga source code backend dan frontend.

---

## Struktur

```
TEKNIS/
├── konteks.md          ← Dokumen konteks teknis lengkap ATHENA
├── back_end/           ← NestJS + TypeScript — API Server
└── front_end/          ← Vite + React + TypeScript — Web Client (PWA)
```

| Komponen | Teknologi | Deskripsi |
|----------|-----------|-----------|
| [Konteks Teknis](./konteks.md) | Markdown | Dokumen lengkap yang mencakup filosofi, arsitektur, model bisnis, dan roadmap ATHENA |
| [Backend API](./back_end/) | NestJS, TypeScript, PostgreSQL, Redis | Server-side API: auth, job queue, payment, ML pipeline orchestration |
| [Frontend Client](./front_end/) | Vite, React, TypeScript | Progressive Web App: UI/UX, client-side 4A Shield (TF.js), real-time dashboard |

---

## Arsitektur Sistem — Tiga Jalur Pemrosesan

ATHENA menggunakan arsitektur **tiga jalur** yang dirancang untuk skenario penggunaan yang berbeda:

```mermaid
flowchart TB
    subgraph USER["👤 Pengguna"]
        Upload["Upload Foto"]
    end

    subgraph FREE["JALUR A — Free Tier"]
        direction TB
        TFjs["TensorFlow.js<br/>(Browser)"]
        ClientShield["4A Shield Ringan<br/>Client-Side"]
        Download1["⬇️ Download<br/>30-90 detik"]
    end

    subgraph PAID["JALUR B — Paid Tier"]
        direction TB
        ServerUpload["Encrypted Upload<br/>(AES-256)"]
        Queue["Priority Queue<br/>(BullMQ + Redis)"]
        GPU["GPU Worker<br/>(Replicate.com)"]
        CAPGD["CA-PGD + Ensemble<br/>(ResNet-50 + VGG-19 + ViT-B/16)"]
        Seal["Athena Seal<br/>(Invisible Watermark)"]
        Download2["⬇️ Download<br/>15-45 detik"]
    end

    subgraph BULK["JALUR C — Enterprise"]
        direction TB
        BatchUpload["Batch Upload<br/>(10-500 foto)"]
        AsyncQueue["Async Processing<br/>Background"]
        Notify["📧 Notifikasi<br/>Email / Push"]
        Download3["⬇️ Download Link"]
    end

    Upload --> TFjs
    Upload --> ServerUpload
    Upload --> BatchUpload

    TFjs --> ClientShield --> Download1
    ServerUpload --> Queue --> GPU --> CAPGD --> Seal --> Download2
    BatchUpload --> AsyncQueue --> Notify --> Download3

    style FREE fill:#1a3a2a,stroke:#2ecc71,color:#fff
    style PAID fill:#1a2a3a,stroke:#3498db,color:#fff
    style BULK fill:#3a2a1a,stroke:#e67e22,color:#fff
```

## Pipeline 4A Shield

Empat lapisan perlindungan yang bekerja secara sinergis:

```mermaid
flowchart LR
    Input["📷 Foto Input"] --> A1

    subgraph SHIELD["4A Shield Pipeline"]
        A1["🛡️ Anti-AI<br/>Facial Recognition<br/>Blocking"]
        A2["🚫 Anti-NSFW<br/>Manipulation<br/>Prevention"]
        A3["🎭 Anti-Deepfake<br/>Synthesis Data<br/>Disruption"]
        A4["🔒 Anti-Training<br/>Dataset Poisoning<br/>for Cultural IP"]
    end

    A1 --> A2 --> A3 --> A4

    A4 --> Output["✅ Foto Terproteksi<br/>+ Athena Seal"]

    style SHIELD fill:#1B2838,stroke:#C9A84C,color:#fff
    style Input fill:#2c3e50,stroke:#ecf0f1,color:#fff
    style Output fill:#27ae60,stroke:#ecf0f1,color:#fff
```

## Entity Relationship Diagram (Preview)

ERD lengkap tersedia di [dokumentasi backend](./back_end/README.md). Berikut adalah preview:

```mermaid
erDiagram
    USER ||--o{ JOB : creates
    USER ||--o{ CREDIT_TRANSACTION : purchases
    USER ||--o| SUBSCRIPTION : subscribes
    JOB ||--|| SHIELD_RESULT : produces
    JOB }o--|| JOB_QUEUE : enters

    USER {
        uuid id PK
        string email
        string name
        string role
        int credit_balance
        timestamp created_at
    }

    JOB {
        uuid id PK
        uuid user_id FK
        string status
        string tier
        string input_path
        string output_path
        string shield_hash
        timestamp created_at
        timestamp completed_at
    }

    SUBSCRIPTION {
        uuid id PK
        uuid user_id FK
        string plan
        timestamp start_date
        timestamp end_date
        boolean is_active
    }
```

---

## Quick Start

### Backend

```bash
cd back_end
npm install
cp .env.example .env    # Configure environment variables
npm run start:dev        # Development server at http://localhost:3000
```

### Frontend

```bash
cd front_end
npm install
cp .env.example .env    # Configure environment variables
npm run dev             # Development server at http://localhost:5173
```

> Lihat README masing-masing folder untuk dokumentasi detail.

---

<p align="center">
  <sub>ATHENA — Advanced Threat Handling & Encryption Network Application</sub><br>
  <sub>FIKSI 2026 | Teknologi Digital</sub>
</p>
