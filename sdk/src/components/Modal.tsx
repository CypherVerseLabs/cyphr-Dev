'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalProps,
  Button,
  VStack,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react'

import Footer from './WalletModal/components/Footer'
import ModalHeader from './WalletModal/components/ModalHeader'
import UnauthenticatedContent from './WalletModal/UnauthenticatedContent'
import AuthenticatedContent from './WalletModal/AuthenticatedContent'

import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'
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
  logo?: string | React.ReactNode
  modalSize?: ModalProps['size']
  modalProps?: Partial<Omit<ModalProps, 'isOpen' | 'onClose'>>
  themeColor?: string

  // New props for controlled mode and hiding button
  forceOpen?: boolean             // control modal open state externally
  onForceClose?: () => void       // external callback for closing modal
  hideButton?: boolean            // hide the connect button when true
}

const shortenAddress = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

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
  logo,
  modalSize = ['xs', 'sm', 'md'],
  modalProps = {},
  themeColor = 'gold.500',
  forceOpen,
  onForceClose,
  hideButton = false,
}: WalletModalProps) {
  // Use internal disclosure unless controlled externally
  const internalDisclosure = useDisclosure()

  const isControlled = typeof forceOpen === 'boolean'

  const isOpen = isControlled ? forceOpen : internalDisclosure.isOpen
  const onOpen = isControlled ? () => {} : internalDisclosure.onOpen
  const onClose = isControlled ? (onForceClose || (() => {})) : internalDisclosure.onClose

  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { clearToken, token } = useAuth()
  const { data: ensName } = useEnsName({ address })
  const location = useLocation()
  const { colorMode } = useColorMode()

  const [bg500, bg600, bg400] = useToken('colors', [
    themeColor,
    themeColor.replace('.500', '.600'),
    themeColor.replace('.500', '.400'),
  ])

  const buttonBg = bg500 || themeColor
  const buttonHoverBg = bg600 || bg400 || themeColor
  const buttonTextColor = useColorModeValue('black', '#FFD700')
  const gold = '#FFD700'
  const isDark = themeOverride === 'dark' || (!themeOverride && colorMode === 'dark')
  const displayName = ensName ?? shortenAddress(address)

  const handleLogout = () => {
    disconnect()
    clearToken()
    onClose()
    onLogout?.()
  }

  useEffect(() => {
    if (token) {
      onLogin?.(token)
    }
  }, [token, onLogin])

  return (
    <>
      {/* Only render the button if hideButton is false */}
      {!hideButton && (
        <Button
          onClick={onOpen}
          size="sm"
          variant="solid"
          bg={buttonBg}
          color={buttonTextColor}
          _hover={{ bg: buttonHoverBg }}
          px={4}
          py={2}
          fontSize="sm"
        >
          {isConnected ? 'Connected' : buttonText}
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={modalSize}
        {...modalProps}
      >
        <ModalOverlay />
        <ModalContent
          p={6}
          bg={isDark ? 'black' : 'white'}
          color={isDark ? gold : 'black'}
          aria-labelledby="wallet-modal-title"
        >
          <ModalHeader displayName={displayName} logo={logo} isDark={isDark} />
          <ModalCloseButton />
          <ModalBody mt={4}>
            <VStack spacing={6} align="stretch">
              {!isConnected ? (
                <UnauthenticatedContent
                  onlyWallets={onlyWallets}
                  rpcUrl={rpcUrl}
                  chainId={chainId}
                  onClose={onClose}
                />
              ) : (
                <AuthenticatedContent
                  navLinks={navLinks}
                  onLogout={handleLogout}
                  onClose={onClose}
                  currentPath={location.pathname}
                />
              )}
            </VStack>
            <Footer />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
