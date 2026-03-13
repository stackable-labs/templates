import { ui, Surface, useContextData } from '@stackable-labs/sdk-extension-react'

export function Header() {
  const { loading } = useContextData()

  if (loading) {
    return (
      <Surface id="slot.header">
        <ui.Skeleton className="h-8 w-full" />
      </Surface>
    )
  }

  return (
    <Surface id="slot.header">
      <ui.Inline gap="2" align="center">
        <ui.Icon name="sparkles" size="sm" />
        <ui.Text className="font-medium">Kitchen Sink</ui.Text>
        <ui.Badge variant="default">Head Chef</ui.Badge>
        <ui.Tooltip content="Everything on the menu — and the kitchen sink. Hover states work too, obviously.">
          <ui.Icon name="info" size="sm" />
        </ui.Tooltip>
      </ui.Inline>
    </Surface>
  )
}
