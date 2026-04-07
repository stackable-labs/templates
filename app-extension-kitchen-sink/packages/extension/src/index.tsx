import { useCallback } from 'react'
import { createExtension, useIdentityEvent, useExtendIdentity, useMessagingEvent, useActivityEvent } from '@stackable-labs/sdk-extension-react'
import type { ExtendIdentityHandler } from '@stackable-labs/sdk-extension-contracts'
import { Header } from './surfaces/Header'
import { Content } from './surfaces/Content'
import { Footer } from './surfaces/Footer'

const Extension = () => {
  // Identity events — react to login/logout
  useIdentityEvent('login', (event) => {
    console.log('[kitchen-sink] User logged in:', event.data.state.user?.email)
  })

  useIdentityEvent('logout', () => {
    console.log('[kitchen-sink] User logged out')
  })

  // Messaging events — react to postback button clicks
  useMessagingEvent('postback:add_to_cart', (event) => {
    console.log('[kitchen-sink] Postback:', event.data.actionName, event.data.conversationId)
  })

  // Activity events — react to host activity (e.g., product views, page navigation)
  useActivityEvent('product_view', (event) => {
    console.log('[kitchen-sink] Product viewed:', event.data.productId)
  })

  // Identity enrichment — add claims to the JWT before signing
  // Use useCallback with ExtendIdentityHandler type for memoized handlers
  const handleExtend = useCallback<ExtendIdentityHandler>((claims) => ({
    external_id: `demo_${claims.external_id}`,
    reservation_status: 'permanent_dishwasher',
    chef_rating: 'cant_boil_water',
  }), [])
  useExtendIdentity(handleExtend)

  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  )
}

createExtension(() => <Extension />, { extensionId: '__EXTENSION_ID__' })
