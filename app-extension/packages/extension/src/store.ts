import { createStore } from '@stackable-labs/sdk-extension-react'

export type ViewState = { type: 'menu' }

export interface AppState {
  viewState: ViewState
}

export const appStore = createStore<AppState>({
  viewState: { type: 'menu' },
})
