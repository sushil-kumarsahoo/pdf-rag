# PDF-RAG: AI-Powered PDF Assistant

A full-stack, production-ready Retrieval-Augmented Generation (RAG) application that lets you upload PDF documents and have intelligent conversations with them using Google Gemini and Qdrant Vector Database.

---

## 🛠️ Tech Stack

- **Frontend (`/client`)**: Next.js 16 (React 19, Turbopack, Tailwind CSS v4, Clerk Authentication, Lucide Icons).
- **Backend API (`/server`)**: Bun + Express 5, Multer file upload, BullMQ job queue.
- **Worker (`server/worker.ts`)**: Background BullMQ worker using LangChain, `text-embedding-004`, and Qdrant.
- **AI & Vector Search**: Google Gemini (`gemini-2.0-flash`), Google Embeddings (`text-embedding-004`), Qdrant Vector DB.
- **Infrastructure**: Valkey (Redis-compatible queue), Docker & Docker Compose.

---

## 📋 Prerequisites

Make sure you have installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended for 1-command startup)
- [Bun](https://bun.sh/) (if running locally without Docker)

You will also need:
1. **Google Gemini API Key**: from [Google AI Studio](https://aistudio.google.com/)
2. **Clerk Auth Keys**: from [Clerk Dashboard](https://clerk.com/)

---

## ⚙️ Environment Setup

Before starting, create the `.env` files for the server and client.

### 1. Server Configuration (`server/.env`)
Create a file at `server/.env` with:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Qdrant Vector DB (Default local inside Docker / localhost)
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# (Optional) If using Qdrant Cloud:
# QDRANT_URI=https://your-cluster.qdrant.io
```

### 2. Client Configuration (`client/.env`)
Create a file at `client/.env` with:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
```

---

## 🚀 How to Run

### Method 1: Run Everything with Docker (Recommended)

Run this single command from the project root:

```bash
docker-compose up --build
```

Docker will build and start all **5 services** automatically:
- 🌐 **Frontend (Next.js)**: [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend API (Express)**: [http://localhost:8000](http://localhost:8000)
- 🗄️ **Qdrant Vector DB Dashboard**: [http://localhost:6333/dashboard](http://localhost:6333/dashboard)
- ⚡ **Valkey (Redis Queue)**: `localhost:6379`
- 👷 **Background Worker**: running in container to ingest and embed PDFs

#### Useful Docker commands:
- **Run in background (detached)**:
  ```bash
  docker-compose up -d
  ```
- **View logs**:
  ```bash
  docker-compose logs -f
  ```
- **Stop all containers**:
  ```bash
  docker-compose down
  ```

---

### Method 2: Run Locally (Without Docker Containers for Code)

If you prefer developing directly on your machine with hot-reloading:

#### 1. Start Database & Queue in Docker:
```bash
docker-compose up valkey qdrant -d
```

#### 2. Start the Backend API:
In a new terminal:
```bash
cd server
bun install
bun run dev
```
*(Runs on port 8000)*

#### 3. Start the Background Worker:
In a separate terminal:
```bash
cd server
bun run dev:worker
```

#### 4. Start the Frontend:
In a separate terminal:
```bash
cd client
bun install
bun run dev
```
*(Runs on [http://localhost:3000](http://localhost:3000))*

---

## 🔄 Application Architecture & Workflow

```
[ User Browser ]
       │
       ├── 1. Uploads PDF ────────► [ Express Server (:8000) ]
       │                                      │
       │                              Enqueues Job to BullMQ
       │                                      │
       │                                      ▼
       │                            [ Valkey / Redis Queue ]
       │                                      │
       │                               Worker pulls Job
       │                                      ▼
       │                            [ Background Worker ]
       │                                      │
       │                         - Splits text into chunks
       │                         - Generates embeddings (text-embedding-004)
       │                         - Indexes vectors into Qdrant
       │                                      ▼
       │                            [ Qdrant Vector DB ]
       │                                      ▲
       └── 2. Asks Question                   │
               │                              │
               ▼                              │
        [ Express Server ] ── Queries similar chunks ──┘
               │
          Sends context + query to Gemini (gemini-2.0-flash)
               │
               ▼
        Returns AI answer with source document citations to user
```

---

## 🛡️ Security Note

- **Never commit `.env` files to GitHub.** Both `client/.env` and `server/.env` are already listed in `.gitignore`.
- Use the provided `server/.env.example` and `client/.env.example` templates when sharing the project with others.
