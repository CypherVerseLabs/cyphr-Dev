// src/types/transak.d.ts
declare module '@transak/transak-sdk' {
  export interface TransakConfig {
    apiKey: string
    environment: 'PRODUCTION' | 'STAGING' | 'SANDBOX'
    defaultCryptoCurrency: string
    walletAddress?: string
    fiatCurrency?: string
    widgetHeight?: string
    widgetWidth?: string
    themeColor?: string
    hostURL?: string
    widgetUrl?: string
    referrer?: string
  }

  export type TransakOrderSuccessfulEvent = {
    id: string
    [key: string]: any
  }

  export type TransakEvents =
    | 'TRANSAK_ORDER_SUCCESSFUL'
    | 'TRANSAK_WIDGET_CLOSE'
    | string

  export class Transak {
    constructor(config: TransakConfig)
    init(): void
    close(): void
    on(eventName: TransakEvents, callback: (data?: any) => void): void
  }
}
