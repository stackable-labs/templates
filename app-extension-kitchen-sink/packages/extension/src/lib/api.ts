/**
 * Example API wrapper functions demonstrating data.fetch and data.query capabilities.
 * Replace these with your actual API integrations.
 */
import type { FetchResponse } from '@stackable-labs/sdk-extension-contracts'

type DataCapabilities = {
  fetch: (url: string, init?: { method?: string; headers?: Record<string, string>; body?: unknown }) => Promise<FetchResponse>
  query: <T = unknown>(payload: { endpoint: string; params?: Record<string, string> }) => Promise<T>
}

/** Example: fetch a REST API endpoint via data.fetch (proxied through host) */
export const fetchOrder = async (data: DataCapabilities, orderId: string): Promise<FetchResponse> =>
  data.fetch(`https://api.example.com/orders/${orderId}`)

/** Example: query backend data via data.query (host-mediated) */
export const queryCustomer = async <T = unknown>(data: DataCapabilities, customerId: string): Promise<T> =>
  data.query<T>({ endpoint: 'customers', params: { id: customerId } })
