// index.tsx
console.log('ENV:', import.meta.env.VITE_WC_PROJECT_ID);

console.log('import.meta.env:', import.meta.env);
console.log('VITE_WC_PROJECT_ID:', import.meta.env.VITE_WC_PROJECT_ID)
console.log('VITE_TEST:', import.meta.env.VITE_TEST)
console.log('FULL ENV:', import.meta.env)



import React from 'react'
import ReactDOM from 'react-dom/client'

// Chakra UI
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  type ThemeConfig,
} from '@chakra-ui/react'

// React Router
import { BrowserRouter } from 'react-router-dom'

// Wagmi
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

// App Components
import App from './App'
import { CypherProvider } from './CypherProvider'

// Chains
import { cyphChain } from '../sdk/src/chains/cyphChain'
import { injected, walletConnect, baseAccount } from 'wagmi/connectors'

console.log('ENV:', import.meta.env.VITE_WC_PROJECT_ID);


// 🌈 Theme Setup
const themeConfig: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
}
const theme = extendTheme({ config: themeConfig })

// ✅ WalletConnect Project ID (optional, for walletConnect connector)
const projectId = import.meta.env.VITE_WC_PROJECT_ID
if (!projectId) {
  throw new Error('Missing VITE_WC_PROJECT_ID')
}

// ✅ Minimal Wagmi Config (no RainbowKit)
const config = createConfig({
  connectors: [
    injected(),
    walletConnect({ projectId }),
    baseAccount(),
  ],
  chains: [mainnet, sepolia, cyphChain] as const,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [cyphChain.id]: http(cyphChain.rpcUrls.default.http[0]),
  },
 
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <WagmiProvider config={config}>
        <CypherProvider initialState={undefined}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CypherProvider>
      </WagmiProvider>
    </ChakraProvider>
  </React.StrictMode>
)
