import { ExtensionProvider, ExtensionSlot } from '@stackable-labs/sdk-extension-host'
import type { CapabilityHandlers } from '@stackable-labs/sdk-extension-host'
import { hostComponents } from '@stackable-labs/embeddables/components'
import type {
  ActionInvokePayload,
  ApiRequest,
  ExtensionRegistryEntry,
  Permission,
  ToastPayload,
} from '@stackable-labs/sdk-extension-contracts'
import manifestRaw from '../../extension/public/manifest.json'
import mockData from './mockData.json'

const manifest = {
  ...manifestRaw,
  permissions: manifestRaw.permissions as Permission[],
}

const extensions: ExtensionRegistryEntry[] = [
  {
    id: manifest.name.toLowerCase().replace(/\s+/g, '-'),
    manifest,
    bundleUrl: `http://localhost:${import.meta.env.VITE_EXTENSION_PORT || '5173'}`,
    enabled: true,
  },
]

const mockContext = {
  customerId: 'cust_preview_123',
  customerEmail: 'preview@example.com',
}

const capabilityHandlers: CapabilityHandlers = {
  'data.query': async (_payload: ApiRequest) => {
    return mockData
  },
  'actions.toast': async (payload: ToastPayload) => {
    console.log('[Preview] toast:', payload)
  },
  'actions.invoke': async (payload: ActionInvokePayload) => {
    console.log('[Preview] action invoke:', payload)
    return {}
  },
  'context.read': async () => mockContext,
}

export default function App() {
  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 16 }}>
      <ExtensionProvider
        extensions={extensions}
        components={hostComponents()}
        capabilityHandlers={capabilityHandlers}
      >
        {manifest.targets.map((target) => (
          <div key={target} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: '#888' }}>{target}</div>
            <ExtensionSlot target={target} context={mockContext} />
          </div>
        ))}
      </ExtensionProvider>
    </div>
  )
}
