'use client'

import React, { useEffect, useMemo, useState } from 'react'
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
  useToast,
} from '@chakra-ui/react'

import Footer from './WalletModal/components/Footer'
import ModalHeader from './WalletModal/components/ModalHeader'
import UnauthenticatedContent from './WalletModal/UnauthenticatedContent'
import AuthenticatedContent from './WalletModal/AuthenticatedContent'

import { IconType } from 'react-icons'
import { FaWallet, FaCog } from 'react-icons/fa'
import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { useAuth } from '../hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'

export interface WalletModalProps {
  rpcUrl?: string
  chainId?: number
  onlyWallets?: boolean
  onLogin?: (token: string) => void
  onLogout?: () => void
  themeOverride?: 'light' | 'dark'
  buttonText?: string
  navLinks?: { label: string; href: string; icon?: IconType }[]
  logo?: string | React.ReactNode
  modalSize?: ModalProps['size']
  modalProps?: Partial<Omit<ModalProps, 'isOpen' | 'onClose'>>
  themeColor?: string

  // Controlled mode and hiding button
  forceOpen?: boolean
  onForceClose?: () => void
  hideButton?: boolean

  // Logout redirect path
  logoutRedirectPath?: string

  // 🎨 New customization props
  backgroundColor?: string
  textColor?: string
  fontFamily?: string
}

const shortenAddress = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

export default function ConnectButton({
  rpcUrl = 'http://localhost:8545',
  chainId = 5150,
  onLogin,
  onLogout,
  themeOverride,
  buttonText = 'Connect Wallet',
  navLinks = [
    { label: 'My Wallets', href: '/wallets', icon: FaWallet },
    { label: 'Settings', href: '/settings', icon: FaCog },
    { label: 'Account Settings', href: '/account/settings' },
    { label: 'Devices', href: '/account/devices' },
  ],
  logo,
  modalSize = ['xs', 'sm', 'md'],
  modalProps = {},
  themeColor = 'gold.500',
  forceOpen,
  onForceClose,
  hideButton = false,
  logoutRedirectPath = '/login',

  // 🆕 New customization props
  backgroundColor,
  textColor,
  fontFamily,
}: WalletModalProps) {
  const internalDisclosure = useDisclosure()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const isControlled = typeof forceOpen === 'boolean'
  const isOpen = isControlled ? forceOpen : internalDisclosure.isOpen
  const onOpen = isControlled ? () => {} : internalDisclosure.onOpen
  const onClose = isControlled ? (onForceClose || (() => {})) : internalDisclosure.onClose

  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { clearToken, token } = useAuth()
  const { data: ensName } = useEnsName({ address })

  const { colorMode } = useColorMode()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [bg500, bg600, bg400] = useToken(
    'colors',
    useMemo(
      () => [
        themeColor,
        themeColor.replace('.500', '.600'),
        themeColor.replace('.500', '.400'),
      ],
      [themeColor]
    )
  )

  const buttonBg = backgroundColor || bg500 || themeColor
  const buttonHoverBg = bg600 || bg400 || themeColor
  const buttonTextColor = textColor || useColorModeValue('black', '#FFD700')
  const appliedFontFamily = fontFamily || 'inherit'

  const gold = '#FFD700'
  const isDark = themeOverride === 'dark' || (!themeOverride && colorMode === 'dark')
  const displayName = ensName ?? shortenAddress(address)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await disconnect?.()
      clearToken()
      onClose()
      onLogout?.()
      navigate(logoutRedirectPath)
      toast({
        title: 'Logged out',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: (error as Error).message || 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  useEffect(() => {
    if (token) {
      onLogin?.(token)
    }
  }, [token, onLogin])

  return (
    <>
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
          fontFamily={appliedFontFamily}
          aria-label={isConnected ? `Wallet connected: ${displayName}` : 'Connect wallet'}
          isLoading={isLoggingOut}
        >
          {isConnected ? displayName : buttonText}
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={modalSize}
        {...modalProps}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent
          p={6}
          bg={isDark ? 'black' : 'white'}
          color={isDark ? gold : 'black'}
          fontFamily={appliedFontFamily} // 🆕 Apply font to modal
          aria-labelledby="wallet-modal-title"
        >
          <ModalHeader displayName={displayName} logo={logo} isDark={isDark} />
          <ModalCloseButton />
          <ModalBody mt={4}>
            <VStack spacing={6} align="stretch">
              {!isConnected ? (
                <UnauthenticatedContent
                  
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
