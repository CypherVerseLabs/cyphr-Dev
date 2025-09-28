🪙 WalletList – Production Wallet Connector UI

A Chakra UI + wagmi-powered component for securely connecting Ethereum wallets, supporting multiple connectors and optional chain switching (no auto-add).

📦 Installation

Ensure your project has:

npm install wagmi viem @chakra-ui/react


Also, install your connectors (optional):

npm install @rainbow-me/rainbowkit @web3modal/ethereum wagmi viem

📂 File Structure
components/
├── WalletList.tsx      // Main connector list
└── WalletApps.tsx      // Reusable button per wallet
public/
└── wallets/
    └── cyph.svg        // Optional wallet icons

✅ Basic Usage
'use client'

import React from 'react'
import { WalletList } from './components/WalletList'

export default function ConnectWalletScreen() {
  return (
    <WalletList
      chainId={5150} // Example: Hardhat localnet
      onSelect={() => console.log('Wallet connected')}
      onDisconnect={() => console.log('Disconnected')}
    />
  )
}

💡 Features

✅ Supports injected wallets, WalletConnect, Coinbase Wallet, etc.

⚙️ Chain switch only, no auto-add for safety

🎨 Customizable UI using Chakra props

🚫 SSR-safe ('use client' ready for Next.js App Router)

🧠 Memoized chain switching

📸 Optional icon detection via iconId and /public/wallets/

⚙️ Chain Switching

The component:

Checks if the user is on the wrong chain

Attempts to switch using wallet_switchEthereumChain

If unsupported or rejected, does nothing else

💡 It does not auto-add chains, but you can modify this safely if needed.

📸 Auto Icon Support

To enable wallet logos:

Place an icon in /public/wallets/, e.g.:

public/wallets/cyph.svg
public/wallets/metamask.svg


Pass iconId="cyph" or iconId="metamask" to the <WalletApps /> button.

🧩 Custom Connector Example
<WalletApps
  connector={connector}
  iconId="metamask"
  name="MetaMask"
  onClick={handleConnect}
  isLoading={isConnecting}
  disabled={isConnecting}
/>

🧪 Testing

All buttons include:

data-testid="disconnect-wallet-button"

data-testid="connect-{connector.id}"

This enables easy E2E and unit testing.

🔒 Security Considerations

Never auto-switch or auto-add chains silently without user action.

Always validate window.ethereum is available before calling.

Provide feedback if connection fails.

🧰 Extend / Customize

You can extend WalletList or WalletApps to:

Add tooltips

Show connected address

Show balance

Trigger modals after connect

9/27/2005

✅ Customizations Available
🔘 1. Modal Button

Text: buttonText

Color: themeColor

Text Color: buttonTextColor

Hover Color: computed from .600 and .400 of themeColor

🧱 2. Modal Structure

Modal Size: modalSize

Modal Background: modalBg

Modal Text Color: modalTextColor

Highlight Color (e.g. gold): highlightColor

Dark/light mode support: via themeOverride

🪟 3. Left & Right Panes
Pane	Customizable With	Defaults If Not Set
Left Content	leftContent	Wallet connection components
Right Content	rightContent	WelcomeRightContent component
Left BG	leftPaneBg	Fallback to modal bg
Right BG	rightPaneBg	'gray.900' (dark) / 'gray.50' (light)
Widths	leftPaneWidth, rightPaneWidth	'300px' and '400px'
Padding	panePadding	6 (theme spacing unit)
📌 4. Header & Footer

Header content: headerContent replaces the default ModalHeader

Footer content: footerContent replaces the default Footer

📷 5. WelcomeRightContent Customization

The WelcomeRightContent component used as fallback has full prop support:

imageUrl, title, subtitle

imageSize, titleFontSize, subtitleFontSize, subtitleColor, spacing, paddingX

You’re already passing:

<WelcomeRightContent
  imageUrl="https://avatars.githubusercontent.com/u/143012744?v=4&size=64"
  title="Welcome!"
  subtitle="Let’s get started"
  imageSize="250px"
  titleFontSize="3xl"
  subtitleFontSize="lg"
  subtitleColor="gray.600"
  spacing={4}
  paddingX={8}
/>


This is dynamic and fully customizable. ✅

✅ Summary: What Is NOT Hardcoded Anymore?

✅ No color, spacing, layout, or content is hardcoded

✅ Everything has a prop or fallback that can be overridden

✅ Component can be themed globally or locally

🧪 Final Recommendation

To ensure reusability, document these props so other developers can easily use and override them.

You might also want to:

Allow dynamic height (modalHeight prop)

Accept modalTitle or titleContent for better header control

Let me know if you'd like help with those or if you'd like me to generate usage examples for your devs/docs.

You said:
make read me
ChatGPT said:

Here's a clear and developer-friendly README.md for your customizable ConnectModal component. It covers installation, usage, props, and examples.

# 🪙 ConnectModal (Cyphr Wallet UI)

A fully customizable wallet connection modal built with **React**, **Chakra UI**, and **Wagmi**. Designed to be flexible and themeable for modern dApps.

---

## 🚀 Features

- 🧩 Fully customizable layout (left pane, right pane, header, footer)
- 🎨 Theme-aware (light/dark)
- 🎯 Custom colors, widths, and paddings
- 📷 Pluggable images and logos
- 🔐 Handles wallet auth, logout, ENS name, and token management

---

## 📦 Installation

```bash
# Chakra UI & Wagmi required
npm install @chakra-ui/react @emotion/react framer-motion wagmi react-icons


⚠️ Make sure ChakraProvider is set up at the root of your app.

📋 Props
Prop	Type	Default	Description
rpcUrl	string	http://localhost:8545	RPC URL for wallet connection
chainId	number	5150	Chain ID to connect to
onlyWallets	boolean	false	Disable other auth options
onLogin	(token: string) => void	—	Called when login succeeds
onLogout	() => void	—	Called on logout
forceOpen	boolean	—	Forces modal open
onForceClose	() => void	—	Called when modal is force-closed
hideButton	boolean	false	Hides the open modal button
logoutRedirectPath	string	/login	Path to navigate after logout
🧑‍🎨 Customization Props
Prop	Type	Default	Description
buttonText	string	'Connect Wallet'	Label for the connect button
buttonTextColor	string	'black' or highlight	Connect button font color
themeColor	string	'gold.500'	Chakra color used for theming
highlightColor	string	'#FFD700'	Highlight/accent color
modalSize	ModalProps['size']	['xl', '2xl']	Chakra modal sizes
modalBg	string	'black' or 'white'	Modal background
modalTextColor	string	'black' or highlight	Modal text color
leftPaneBg	string	same as modalBg	Background of left pane
rightPaneBg	string	gray.900 or gray.50	Background of right pane
leftPaneWidth	string	'300px'	Width of the left panel
rightPaneWidth	string	'400px'	Width of the right panel
panePadding	`string	number`	6
logo	`string	ReactNode`	—
navLinks	Array	Wallet/Settings defaults	Sidebar nav items
headerContent	ReactNode	<ModalHeader />	Override the modal header
footerContent	ReactNode	<Footer />	Override the modal footer
leftContent	ReactNode	Default wallet forms	Override left pane
rightContent	ReactNode	<WelcomeRightContent />	Override right pane
🧪 Usage Example
import { ConnectModal } from './components/ConnectModal'
import { WelcomeRightContent } from './components/WalletModal/cards/WelcomeRightContent'

<ConnectModal
  rpcUrl="https://mainnet.infura.io/v3/YOUR_INFURA_KEY"
  chainId={1}
  themeColor="blue.500"
  buttonText="Sign In with Wallet"
  logo={<img src="/logo.svg" alt="My App Logo" />}
  navLinks={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/settings' }
  ]}
  rightContent={
    <WelcomeRightContent
      imageUrl="https://placehold.co/300x300"
      title="Welcome Back!"
      subtitle="Securely access your account"
      imageSize="250px"
      titleFontSize="3xl"
      subtitleFontSize="md"
      subtitleColor="gray.600"
      spacing={4}
      paddingX={6}
    />
  }
/>

🛠 Custom Content

You can fully override the left or right pane using leftContent and rightContent.

<ConnectModal
  leftContent={<MyCustomLeftPane />}
  rightContent={<MyCustomRightPane />}
/>

🧑‍💻 Developer Notes

Chakra UI theme-aware styles (useColorMode, useToken) are used

Wagmi manages wallet connection state

Modal can be controlled externally via forceOpen / onForceClose

ENS name resolution is handled via useEnsName

📄 License

MIT

📬 Feedback or Help?

Feel free to open an issue or submit a PR.