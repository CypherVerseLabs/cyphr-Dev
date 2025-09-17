'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Button,
  VStack,
  HStack,
  Divider,
  Text,
  useDisclosure,
  Flex,
} from '@chakra-ui/react'

import { WalletList } from './WalletList'
import { EmailLogin } from './LoginOnboard/EmailLogin'
import { SocialLoginButton } from './LoginOnboard/SocialLoginButton'
import DarkModeToggle from './DarkModeToggle'
import Footer from './Footer'

import { useAccount, useDisconnect } from 'wagmi'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'



export interface WalletModalProps {
  rpcUrl?: string
  chainId?: number
  onlyWallets?: boolean
  onLogin?: (token: string) => void
  onLogout?: () => void
  themeOverride?: 'light' | 'dark'
  buttonText?: string
  navLinks?: { label: string; href: string }[]
}

export default function WalletModal({
  rpcUrl = 'http://localhost:8545',
  chainId = 5150,
  onlyWallets = false,
  onLogin,
  onLogout,
  themeOverride,
  buttonText = 'Connect Wallet',
  navLinks = [
    { label: 'My Account', href: '/account' },
    { label: 'My Wallets', href: '/account/wallets' },
    { label: 'Settings', href: '/account/settings' },
    { label: 'Devices', href: '/account/devices' },
  ],
}: WalletModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { clearToken, token } = useAuth()
  const location = useLocation()

  const gold = '#FFD700'

  const handleLogout = () => {
    disconnect()
    clearToken()
    onClose()
    onLogout?.()
  }

  const shorten = (addr?: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

  // Optional: Token validation can be added here before triggering onLogin
  useEffect(() => {
    if (token) {
      onLogin?.(token)
    }
  }, [token, onLogin])

  return (
    <>
      <Button
        onClick={onOpen}
        size="sm"
        variant="solid"
        bg={gold}
        color="black"
        _hover={{ bg: '#e6c200' }}
        px={4}
        py={2}
        fontSize="sm"
      >
        {isConnected ? 'Connected' : buttonText}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent
          p={6}
          bg={themeOverride === 'dark' ? 'black' : 'white'}
          color={themeOverride === 'dark' ? '#FFD700' : 'black'}
        >
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={2}>
              <img src="/logo.png" alt="Logo" width="24" height="24" />
              <Text fontSize="sm" fontWeight="bold">
                {isConnected ? `Welcome ${shorten(address)}` : 'Connect'}
              </Text>
            </Flex>
            <DarkModeToggle />
          </Flex>

          <ModalCloseButton />

          <ModalBody mt={4}>
            <VStack spacing={6} align="stretch">
              {!isConnected ? (
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
              ) : (
                <VStack spacing={4} align="stretch">
                  

                  {/* Custom or default navigation links */}
                  <VStack spacing={2} align="stretch">
                    {navLinks.map((link) => (
                      <Button
                        key={link.href}
                        as={RouterLink}
                        to={link.href}
                        onClick={onClose}
                        colorScheme={location.pathname.startsWith(link.href) ? 'yellow' : 'gray'}
                        variant="outline"
                        >
                        {link.label}
                      </Button>
                    ))}
                  </VStack>

                  <Button
                    onClick={handleLogout}
                    colorScheme="red"
                    variant="outline"
                  >
                    Log Out
                  </Button>
                </VStack>
              )}
            </VStack>

            <Footer />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
