# AVefi Frontend

![AVefi Logo](/public/img/avefi_logo_lg.jpg)

This is the frontend for the [AVefi Project](https://projects.tib.eu/av-efi), built with Nuxt 3 and Vue 3.

---

## 🚀 Quick Start

### ▶️ Local Development

1. **Install Node.js 18+**  
   👉 [Download Node.js](https://nodejs.org/)

2. **Install Yarn 2+**  
   👉 [Yarn Installation Guide](https://yarnpkg.com/getting-started/install)

3. **Install dependencies**  
   ```bash
   yarn install
   ```

4. **Start the development server**  
   ```bash
   yarn dev
   ```

   App runs at: [http://localhost:3000](http://localhost:3000)

---

## 🐳 Docker Setup

### Production
```bash
docker compose up --build
```

### Development
```bash
docker compose -f docker-compose.dev.yml up --build --watch
```

---

## 📦 Build Commands

| Task               | Command        |
|--------------------|----------------|
| Build for prod     | `yarn build`   |
| Preview prod build | `yarn preview` |

More info: [Nuxt Deployment Documentation](https://nuxt.com/docs/getting-started/deployment)

---

## 📚 Composables Documentation

This project uses [TypeDoc](https://typedoc.org/) to generate documentation for all core Vue composables.

### Generate docs

```bash
yarn typedoc
```

- Output is saved in: `docs/composables/index.html`
- Configuration: `typedoc.json`
- Only composables in `/composables` are documented

---

## ℹ️ More Information

For further project context and backend components, visit the full AVefi project page:

👉 [https://projects.tib.eu/av-efi](https://projects.tib.eu/av-efi)
