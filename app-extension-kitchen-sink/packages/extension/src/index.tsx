import { createExtension, useIdentityEvent, useIdentityExtend } from '@stackable-labs/sdk-extension-react'
import { Header } from './surfaces/Header'
import { Content } from './surfaces/Content'
import { Footer } from './surfaces/Footer'

const Extension = () => {
  // Identity events — react to login/logout
  useIdentityEvent('identity.login', (event) => {
    console.log('[kitchen-sink] User logged in:', event.state.user?.email)
  })

  useIdentityEvent('identity.logout', () => {
    console.log('[kitchen-sink] User logged out')
  })

  // Identity enrichment — add claims to the JWT before signing
  useIdentityExtend((claims) => ({
    external_id: `demo_${claims.external_id}`,
    reservation_status: 'permanent_dishwasher',
    chef_rating: 'cant_boil_water',
  }))

  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  )
}

createExtension(() => <Extension />, { extensionId: '__EXTENSION_ID__' })
