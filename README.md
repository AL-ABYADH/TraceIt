# TraceIt

TraceIt is a web application for **modeling, managing, and visualizing traceability** between software artifacts during the analysis phase. Artifacts are stored in a central repository and can be composed into diagrams that remain linked to their source artifacts.

---

## Quick Overview

* **Define Artifacts:** Actors, Use Cases, Requirements (with conditions and exceptions).
* **Assemble Diagrams:** Select shapes from a palette; selected shapes appear on the canvas pre-filled with artifacts fetched from the backend.
* **Real-Time Traceability:** Changes propagate across all linked diagrams.

---

## Technology Stack

### Core

* **Next.js** — Frontend framework
* **NestJS** — Backend framework
* **Neo4j** — Graph database

### Monorepo & Tooling

* **pnpm** — Package manager
* **Turborepo** — Monorepo build system

### Libraries

* **React**, **Redux Toolkit**
* **Mantine**, **React Flow (@xyflow/react)**
* **Zod** — Shared schema validation

---

## Getting Started

### Prerequisites

* Node.js v18+
* pnpm v9+

---

### Clone & Install

```bash
git clone <repository-url>
cd TraceIt
pnpm install
```

---

### Database (Neo4j)

Use Neo4j Desktop or follow Neo4j official installation instructions for your platform. Ensure you have a running Neo4j instance accessible to the backend (Bolt port typically 7687).

---

## Environment Configuration

### Backend (`apps/server`)

```bash
cd apps/server
cp .env.example .env
```

Edit `apps/server/.env` (example keys):

```env
NEO4J_CONNECTION_SCHEME=bolt
NEO4J_HOST=localhost
NEO4J_SERVICE_PORT_EXPOSE=7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=<your-password>
NEO4J_DATABASE=neo4j

JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=604800

COOKIE_SECURE=false
COOKIE_DOMAIN=127.0.0.1
```

### Frontend (`apps/web`)

```bash
cd apps/web
cp .env.example .env
```

Set API base URL:

```env
API_BASE_URL=http://127.0.0.1:8000
```

---

## Generate JWT Keys

From project root:

```bash
pnpm --filter server run generate:keys
```

This populates `JWT_SECRET` and `JWT_REFRESH_SECRET` in `apps/server/.env`. To regenerate:

```bash
pnpm --filter server run update:keys
```

---

## Build Local Packages

```bash
pnpm build
```

Builds local packages in `packages/` required by the apps (for example `@repo/custom-neogma`, `@repo/shared-schemas`).

---

## Run

### Development

```bash
pnpm dev
```

* Backend: `http://127.0.0.1:3000` (as configured)
* Frontend: `http://127.0.0.1:8000`
* Hot-reload enabled

### Production

```bash
pnpm build
pnpm start
```

Ensure environment variables and database connection are set for the production environment.

---

## TraceIt Workflow

1. **Define Artifacts** — Create Actors, Use Cases, Requirements (including conditions and exceptions).
2. **Assemble Diagrams** — Open a diagram canvas, select a shape from the palette; the selected shape appears on the canvas pre-filled with the corresponding artifact fetched from the backend.
3. **Maintain Traceability** — Changes to artifacts update all linked diagrams; deletions cascade to dependent items.

---

## Host Configuration (Requirement)

Ensure host/address values used for cookies and API endpoints are consistent:

* `apps/server/.env` → `COOKIE_DOMAIN`
* `apps/web/.env` → `API_BASE_URL`
* The browser URL used to access the frontend should match the chosen host (e.g., `127.0.0.1` vs `localhost`).

---

