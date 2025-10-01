import type { Connector } from 'wagmi'

export const injectedConnectorInfo = {
  id: 'injected',
  name: 'Browser Wallet',
  logoUrl: '/wallets/injected.svg',
  getConnector: (_options?: any): Connector => {
  return { /* ... */ } as Connector;
},
}
