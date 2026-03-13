import { ui, Surface } from '@stackable-labs/sdk-extension-react'

export function Footer() {
  return (
    <>
      <Surface id="slot.footer">
        <ui.Inline gap="2">
          <ui.Text className="text-xs" tone="muted">Kitchen Sink Extension</ui.Text>
          <ui.Text className="text-xs" tone="muted">Now serving components in all 4 surfaces</ui.Text>
        </ui.Inline>
      </Surface>
      <Surface id="slot.footer-links">
        <ui.FooterLink href="https://docs.stackablelabs.io">Docs</ui.FooterLink>
        <ui.FooterLink href="https://github.com/stackable-labs">GitHub</ui.FooterLink>
      </Surface>
    </>
  )
}
