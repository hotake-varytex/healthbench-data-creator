# Setup Guide

Quick guide to get HealthBench Data Creator running locally.

## Prerequisites

Before you begin, install:

- **Node.js 18.17 or later**
- **npm** (bundled with Node.js) or **yarn** / **pnpm**
- **Git**

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/healthbench-data-creator.git
cd healthbench-data-creator
```

### 2. Install Dependencies

```bash
npm install
# or yarn install / pnpm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### 4. Build for Production

```bash
npm run build
npm start
```

The optimized production build will run on [http://localhost:3000](http://localhost:3000).

## Common Scripts

- Type check: `npm run type-check`
- Lint: `npm run lint`
- Format check: `npm run format:check`

## Troubleshooting

- Port 3000 in use: `npm run dev -- -p 3001`
- Install issues: clear cache `npm cache clean --force`, remove `node_modules`/`package-lock.json`, reinstall.
- Type errors: confirm `node --version` is 18.17+.

## Notes

- Data stays in browser localStorage; export JSONL for backup.
- No environment variables required in MVP.
- Dark mode is not yet implemented (see ROADMAP.md).

More details: [README.md](./README.md) and [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md).
