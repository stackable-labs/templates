import { useCallback } from 'react'
import { createExtension, useCapabilities, useIdentityEvent, useExtendIdentity, useMessagingEvent, useActivityEvent } from '@stackable-labs/sdk-extension-react'
import type { ExtendIdentityHandler } from '@stackable-labs/sdk-extension-contracts'
import { Header } from './surfaces/Header'
import { Content } from './surfaces/Content'
import { Footer } from './surfaces/Footer'

const Extension = () => {
  const capabilities = useCapabilities()

  // Identity events — react to login/logout
  useIdentityEvent('login', (event) => {
    console.log('[kitchen-sink] User logged in:', event.data.state.user?.email)
  })

  useIdentityEvent('logout', () => {
    console.log('[kitchen-sink] User logged out')
  })

  // identity:refresh fires after capabilities.identity.extend() — any extension
  // with events:identity + 'identity:refresh' in manifest.events receives the
  // updated state. Read post-login enrichments here, NOT just in 'login'.
  useIdentityEvent('refresh', (event) => {
    console.log('[kitchen-sink] Identity refreshed — metadata:', event.data.state.user?.metadata)
  })

  // Messaging events — react to postback button clicks.
  // Also demonstrates capabilities.identity.extend(patch) — push a new claim
  // imperatively. Host filters against manifest.identityClaims, merges into
  // user.metadata, re-signs the JWT, broadcasts identity:refresh.
  useMessagingEvent('postback:add_to_cart', async (event) => {
    console.log('[kitchen-sink] Postback:', event.data.actionName, event.data.conversationId)
    await capabilities.identity.extend({
      chef_endorsed: true,    // declared in manifest.identityClaims
    })
  })

  // Activity events — react to host activity (e.g., product views, page navigation)
  useActivityEvent('product_view', (event) => {
    console.log('[kitchen-sink] Product viewed:', event.data.productId)
  })

  // Identity enrichment at INITIAL login — claims land in BOTH the signed JWT
  // and identityState.user.metadata. For post-login async updates, prefer
  // capabilities.identity.extend(patch) (see useMessagingEvent above).
  //
  // Standard JWT claims (external_id, email, name) are always allowed as overrides.
  // Custom keys MUST be declared in manifest.identityClaims or they're dropped with a warn.
  // Read declared claims from any extension via useContextData().identity.user.metadata.<key>.
  // Use useCallback with ExtendIdentityHandler type for memoized handlers.
  const handleExtend = useCallback<ExtendIdentityHandler>((claims) => ({
    external_id: `demo_${claims.external_id}`,                  // standard claim override
    reservation_status: 'permanent_dishwasher',                 // declared in manifest.identityClaims
    chef_rating: 'cant_boil_water',                             // declared in manifest.identityClaims
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
