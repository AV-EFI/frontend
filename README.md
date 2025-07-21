# AVefi Frontend

![AVefi Logo](/public/img/avefi_logo_lg.jpg)

---

## Prerequisites

### ✅ Docker (for Production or Dev)
- Install Docker: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

---

## 🐳 Docker Usage

### 🚀 Production Build & Run

1. **Build the production image and start the container**:
   ```bash
   docker compose up --build
   ```

2. The app will be available at [http://localhost:3000](http://localhost:3000)

> This uses the `Dockerfile`, performs a full Nuxt production build, and runs `node .output/server/index.mjs`

3. **Stop the container**:
   ```bash
   docker compose down
   ```

---

### 🔁 Development with HMR (Hot Module Replacement)

This setup uses `Dockerfile.dev` and `docker-compose.dev.yml`.

1. **Start the development container**:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

2. Visit [http://localhost:3000](http://localhost:3000) — changes to `.vue`/`.ts` files will reload automatically.

3. Vite HMR uses port `24678`, exposed in the dev Docker Compose config.

4. **Stop all running containers**:
   ```bash
   docker compose -f docker-compose.dev.yml down
   ```

> If you're on Windows/WSL2, file watching uses polling for compatibility. The following is included in `nuxt.config.ts`:
>
> ```ts
> vite: {
>   server: {
>     watch: { usePolling: true, interval: 100 },
>     hmr: { port: 24678, host: 'localhost' }
>   }
> }
> ```

> The container also mounts a named volume for `/app/node_modules` to avoid host-container conflicts:
>
> ```yaml
> volumes:
>   - .:/app
>   - node_modules:/app/node_modules
> ```

---

## 🖥️ Local Development (Non-Docker)

1. **Install Node.js 18.x**: [https://nodejs.org/](https://nodejs.org/)
2. **Install Yarn (Berry)**: [https://yarnpkg.com/getting-started/install](https://yarnpkg.com/getting-started/install)
3. **Install dependencies**:
   ```bash
   yarn install
   ```

4. **Start dev server**:
   ```bash
   yarn dev
   ```

5. **Build for production**:
   ```bash
   yarn build
   ```

6. **Preview production build locally**:
   ```bash
   yarn preview
   ```

---

## 🧹 Troubleshooting

### Kill all Node.js processes (e.g., if ports are blocked or `.node` files are locked):

- **Windows**:
  ```powershell
  taskkill /F /IM node.exe
  ```

- **macOS/Linux**:
  ```bash
  pkill -f node
  ```

### Clear Yarn artifacts if install errors occur:
```bash
rm -rf node_modules .yarn/cache .yarn/install-state.gz
yarn cache clean
yarn install
```

---

## 📦 Deployment

The production container builds with `yarn build` and serves the app via Node.js.  
For other environments (e.g. static hosting or serverless), consult Nuxt’s deployment docs:

🔗 [Nuxt Deployment Guide](https://nuxt.com/docs/getting-started/deployment)

---

## 🔗 More Information

For more information about the entire project, visit the  
🔗 [AVefi Project Website](https://projects.tib.eu/av-efi)