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

## AI Agent Skills

This project includes [Agent Skills](https://agentskills.io) — SDK reference and guided workflows that AI coding assistants (Claude Code, Cursor, Windsurf, and 40+ others) can use to help you build extensions.

### Claude Code Plugin (recommended)

Install the **Stackable Extension Dev** plugin for always-up-to-date skills and live platform API access:

```bash
/plugin marketplace add stackable-labs/claude-plugins
/plugin install stackable-extension-dev@stackable-claude-plugins
```

### Local files (all editors)

Skills are included automatically when you scaffold a new project. To update them to the latest version:

```bash
pnpm dlx skills add stackable-labs/skills
```

For platform-specific AI editor configs (`.claude/`, `.cursor/`, `.windsurf/`, etc.):

```bash
pnpm --config.dlx-cache-max-age=0 dlx @stackable-labs/cli-app-extension ai scaffold
```

> When run inside Claude Code, `ai scaffold` auto-detects and offers the plugin setup path.

## Configuration

- **`manifest.json`** — Extension metadata, targets, permissions, and allowed domains
- **`.env`** — Development server ports
- **`turbo.json`** — Turborepo task orchestration

### manifest.json fields

- **`permissions`** — Capability permissions required by your extension. Include `"data:fetch"` if you call `capabilities.data.fetch(...)`.
- **`allowedDomains`** — Hostname allowlist for `data.fetch` egress, e.g. `["api.myservice.com"]`.
  - Use hostnames only (no protocol/path).
  - Default is an empty array (`[]`), which allows no external fetch targets.
- **`settingsSchema`** — Optional array of configurable fields that instance owners fill in per-installation. Supports `text`, `textarea`, `email`, `number`, `select`, `radio`, and `toggle` field types. Fields with `"secret": true` are encrypted at rest and injected server-side via `{{settings.xxx}}` placeholders in `data.fetch` headers — they never enter extension code.

Example:

```json
{
  "name": "My Extension",
  "version": "1.0.0",
  "targets": ["slot.header", "slot.content"],
  "permissions": ["context:read", "data:query", "data:fetch", "actions:toast", "actions:invoke", "extend:identity", "events:identity", "events:messaging", "events:activity"],
  "events": ["identity:login", "identity:logout", "messaging:postback:add_to_cart", "activity:product_view"],
  "allowedDomains": ["api.myservice.com"],
  "settingsSchema": [
    { "identifier": "apiKey", "label": "API Key", "type": "text", "secret": true, "required": true },
    { "identifier": "environmentType", "label": "Environment", "type": "select", "options": [
      { "label": "Production", "value": "prod" },
      { "label": "Sandbox", "value": "sandbox" }
    ]}
  ]
}
```

### data.fetch usage

```tsx
const { data } = useCapabilities()

const result = await data.fetch('https://api.myservice.com/orders/123', {
  method: 'POST',
  body: { limit: 10 },
})

if (result.ok) {
  console.log(result.data)
}
```
```tsx
const { data } = useCapabilities()

const result = await data.fetch('https://api.myservice.com/orders/123')

if (result.ok) {
  console.log(result.data)
}
```

Security model: `data.fetch` requests are sent through the platform proxy, which validates the target URL hostname against your extension's `allowedDomains`.

### Secret injection via placeholders

For API keys and tokens, use `{{settings.xxx}}` placeholders in header values. The proxy resolves them server-side — **the real secret never enters extension code**.

```tsx
const result = await data.fetch('https://api.myservice.com/orders', {
  headers: {
    'X-API-Key': '{{settings.apiKey}}',
    'Authorization': 'Bearer {{settings.token}}',
  },
})
```

### Reading non-secret settings

Non-secret settings are available via `useSettings()` or `useContextData()`:

```tsx
import { useSettings } from '@stackable-labs/sdk-extension-react'

const settings = useSettings()
const env = settings.environmentType as string // 'prod' or 'sandbox'
```

Settings propagate on page load — changes made in the admin dashboard take effect on the next page reload.

## Identity

### Identity Events (`events:identity`)

Subscribe to real-time identity events (login, logout, refresh, expired) pushed from the host. Requires `events:identity` permission and matching entries in the manifest `events` array.

```tsx
import { useIdentityEvent } from '@stackable-labs/sdk-extension-react'

useIdentityEvent('login', (event) => {
  console.log('User logged in:', event.data.state.user?.email)
})
```

### Identity Enrichment (`extend:identity`)

Enrich JWT claims before the host signs the identity token. Requires `extend:identity` permission.

```tsx
import { useExtendIdentity } from '@stackable-labs/sdk-extension-react'

useExtendIdentity((claims) => ({
  external_id: `custom_${claims.external_id}`,
}))
```

For memoized handlers (e.g. with `useCallback`), import the `ExtendIdentityHandler` type:

```tsx
import { useCallback } from 'react'
import { useExtendIdentity } from '@stackable-labs/sdk-extension-react'
import type { ExtendIdentityHandler } from '@stackable-labs/sdk-extension-contracts'

const handleExtend = useCallback<ExtendIdentityHandler>((claims) => ({
  external_id: `custom_${claims.external_id}`,
}), [])
useExtendIdentity(handleExtend)
```

### Identity via Context

Identity state is available in the `context.read()` response as an `identity` field (requires `context:read`, no separate permission):

```tsx
const context = await capabilities.context.read()
// context.identity → { authenticated, user, expiresAt? }
```

## Messaging

### Messaging Events (`events:messaging`)

Subscribe to messaging events (e.g. postback button clicks from Zendesk bots). Requires `events:messaging` permission and matching entries in the manifest `events` array.

```tsx
import { useMessagingEvent } from '@stackable-labs/sdk-extension-react'

useMessagingEvent('postback:add_to_cart', (event) => {
  console.log('Postback:', event.data.actionName, event.data.conversationId)
})
```

For memoized handlers, import the `MessagingEventHandler` type:

```tsx
import { useCallback } from 'react'
import { useMessagingEvent } from '@stackable-labs/sdk-extension-react'
import type { MessagingEventHandler } from '@stackable-labs/sdk-extension-contracts'

const handlePostback = useCallback<MessagingEventHandler>((event) => {
  console.log('Postback:', event.data.actionName, event.data.conversationId)
}, [])
useMessagingEvent('postback:add_to_cart', handlePostback)
```

Subscription types: `'postback'` (all postbacks, requires elevated review/approval) or `'postback:<actionName>'` (specific postback).

> **Note:** Only `postback`-type buttons fire the `postbackButtonClicked` event. The Zendesk bot builder's "Present options" step creates `reply`-type buttons which do **not** trigger this event. Use the [Sunshine Conversations API](https://docs.smooch.io/rest/) to send messages with `{ "type": "postback", "text": "Button Label", "payload": "action_name" }` actions, or use the "Present carousel" step in the bot builder.
>
> **Important:** The `actionName` in the event is the button's display **text** (e.g. `"Add to cart"`), NOT the postback `payload` string (e.g. `"add_to_cart"`). The payload is not exposed by the Zendesk Web Widget — it's only available server-side via Sunshine Conversations webhooks. Design your `events` manifest entries to match button text: `"messaging:postback:Add to cart"`.
>
> To send postback buttons via the Sunshine Conversations API:
> ```bash
> # Direct API (requires Sunco API keys from Admin Center → APIs → Conversations API)
> curl -X POST "https://api.smooch.io/v2/apps/{appId}/conversations/{conversationId}/messages" \
>   -u '{keyId}:{keySecret}' -H "Content-Type: application/json" \
>   -d '{"author":{"type":"business"},"content":{"type":"text","text":"Choose:","actions":[{"type":"postback","text":"Add to cart","payload":"add_to_cart"}]}}'
>
> # Or via Zendesk proxy (uses Zendesk OAuth or email/token auth — no separate Sunco keys)
> curl -X POST "https://{subdomain}.zendesk.com/sc/v2/apps/{appId}/conversations/{conversationId}/messages" \
>   -H "Authorization: Bearer {oauth_token}" -H "Content-Type: application/json" \
>   -d '{"author":{"type":"business"},"content":{"type":"text","text":"Choose:","actions":[{"type":"postback","text":"Add to cart","payload":"add_to_cart"}]}}'
> ```

## Activity

### Activity Events (`events:activity`)

Subscribe to host activity events (page views, product views, clicks, etc.). Requires `events:activity` permission and matching entries in the manifest `events` array.

```tsx
import { useActivityEvent } from '@stackable-labs/sdk-extension-react'

useActivityEvent('product_view', (event) => {
  console.log('Product viewed:', event.data.productId)
})
```

With `useCallback` (for memoized handlers):
```tsx
import { useCallback } from 'react'
import { useActivityEvent } from '@stackable-labs/sdk-extension-react'
import type { ActivityEventHandler } from '@stackable-labs/sdk-extension-contracts'

const handleActivity = useCallback<ActivityEventHandler>((event) => {
  console.log('Product viewed:', event.data.productId)
}, [])
useActivityEvent('product_view', handleActivity)
```

Event types: any string (domain-stripped). Well-known names: `'page_view'`, `'click'`, `'product_view'`, `'add_to_cart'`, `'purchase'`, `'search'`, `'form_submit'`. Use `'*'` to receive all activity events.

## Learn More

- [Stackable Extension SDK](https://www.npmjs.com/package/@stackable-labs/sdk-extension-react)
- [Stackable Labs](https://stackablelabs.com/)
