import { VStack, HStack, Divider, Text } from '@chakra-ui/react'
import { WalletList } from '../WalletList'
import { EmailLogin } from '../LoginOnboard/EmailLogin'
import { SocialLoginButton } from '../LoginOnboard/SocialLoginButton'

interface LoginOptionsProps {
  rpcUrl: string
  chainId: number
  onlyWallets: boolean
  onClose: () => void
}

export default function LoginOptions({
  rpcUrl,
  chainId,
  onlyWallets,
  onClose,
}: LoginOptionsProps) {
  return (
    <>
      {!onlyWallets && (
        <>
          <VStack align="stretch" spacing={2}>
            <Text fontSize="sm" fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.300' }}>
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

          <VStack align="stretch" spacing={2}>
            <Text fontSize="sm" fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.300' }}>
              Continue with Email
            </Text>
            <EmailLogin />
          </VStack>

          <Divider />
        </>
      )}

      <VStack align="stretch" spacing={2}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.600" _dark={{ color: 'gray.300' }}>
          Connect Wallet
        </Text>
        <WalletList rpcUrl={rpcUrl} chainId={chainId} onSelect={onClose} />
      </VStack>
    </>
  )
}
