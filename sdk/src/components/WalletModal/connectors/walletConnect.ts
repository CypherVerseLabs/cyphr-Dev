import type { Connector } from 'wagmi'

export const walletConnectInfo = {
  id: 'walletconnect',
  name: 'WalletConnect',
  logoUrl: '/wallets/walletconnect.svg',
  getConnector: (_options?: any): Connector => {
  return { /* ... */ } as Connector;
},
}
