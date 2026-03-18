import { createExtension } from '@stackable-labs/sdk-extension-react'
import { Content } from './surfaces/Content'

const Extension = () => <Content />

createExtension(() => <Extension />, { extensionId: '__EXTENSION_ID__' })
