'use client'

import React, { useState } from 'react'
import {
  Box,
  Button,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useConnect, useAccount, useDisconnect } from 'wagmi'
import { useAuth } from '../../../sdk/src/hooks/useAuth'
import WalletOption from './WalletList/WalletOption'

export interface WalletListProps {
  rpcUrl?: string
  chainId?: number
  onSelect?: () => void
  onDisconnect?: () => void
  className?: string
  style?: React.CSSProperties
}

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
  const isConnecting = connectingId !== null

  const handleDisconnect = () => {
    disconnect()
    clearToken()
    onDisconnect?.()
  }

  const switchToTargetChain = async () => {
    const targetHexChain = `0x${Number(effectiveChainId).toString(16)}`
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetHexChain }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum?.request({
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
      } else {
        throw switchError
      }
    }
  }

  const validateAndSwitchChain = async () => {
    const chainIdHex = await window.ethereum?.request({ method: 'eth_chainId' })
    const currentChainId = parseInt(chainIdHex, 16)

    if (currentChainId !== effectiveChainId) {
      await switchToTargetChain()
    }
  }

  const handleCyphWalletConnect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.warn('No Ethereum provider found')
      return
    }

    try {
      await validateAndSwitchChain()

      setConnectingId('cyph-wallet')
      await connect({ connector: injectedConnector!, chainId: effectiveChainId })
      onSelect?.()
    } catch (err) {
      console.error('🔌 Failed to connect to Cyph Wallet:', err)
    } finally {
      setConnectingId(null)
    }
  }

  return (
    <Box className={className} style={style}>
      {isConnected ? (
        <Button
          onClick={handleDisconnect}
          colorScheme="red"
          variant="outline"
          width="100%"
        >
          🔌 Disconnect Wallet
        </Button>
      ) : (
        <Stack spacing={3}>
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

                    await validateAndSwitchChain()

                    onSelect?.()
                  } catch (err) {
                    console.error(`❌ Failed to connect: ${connector.name}`, err)
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
        </Stack>
      )}

      {error && (
        <Text fontSize="sm" color="red.500" mt={2}>
          ⚠️ {error.message}
        </Text>
      )}
    </Box>
  )
}
