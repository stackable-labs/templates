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
- **Extension** — `http://localhost:6543` (configured via `VITE_EXTENSION_PORT`)
- **Preview host** — `http://localhost:6544` (configured via `VITE_PREVIEW_PORT`)

The preview host loads your extension in an iframe sandbox, simulating how it will run in production.

## Development

Edit files in `packages/extension/src/` — changes hot-reload automatically.

Each file in `packages/extension/src/surfaces/` corresponds to a target slot defined in `manifest.json`. The extension entry point (`index.tsx`) registers surfaces for each target.

### Preview with tunnels

```bash
pnpm preview
```

Runs the full CLI dev experience — starts Vite dev servers, opens Cloudflare tunnels, and displays a **Host App Query Param** you can append to your deployed host app URL to test the extension in your real environment. No database changes are made; each developer gets isolated overrides via their own browser session.

See the [CLI docs](https://www.npmjs.com/package/@stackable-labs/cli-app-extension) for details.

## Configuration

- **`manifest.json`** — Extension metadata, targets, permissions, and allowed domains
- **`.env`** — Development server ports
- **`turbo.json`** — Turborepo task orchestration

### manifest.json fields

- **`permissions`** — Capability permissions required by your extension. Include `"data:fetch"` if you call `capabilities.data.fetch(...)`.
- **`allowedDomains`** — Hostname allowlist for `data.fetch` egress, e.g. `["api.myservice.com"]`.
  - Use hostnames only (no protocol/path).
  - Default is an empty array (`[]`), which allows no external fetch targets.

Example:

```json
{
  "name": "My Extension",
  "version": "1.0.0",
  "targets": ["slot.header", "slot.content"],
  "permissions": ["context:read", "data:query", "data:fetch", "actions:toast", "actions:invoke"],
  "allowedDomains": ["api.myservice.com"]
}
```

### data.fetch usage

```tsx
const { data } = useCapabilities()

const result = await data.fetch({
  url: 'https://api.myservice.com/orders/123',
  method: 'GET',
})

if (result.ok) {
  console.log(result.data)
}
```

Security model: `data.fetch` requests are sent through the platform proxy, which validates the target URL hostname against your extension's `allowedDomains`. Authentication for your backend is owned by the extension developer (for example, by attaching your own auth headers/tokens).

## Learn More

- [Stackable Extension SDK](https://www.npmjs.com/package/@stackable-labs/sdk-extension-react)
- [Stackable Labs](https://stackablelabs.com/)
