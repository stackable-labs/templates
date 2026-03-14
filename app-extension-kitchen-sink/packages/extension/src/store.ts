import { createStore } from '@stackable-labs/sdk-extension-react'

export interface AppState {
  name?: string
  dietaryNotes?: string
  occasion?: string
  partySize: string
  time: string
  waitlist?: boolean
  seating?: string
  billTotal: number
}

export const appStore = createStore<AppState>({
  name: '',
  dietaryNotes: '',
  occasion: 'none',
  partySize: '2',
  time: '7:00',
  waitlist: false,
  seating: 'indoor',
  billTotal: 300,
})
