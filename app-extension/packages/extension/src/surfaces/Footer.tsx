import { ui, Surface } from '@stackable-labs/sdk-extension-react'

export function Footer() {
  return (
    <>
      <Surface id="slot.footer">
        <ui.Text className="text-xs">Powered by My Extension</ui.Text>
      </Surface>
      <Surface id="slot.footer-links">
        <ui.FooterLink href="https://example.com">My Extension</ui.FooterLink>
      </Surface>
    </>
  )
}
