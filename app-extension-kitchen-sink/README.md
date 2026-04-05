# Kitchen Sink Extension Template

Everything on the menu — and the kitchen sink. A reference extension that demonstrates every UI component, SDK capability, and hook available in the Stackable extension SDK.

Scaffolded by `pnpm --config.dlx-cache-max-age=0 dlx @stackable-labs/cli-app-extension create --template kitchen-sink`

## Project Structure

```
packages/extension/src/
  index.tsx          # createExtension() entry point — renders Header, Content, Footer
  store.ts           # Shared app state via createStore() — reservation form fields
  surfaces/
    Header.tsx       # slot.header — branding, badges, tooltips, skeleton loading
    Content.tsx      # slot.content — 3-tab layout with all components and capabilities
    Footer.tsx       # slot.footer + slot.footer-links — text and external links
```

## Surfaces & Components

### Header (`slot.header`)

Demonstrates: `useContextData`, `Surface`, `ui.Inline`, `ui.Icon`, `ui.Text`, `ui.Badge`, `ui.Tooltip`, `ui.Skeleton`

- Loading skeleton while context data resolves
- Extension name with icon, badge, and info tooltip

### Content (`slot.content`)

The main surface — a `ui.Tabs` layout with three tabs.

#### Specials tab

Demonstrates: `ui.Menu`, `ui.MenuItem`, `ui.Alert`, `ui.Stack`, `ui.Text`

| Menu Item | Capability Used |
|---|---|
| See What's Cooking | `actions.toast` (info) |
| Ring the Service Bell | `actions.invoke('newConversation')` + `actions.toast` (success) |
| Order Takeout | `data.fetch` GET + `actions.toast` |

Also includes a destructive `ui.Alert` variant.

#### "The Spread" tab

Demonstrates: `ui.Card`, `ui.CardHeader`, `ui.CardContent`, `ui.Heading`, `ui.Inline`, `ui.Text`, `ui.Badge` (with `hue` prop), `ui.Separator`, `ui.Progress`, `ui.Alert`, `ui.Collapsible`, `ui.CollapsibleTrigger`, `ui.CollapsibleContent`, `ui.Button`, `ui.Stack`

| Button | Capability Used |
|---|---|
| Add a Round | `actions.invoke('newConversation')` |
| Bring da Check | `data.fetch` POST |

Nested card inside collapsible demonstrates component composition.

#### Next Rez tab

Demonstrates: `ui.ScrollArea`, `ui.Label`, `ui.Input`, `ui.Textarea`, `ui.Select`, `ui.SelectOption`, `ui.Button` (pill selectors), `ui.Switch`, `ui.RadioGroup`, `ui.RadioGroupItem`, `ui.Inline`, `ui.Link`, `ui.Icon`

All form fields are **controlled** via `appStore` / `useStore`:

| Field | Store Key | Component |
|---|---|---|
| Name | `name` | `ui.Input` |
| Dietary Notes | `dietaryNotes` | `ui.Textarea` |
| Occasion | `occasion` | `ui.Select` |
| Party Size | `partySize` | `ui.Button` pills |
| Time | `time` | `ui.Button` pills |
| Waitlist | `waitlist` | `ui.Switch` |
| Seating | `seating` | `ui.RadioGroup` |

| Button | Capability Used |
|---|---|
| Lock it In | `data.fetch` POST (sends full form state) + `actions.toast` |

### Footer (`slot.footer` + `slot.footer-links`)

Demonstrates: `ui.Inline`, `ui.Text`, `ui.FooterLink`

- Footer text with muted tone
- External links to Docs and GitHub

## AI Agent Skills

This project includes [Agent Skills](https://agentskills.io) — SDK reference and guided workflows that AI coding assistants (Claude Code, Cursor, Windsurf, and 40+ others) can use to help you build extensions.

Skills are included automatically when you scaffold a new project. To update them to the latest version:

```bash
pnpm dlx skills add stackable-labs/skills
```

For platform-specific AI editor configs (`.claude/`, `.cursor/`, `.windsurf/`, etc.):

```bash
pnpm --config.dlx-cache-max-age=0 dlx @stackable-labs/cli-app-extension ai scaffold
```

## Identity

The kitchen-sink template demonstrates both identity capabilities in `index.tsx`:

### Identity Events (`events:identity`)

Subscribe to real-time identity events pushed from the host platform. Requires `events:identity` permission and matching entries in the manifest `events` array.

```tsx
import { useIdentityEvent } from '@stackable-labs/sdk-extension-react'

useIdentityEvent('identity.login', (event) => {
  console.log('User logged in:', event.state.user?.email)
})

useIdentityEvent('identity.logout', () => {
  console.log('User logged out')
})
```

Event types: `identity.login`, `identity.logout`, `identity.refresh`, `identity.expired`

### Identity Enrichment (`extend:identity`)

Enrich JWT claims before the host signs the identity token. Requires `extend:identity` permission.

```tsx
import { useExtendIdentity } from '@stackable-labs/sdk-extension-react'

useExtendIdentity((claims) => ({
  external_id: `demo_${claims.external_id}`,
}))
```

### Identity via Context

Identity state is also available in the `context.read()` response as an `identity` field (requires `context:read`, no separate permission):

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
  console.log('Postback:', event.actionName, event.conversationId)
})
```

Event subscription types: `'postback'` (all postbacks, requires elevated review) or `'postback:<actionName>'` (specific postback).

## SDK Capabilities

All capabilities are used and declared in `manifest.json`:

| Permission | Capability | Where Used |
|---|---|---|
| `context:read` | `useContextData()` | Header (loading state + customer info) |
| `data:query` | `data.query()` | Declared in manifest (available for extensions to use) |
| `data:fetch` | `data.fetch(url, init?)` | Order Takeout (GET), Bring da Check (POST), Lock it In (POST with form state) |
| `actions:toast` | `actions.toast(payload)` | Multiple buttons — success, info variants |
| `actions:invoke` | `actions.invoke(action, payload?)` | Ring the Service Bell, Add a Round (`newConversation`) |
| `extend:identity` | `useIdentityExtend(handler)` | Entry point — enriches JWT claims |
| `events:identity` | `useIdentityEvent(type, handler)` | Entry point — logs login/logout events |
| `events:messaging` | `useMessagingEvent(type, handler)` | Entry point — logs postback button clicks |

## SDK Hooks

| Hook | Where Used |
|---|---|
| `useContextData()` | Header + Content — provides `loading` flag and context data |
| `useCapabilities()` | Content — returns `{ data, actions, extend }` for calling capabilities |
| `useStore(store, selector)` | Content — subscribes to `appStore` slices for controlled form fields |
| `useExtendIdentity(handler)` | Entry point — enriches identity JWT claims before signing |
| `useIdentityEvent(type, handler)` | Entry point — subscribes to identity login/logout events |
| `useMessagingEvent(type, handler)` | Entry point — subscribes to messaging postback events |

## Shared State

`store.ts` uses `createStore()` to create a shared in-memory store accessible from all surfaces:

```ts
interface AppState {
  name?: string
  dietaryNotes?: string
  occasion?: string
  partySize: string        // required — default '2'
  time: string             // required — default '7:00'
  waitlist?: boolean
  seating?: string
}
```

- **Read**: `useStore(appStore, (s) => s.partySize)` — reactive, re-renders on change
- **Write**: `appStore.set({ partySize: '4' })` — merges partial state
- **Read (non-reactive)**: `appStore.get()` — snapshot for fire-and-forget (e.g. POST body)
