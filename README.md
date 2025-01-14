# AVefi Frontend

![AVefi Logo](/public/img/avefi_logo_lg.jpg)

## Prerequisites

### Docker / Production

1. **Install Docker**: [Download Docker](https://www.docker.com/products/docker-desktop) and follow the installation instructions.
2. **Run Docker Compose**: In the project directory, run:
    ```bash
    docker compose up --build
    ```

### Local Development

1. **Install Node.js and npm**: [Download Node.js 18.x](https://nodejs.org/).
2. **Install Yarn**: [Install Yarn 2+](https://yarnpkg.com/getting-started/install).

### Docker Development

1. **Install Docker**: Follow the Docker installation instructions above.
2. **Run Docker Compose for Development**: In the project directory, run:
    ```bash
    docker compose -f docker-compose.dev.yml up --build --watch
    ```

### Local Commands

Install dependencies:
```bash
npm install
pnpm install
yarn install
bun install
```

### Development Server

Start the server at `http://localhost:3000`:
```bash
npm run dev
pnpm run dev
yarn dev
bun run dev
```

Build for production:
```bash
npm run build
pnpm run build
yarn build
bun run build
```

Preview production build:
```bash
npm run preview
pnpm run preview
yarn preview
bun run preview
```

[Deployment documentation]
(https://nuxt.com/docs/getting-started/deployment)

## More Information

For more information about the entire project, visit [AVefi Project](https://projects.tib.eu/av-efi).
