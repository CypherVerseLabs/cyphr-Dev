
// Default export (optional)
export { CypherProvider } from './providers/CyphrProvider'

// Core modules
export * from './api'
export * from './chains'
export * from './contexts'
export * from './hooks'
export * from './lib/config'
export * from './providers'
export * from './rpc'
export * from './utils'
export * from './types'

// Specific functions/types
export * from './lib/createCyphrClient'
export { fetchUserProfile } from './api/users'
export type { UserProfile } from './api/users'

// ✅ UI Components (exposed to consumers)
export { CypherModal } from './components/ConnectModal'

export { default as ConnectButtonUI } from './components/WalletModal/components/ConnectButtonUi'
export { default as ConnectModalRightPane } from './components/WalletModal/components/ConnectModalRightPane'
export { default as ConnectModalRightPaneProps } from './components/WalletModal/components/ConnectModalRightPane'


// (Optional) Component wrappers or helpers
// export { CypherWalletProvider } from './components/CypherWalletProvider'
