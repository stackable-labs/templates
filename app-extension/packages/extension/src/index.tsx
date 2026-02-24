import { createExtension } from '@stackable-labs/sdk-extension-react'
import { Header } from './surfaces/Header'
import { Content } from './surfaces/Content'
import { Footer } from './surfaces/Footer'

createExtension(
  () => (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  ),
  { extensionId: '__EXTENSION_ID__' },
)
