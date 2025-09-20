'use client'

import React, { useState } from 'react'
import { useConnect, useAccount, useDisconnect } from 'wagmi'
import { useAuth } from '../../hooks/useAuth'
import WalletOption from './WalletOption'

export interface WalletListProps {
  rpcUrl?: string
  chainId?: number
  onSelect?: () => void
  onDisconnect?: () => void
  className?: string
  style?: React.CSSProperties
}

const GOLD = '#FFD700'

export const WalletList: React.FC<WalletListProps> = ({
  rpcUrl,
  chainId,
  onSelect,
  onDisconnect,
  className = '',
  style,
}) => {
  const { connectors, connect, error } = useConnect()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { clearToken } = useAuth()

  const [connectingId, setConnectingId] = useState<string | null>(null)

  const injectedConnector = connectors.find((c) => c.id === 'injected')
  const effectiveRpcUrl = rpcUrl ?? 'http://localhost:8545'
  const effectiveChainId = chainId ?? 5150

  const handleDisconnect = () => {
    disconnect()
    clearToken()
    onDisconnect?.()
  }

  const handleCyphWalletConnect = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
      const targetHexChain = `0x${effectiveChainId.toString(16)}`

      try {
        if (currentChainId !== targetHexChain) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: targetHexChain }],
            })
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: targetHexChain,
                    chainName: 'CYPH Local Chain',
                    nativeCurrency: {
                      name: 'Cypher',
                      symbol: 'CYPH',
                      decimals: 18,
                    },
                    rpcUrls: [effectiveRpcUrl],
                    blockExplorerUrls: [],
                  },
                ],
              })
            } else throw switchError
          }
        }

        setConnectingId('cyph-wallet')
        await connect({ connector: injectedConnector!, chainId: effectiveChainId })
        onSelect?.()
      } catch (err) {
        console.error('🔌 Failed to connect to Cyph chain:', err)
      } finally {
        setConnectingId(null)
      }
    }
  }

  const isConnecting = connectingId !== null

  return (
    <div className={`space-y-2 ${className}`} style={style}>
      {isConnected ? (
        <button
          onClick={handleDisconnect}
          className="w-full text-sm text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-100"
        >
          🔌 Disconnect Wallet
        </button>
      ) : (
        <>
          {connectors
            .filter((c) => c.id !== 'injected')
            .map((connector) => (
              <WalletOption
                key={connector.id ?? connector.name}
                connector={connector}
                onClick={async () => {
                  setConnectingId(connector.id)
                  try {
                    await connect({ connector })
                    onSelect?.()
                  } catch (err) {
                    console.error(`Failed to connect: ${connector.name}`, err)
                  } finally {
                    setConnectingId(null)
                  }
                }}
                isLoading={connectingId === connector.id}
                disabled={isConnecting}
              />
            ))}

          {injectedConnector && (
            <WalletOption
              key="cyph-wallet"
              connector={injectedConnector}
              iconId="cyph"
              name="Cyph Wallet"
              onClick={handleCyphWalletConnect}
              isLoading={connectingId === 'cyph-wallet'}
              disabled={isConnecting}
            />
          )}
        </>
      )}

      {error && <p className="text-sm text-red-600">⚠️ {error.message}</p>}
    </div>
  )
}
