# Kitchen Sink Extension Template

Everything on the menu — and the kitchen sink. A reference extension that demonstrates every UI component, SDK capability, and hook available in the Stackable extension SDK.

Scaffolded by `npx @stackable-labs/cli-app-extension create --template kitchen-sink`

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

## SDK Capabilities

All 5 capabilities are used and declared in `manifest.json`:

| Permission | Capability | Where Used |
|---|---|---|
| `context:read` | `useContextData()` | Header (loading state + customer info) |
| `data:query` | `data.query()` | Declared in manifest (available for extensions to use) |
| `data:fetch` | `data.fetch(url, init?)` | Order Takeout (GET), Bring da Check (POST), Lock it In (POST with form state) |
| `actions:toast` | `actions.toast(payload)` | Multiple buttons — success, info variants |
| `actions:invoke` | `actions.invoke(action, payload?)` | Ring the Service Bell, Add a Round (`newConversation`) |

## SDK Hooks

| Hook | Where Used |
|---|---|
| `useContextData()` | Header + Content — provides `loading` flag and context data |
| `useCapabilities()` | Content — returns `{ data, actions }` for calling capabilities |
| `useStore(store, selector)` | Content — subscribes to `appStore` slices for controlled form fields |

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
