// UnauthenticatedContent.tsx
'use client'

import { VStack, HStack, Text, Divider } from '@chakra-ui/react'
import {SocialLoginButton} from '../LoginOnboard/SocialLoginButton'
import {EmailLogin} from '../LoginOnboard/EmailLogin'
import {WalletList} from '../WalletList'

interface UnauthenticatedContentProps {
  onlyWallets: boolean
  rpcUrl: string
  chainId: number
  onClose: () => void
}

export default function UnauthenticatedContent({
  onlyWallets,
  rpcUrl,
  chainId,
  onClose,
}: UnauthenticatedContentProps) {
  return (
    <>
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
              Continue with Social
            </Text>
            <HStack spacing={4}>
              <SocialLoginButton provider="google" />
              <SocialLoginButton provider="twitter" />
              <SocialLoginButton provider="discord" />
              <SocialLoginButton provider="instagram" />
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
            <EmailLogin />
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
          rpcUrl={rpcUrl}
          chainId={chainId}
          onSelect={onClose}
        />
      </VStack>
    </>
  )
}
