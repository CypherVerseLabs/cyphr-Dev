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
} from '@chakra-ui/react'
import { useToken } from '@chakra-ui/react'

import Footer from './components/Footer'
import ModalHeader from './components/ModalHeader'
import UnauthenticatedContent from './UnauthenticatedContent' // ✅ correct
import AuthenticatedContent from './AuthenticatedContent'

import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { useAuth } from '../../hooks/useAuth'
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
}: WalletModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
