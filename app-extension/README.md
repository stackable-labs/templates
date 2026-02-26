# Stackable Extension

A [Stackable Labs](https://stackablelabs.com/) extension project scaffolded with [`@stackable-labs/cli-app-extension`](https://www.npmjs.com/package/@stackable-labs/cli-app-extension).

## Project Structure

```
├── packages/
│   ├── extension/       # Extension source code
│   │   ├── src/
│   │   │   ├── surfaces/   # UI surfaces for each target slot
│   │   │   └── index.tsx    # Extension entry point
│   │   └── vite.config.ts
│   └── preview/         # Local preview host app
│       ├── src/
│       │   └── App.tsx      # Preview app with capability handlers
│       └── vite.config.ts
├── .env                 # Port configuration
├── turbo.json           # Turborepo task config
└── pnpm-workspace.yaml
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development servers (extension + preview)
pnpm dev
```

This starts two dev servers:
- **Extension** — `http://localhost:5173` (configured via `VITE_EXTENSION_PORT`)
- **Preview host** — `http://localhost:5174` (configured via `VITE_PREVIEW_PORT`)

The preview host loads your extension in an iframe sandbox, simulating how it will run in production.

## Development

Edit files in `packages/extension/src/` — changes hot-reload automatically.

Each file in `packages/extension/src/surfaces/` corresponds to a target slot defined in `manifest.json`. The extension entry point (`index.tsx`) registers surfaces for each target.

## Configuration

- **`manifest.json`** — Extension metadata, targets, and permissions
- **`.env`** — Development server ports
- **`turbo.json`** — Turborepo task orchestration

## Learn More

- [Stackable Extension SDK](https://www.npmjs.com/package/@stackable-labs/sdk-extension-react)
- [Stackable Labs](https://stackablelabs.com/)
