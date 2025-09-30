'use client'

import { useState, useEffect } from 'react'
import {
  VStack,
  HStack,
  Text,
  Divider,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { SocialLoginButton } from './LoginOnboarding/SocialLoginButton'
import { EmailLogin } from './LoginOnboarding/EmailLogin'
import { WalletList } from './WalletList'

interface Chain {
  chainId: number
  name: string
}

interface UnauthenticatedContentProps {
  onlyWallets: boolean
  rpcUrl: string
  chainId?: number // optional default chain
  onClose: () => void
}

const supportedChains: Chain[] = [
  { chainId: 1, name: 'Ethereum Mainnet' },
  { chainId: 56, name: 'Binance Smart Chain' },
  { chainId: 5150, name: 'Cyph Custom Chain' },
]

const rpcUrls: Record<number, string> = {
  1: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
  56: 'https://bsc-dataseed.binance.org/',
  5150: '', // Overridden by prop.rpcUrl
}

export default function UnauthenticatedContent({
  onlyWallets,
  rpcUrl,
  chainId,
  onClose,
}: UnauthenticatedContentProps) {
  const [loginError, setLoginError] = useState<string | null>(null)
  const [, setIsConnecting] = useState(false)

  // Load selected chain from localStorage or fallback to default
  const getInitialChain = (): Chain => {
    if (typeof window !== 'undefined') {
      const savedChainId = localStorage.getItem('selectedChainId')
      if (savedChainId) {
        const chain = supportedChains.find((c) => c.chainId === Number(savedChainId))
        if (chain) return chain
      }
    }
    return supportedChains.find((c) => c.chainId === chainId) ?? supportedChains[0]
  }

  const [selectedChain] = useState<Chain>(getInitialChain)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedChainId', selectedChain.chainId.toString())
    }
  }, [selectedChain])

  const handleLoginError = (message: string) => {
    setLoginError(message)
    setIsConnecting(false)
  }

  // Determine RPC URL for selected chain
  const currentRpcUrl =
    selectedChain.chainId === 5150 ? rpcUrl : rpcUrls[selectedChain.chainId] ?? rpcUrl

  return (
    <VStack spacing={4} align="stretch">
      {loginError && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {loginError}
        </Alert>
      )}

      {!onlyWallets && (
        <>
          {/* Social Logins */}
          <VStack align="stretch" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.600"
              _dark={{ color: 'gray.300' }}
            >
              SocialLogin
            </Text>
            <HStack spacing={1} wrap="wrap">
              
              <SocialLoginButton
                provider="twitter"
                onError={handleLoginError}
                onStart={() => setIsConnecting(true)}
                onFinish={() => setIsConnecting(false)}
              />
              <SocialLoginButton
                provider="discord"
                onError={handleLoginError}
                onStart={() => setIsConnecting(true)}
                onFinish={() => setIsConnecting(false)}
              />
              <SocialLoginButton
                provider="instagram"
                onError={handleLoginError}
                onStart={() => setIsConnecting(true)}
                onFinish={() => setIsConnecting(false)}
              />
            </HStack>
          </VStack>

          <Divider />

          {/* Email Login */}
          <VStack align="stretch" spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.600"
              _dark={{ color: 'gray.300' }}
            >
              Continue with Email
            </Text>
            <EmailLogin
                provider="google"
                onError={handleLoginError}
                onStart={() => setIsConnecting(true)}
                onFinish={() => setIsConnecting(false)}
              />
          </VStack>

          <Divider />
        </>
      )}

      {/* Wallet Connect */}
      <VStack align="stretch" spacing={2}>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color="gray.600"
          _dark={{ color: 'gray.300' }}
        >
          Connect Wallet
        </Text>
        <WalletList
          rpcUrl={currentRpcUrl}
          chainId={selectedChain.chainId}
          onSelect={() => {
            setIsConnecting(false)
            onClose()
          }}
          onError={(e) =>
            handleLoginError(e?.message ?? 'An unknown error occurred')
          }
          onConnectingChange={setIsConnecting}
        />
      </VStack>
    </VStack>
  )
}
