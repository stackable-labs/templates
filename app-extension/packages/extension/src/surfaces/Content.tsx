import { ui, useStore, useContextData, Surface } from '@stackable-labs/sdk-extension-react'
import { appStore } from '../store'

export function Content() {
  const viewState = useStore(appStore, (s) => s.viewState)
  const { loading } = useContextData()

  if (loading) {
    return (
      <Surface id="slot.content">
        <ui.Stack direction="column" gap="2" className="animate-pulse">
          <ui.Card className="h-24" />
          <ui.Card className="h-32" />
        </ui.Stack>
      </Surface>
    )
  }

  return (
    <Surface id="slot.content">
      {viewState.type === 'menu' && (
        <ui.Menu>
          {/* Add ui.MenuItem entries here */}
        </ui.Menu>
      )}
    </Surface>
  )
}
