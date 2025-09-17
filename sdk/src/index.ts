// src/index.ts

// Default export
import { CypherProvider } from './providers/CypherProvider'
export default CypherProvider

// Named exports
export * from './components/WalletList'
export * from './providers/CypherProvider'
export * from './lib/config'
export * from './hooks/useAuth'
export * from './hooks/useUserProfile'

export * from './constants/navLinks'
export * from './types'
export * from './lib/authFetch'
export * from './api/users'
export * from './api'

// Pages
export { default as WalletsPage } from './pages/Wallets'
export { default as PrivateRoute } from './pages/PrivateRoute'

// Optional Chakra Theme
// export { walletTheme } from './providers/ThemeProvider'
