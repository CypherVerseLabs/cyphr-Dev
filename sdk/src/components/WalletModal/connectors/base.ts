import type { Connector } from 'wagmi'

export const baseConnectorInfo = {
  id: 'base',
  name: 'Base Wallet',
  logoUrl: '/wallets/base.svg',
  getConnector: (_options?: any): Connector => {
    // custom logic for Base chain, perhaps using injected but with base RPC
    return { /* ... */ } as Connector
  },
}
