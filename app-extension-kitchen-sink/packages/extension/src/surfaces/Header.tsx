import { ui, Surface, useContextData } from '@stackable-labs/sdk-extension-react'

export function Header() {
  const { loading, customerEmail } = useContextData()

  if (loading) {
    return (
      <Surface id="slot.header">
        <ui.Skeleton className="h-8 w-full" />
      </Surface>
    )
  }

  return (
    <Surface id="slot.header">
      <ui.Stack direction="row" gap="2" className="items-center">
        <ui.Avatar src="" alt={customerEmail ?? 'Unknown'} />
        <ui.Stack direction="column" gap="0">
          <ui.Text className="font-medium">{customerEmail ?? 'Unknown'}</ui.Text>
          <ui.Text className="text-xs" tone="muted">Valued Customer</ui.Text>
        </ui.Stack>
        <ui.Badge variant="secondary">Head Chef</ui.Badge>
        <ui.Tooltip content="Everything on the menu — and the kitchen sink. Hover states work too, obviously.">
          <ui.Icon name="info" size="sm" />
        </ui.Tooltip>
      </ui.Stack>
    </Surface>
  )
}
