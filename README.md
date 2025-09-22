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

## GitHub Project Board Export

This application includes functionality to export user stories and project items from GitHub project boards. The feature integrates with GitHub's GraphQL API to fetch project data and provides export capabilities in CSV, JSON, and XML formats.

### Configuration

To use the GitHub project export feature, you need to set up a GitHub Personal Access Token:

1. Create a personal access token at https://github.com/settings/tokens
2. Grant the following permissions:
   - `repo` (for accessing repository data)
   - `read:project` (for accessing project boards)
3. Add the token to your environment variables:
   ```bash
   GITHUB_TOKEN=your_github_token_here
   ```

### Usage

1. Navigate to `/github-export` in the application
2. Click the "GitHub Project Export" button
3. Choose your preferred export format (CSV, JSON, or XML)
4. The project board data will be downloaded automatically

The export includes:
- Issue and pull request details
- Custom field values from the project board
- Assignees and labels
- Creation and update timestamps
- Project status information

## More Information

For more information about the entire project, visit [AVefi Project](https://projects.tib.eu/av-efi).
