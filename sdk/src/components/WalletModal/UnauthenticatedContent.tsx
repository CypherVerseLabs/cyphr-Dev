'use client'

import { useState } from 'react'
import {
  VStack,
  HStack,
  Text,
  Divider,
  Alert,
  AlertIcon,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { SocialLoginButton } from './LoginOnboarding/SocialLoginButton'
import { EmailLogin } from './LoginOnboarding/EmailLogin'
import { Wallets } from './LoginOnboarding/Wallets'

interface UnauthenticatedContentProps {
  showWallets?: boolean
  showSocialLogins?: boolean
  showEmailLogin?: boolean
  showPhoneLogin?: boolean
  showPasskeyLogin?: boolean
  rpcUrl?: string
  chainId: number
  onClose: () => void
}

export default function UnauthenticatedContent({
  showWallets = false,
  showSocialLogins = false,
  showEmailLogin = false,
  showPhoneLogin = false,
  showPasskeyLogin = false,
  rpcUrl,
  chainId,
  onClose,
}: UnauthenticatedContentProps) {
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Phone login modal control
  const { isOpen, onOpen, onClose: onPhoneClose } = useDisclosure()
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleLoginError = (message: string) => {
    setLoginError(message)
    setIsConnecting(false)
  }

  const handlePhoneLoginSubmit = async () => {
    setIsConnecting(true)
    setLoginError(null)

    try {
      if (!phoneNumber) {
        throw new Error('Please enter a valid phone number.')
      }
      // Your actual phone login logic here, e.g., SDK call
      // await sdk.phoneLogin(phoneNumber)

      setIsConnecting(false)
      onPhoneClose()
      onClose() // Close the modal after successful login
    } catch (error: any) {
      setIsConnecting(false)
      setLoginError(error.message || 'Phone login failed')
    }
  }

  return (
    <VStack spacing={6} align="stretch" w="100%">
      {/* Error Banner */}
      {loginError && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {loginError}
        </Alert>
      )}

      {/* Wallets */}
      {showWallets && (
        <>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="gray.600"
            _dark={{ color: 'gray.300' }}
          >
            Connect Wallet
          </Text>

          <Wallets
            rpcUrl={rpcUrl}
            chainId={chainId}
            onSelect={() => {
              setIsConnecting(false)
              onClose()
            }}
            onError={(e) => handleLoginError(e?.message ?? 'Wallet connection error')}
            onConnectingChange={setIsConnecting}
          />
          <Divider />
        </>
      )}

      {/* Social Logins */}
      {showSocialLogins && (
        <VStack spacing={3} align="center" w="100%">
          <Text
            fontSize="sm"
            fontWeight="semibold"
            textAlign="center"
            color="gray.600"
            _dark={{ color: 'gray.300' }}
          >
            Continue with Social
          </Text>

          <HStack spacing={3} justify="center" flexWrap="wrap">
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
          <Divider />
        </VStack>
      )}

      {/* Email Login */}
      {showEmailLogin && (
        <>
          <EmailLogin
            provider="google"
            onError={handleLoginError}
            onStart={() => setIsConnecting(true)}
            onFinish={() => setIsConnecting(false)}
          />
          <Divider />
        </>
      )}

      {/* Phone Login */}
      {showPhoneLogin && (
        <>
          <Button
            width="100%"
            colorScheme="blue"
            isLoading={isConnecting}
            loadingText="Logging in"
            onClick={onOpen}
            isDisabled={isConnecting}
          >
            Continue with Phone Number
          </Button>

          {/* Phone Login Modal */}
          <Modal isOpen={isOpen} onClose={onPhoneClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Phone Number Login</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoFocus
                />
              </ModalBody>

              <ModalFooter>
                <Button mr={3} onClick={onPhoneClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handlePhoneLoginSubmit}
                  isLoading={isConnecting}
                >
                  Login
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Divider />
        </>
      )}

      {/* Passkey Login */}
      {showPasskeyLogin && (
        <Button
          width="100%"
          colorScheme="gray"
          onClick={() => alert('Passkey login not implemented yet')}
          isDisabled={true} // Disable until implemented
        >
          Continue with Passkey
        </Button>
      )}
    </VStack>
  )
}
