import { createExtension } from '@stackable-labs/sdk-extension-react'
import { Content } from './surfaces/Content'

createExtension(
  () => <Content />,
  { extensionId: '__EXTENSION_ID__' },
)
