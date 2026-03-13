import { ui, Surface } from '@stackable-labs/sdk-extension-react'

export function Content() {
  return (
    <Surface id="slot.content">
      <ui.Text>Hello from __EXTENSION_DISPLAY_NAME__</ui.Text>
    </Surface>
  )
}
