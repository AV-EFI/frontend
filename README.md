# AVefi Frontend

> **This repository is part of the AVefi project.**  
> It includes the Nuxt 3 frontend with full Docker support for local development and production deployment.

---

## 📦 Production Setup

In production, all containers run in a shared Docker network. Traefik acts as the reverse proxy.  
The **frontend is prebuilt into a production Docker container** and served as a Node.js app.

- Traefik routes frontend requests (`/`) to the container `av-efi-frontend`
- Backend requests (`/api/v1/`, `/auth/`, etc.) are routed separately
- The frontend is served via Nuxt’s `.output/server/index.mjs`

### Run production setup (including reverse proxy)

1. Build and start the full stack (Traefik + Frontend + Backend):
   ```bash
   docker compose up -d --build
   ```

2. Open in browser:
   ```
   http://localhost:8080/
   ```

> Do **not** access `localhost:3000` in production. The only correct entry point is through Traefik on port 8080.

---

## 💻 Local Development Setup

To work on the frontend code with hot module replacement (HMR), you must run a **dummy container named `av-efi-frontend`** to simulate the production network.

This is necessary because Traefik expects a container with that name for service routing.

---

### ✅ Prerequisites

- Docker Desktop (with WSL2 if on Windows)
- VPN connection to GWDG **must be active** to retrieve backend and Elasticsearch data
- Nuxt development server runs on your **host machine**
- The dummy container **proxies** to `host.docker.internal:3000`

---

### 🚀 Start local development

```bash
docker compose -f docker-compose.dev.yml up -d
```

This creates a lightweight dummy container called `av-efi-frontend`:

```yaml
version: "3.8"

services:
  av-efi-frontend:
    image: alpine/socat
    container_name: av-efi-frontend
    command: tcp-listen:3000,fork,reuseaddr tcp-connect:${DEV_FORWARD_HOST:-host.docker.internal}:${DEV_FORWARD_PORT:-3000}
    extra_hosts:
      - "host.docker.internal:host-gateway"
    networks:
      - proxy-network
    restart: unless-stopped

networks:
  proxy-network:
    name: proxy-network
    external: true
```

---

### 🛠️ Then run Nuxt on the host machine

```bash
yarn install
yarn dev
```

Nuxt will be served locally at:

```
http://localhost:3000/
```

**But you must access it through Traefik:**

```
http://localhost:8080/
```

> If you open `localhost:3000` directly, you **bypass Traefik** and backend/API routes will fail.

If `http://localhost:8080/` returns `502 Bad Gateway` while `http://localhost:3000/` works, the problem is the Docker forwarding hop, not Nuxt itself.

Check in this order:

1. Restart the dummy proxy container:
   ```bash
   docker compose -f docker-compose.dev.yml down
   docker compose -f docker-compose.dev.yml up -d
   ```

2. If Docker Desktop still cannot reach `host.docker.internal`, override the forward target explicitly:
   ```powershell
   $env:DEV_FORWARD_HOST="192.168.2.32"
   docker compose -f docker-compose.dev.yml up -d
   ```

3. If you need a non-default port:
   ```powershell
   $env:DEV_FORWARD_HOST="192.168.2.32"
   $env:DEV_FORWARD_PORT="3000"
   docker compose -f docker-compose.dev.yml up -d
   ```

Use your actual host IP from `ipconfig`, not the example above.

---

## 🔁 If You Just Want to Check the Frontend

If you don't need to edit the code or use HMR:

```bash
docker compose up --build
```

Then open:

```
http://localhost:8080/
```

---

## 🧹 Troubleshooting

### 🔄 Clear stale Node/Vite locks

```bash
rm -rf node_modules .yarn/cache .yarn/install-state.gz
yarn cache clean
yarn install
```

### ❌ Kill all Node.js processes (Windows)

```powershell
taskkill /F /IM node.exe
```

---

## 📁 File Overview & Comments

### `docker-compose.dev.yml`

Dummy container for Nuxt local development, required to keep Traefik routing intact.

### `nuxt.config.ts`

Includes `vite.hmr.port = 24678` and `watch.usePolling` for file reload in WSL2/Docker.

### `traefik.yaml` or `traefik_dynamic.yaml`

Example snippet for routing:

```yaml
http:
  routers:
    local-home:
      entryPoints: [local]
      rule: "Host(`localhost`)"
      service: home

  services:
    home:
      loadBalancer:
        servers:
          - url: "http://av-efi-frontend:3000"
```

---

## 🔗 External Docs

- [Nuxt Deployment Docs](https://nuxt.com/docs/getting-started/deployment)
- [Socat for Docker proxy](https://stackoverflow.com/questions/24365317/how-can-i-access-docker-host-machine-from-container)

---

## 🧪 Testing and Data-Quality Reports

This repository has two test families:

- product behavior tests (unit + e2e)
- Elasticsearch data-quality reporting tests (non-blocking)

Quick commands:

```bash
yarn test:ci:fast
yarn test:ci:api
yarn test:data-quality:report
```

Human-readable explanation of the data-quality suite:

- it is a reporting suite, not a deployment gate
- it checks for patterns that usually indicate quality risk (missing fields, malformed IDs, placeholder-like titles, duplicate identifiers)
- heuristic findings are warning signals for triage and sampling, not guaranteed defects
- output is written as markdown so each stakeholder can read only the view they need

Generated outputs:

- `logs/data-quality/quality-statistics.md`: full technical report
- `logs/data-quality/quality-failing-identifiers.md`: sampled failing document handles per rule
- `logs/data-quality/quality-snapshot.json`: trend baseline/deltas
- `logs/data-quality/stakeholders/*.md`: focused stakeholder views (frontend-ux, backend, data-engineer, project-manager, data-delivering-institutions)

For detailed test structure and environment knobs, see `tests/README.md`.

---

## ✅ Summary

| Environment        | Access URL               | Use Case                    |
|--------------------|---------------------------|------------------------------|
| 🐳 Production       | `http://localhost:8080/` | Full setup with reverse proxy |
| 🛠 Local Dev (Nuxt) | `http://localhost:8080/` | Via dummy container + Nuxt HMR |
| ⛔ Wrong Access     | `http://localhost:3000/` | ❌ Bypasses Traefik — no API |

---

© AVefi Project 2025
