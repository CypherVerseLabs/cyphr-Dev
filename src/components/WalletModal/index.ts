// sdk/src/components/index.ts

export { WalletList } from './WalletList'
export { SocialLoginButton } from '../LoginOnboarding/SocialLoginButton'
export { EmailLogin } from '../LoginOnboarding/EmailLogin'
export { default as DarkModeToggle } from '../DarkModeToggle'
export { default as Footer } from './components/Footer'
export { default as WalletManager } from '../../pages/WalletManager'

// Local files (default exports or named exports)
export { default as ConnectButton } from '../ConnectButton'
export { default as ModalHeader } from './components/ModalHeader'
export { WelcomeMenu as LoginOptions } from './cards/WelcomeMenu'  // <-- named export
export { default as ConnectedUserMenu } from './cards/ConnectedUserMenu'
export { CreateApiKeyModal } from './cards/CreateApiKeyModal'
