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
  Box,
} from '@chakra-ui/react'

import Footer from './WalletModal/components/Footer'
import ModalHeader from './WalletModal/components/ModalHeader'
import UnauthenticatedContent from './WalletModal/UnauthenticatedContent'
import AuthenticatedContent from './WalletModal/AuthenticatedContent'

import { IconType } from 'react-icons'
import { FaWallet, FaCog } from 'react-icons/fa'
import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { useAuth } from '../../sdk/src/hooks/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import { WelcomeRightContent } from './WalletModal/cards/WelcomeRightContent'

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
  forceOpen?: boolean
  onForceClose?: () => void
  hideButton?: boolean
  logoutRedirectPath?: string

  // ✅ Customization Props
  buttonTextColor?: string
  highlightColor?: string
  modalBg?: string
  modalTextColor?: string
  leftPaneBg?: string
  rightPaneBg?: string
  leftPaneWidth?: string
  rightPaneWidth?: string
  panePadding?: string | number
  headerContent?: React.ReactNode
  footerContent?: React.ReactNode
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
}

// Helper to shorten wallet address
const shortenAddress = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

export default function ConnectModal({
  rpcUrl = 'http://localhost:8545',
  chainId = 5150,
  onlyWallets = false,
  onLogin,
  onLogout,
  themeOverride,
  buttonText = 'Connect Wallet',
  navLinks = [
    { label: 'My Wallets', href: '/wallets', icon: FaWallet },
    { label: 'Settings', href: '/settings', icon: FaCog },
    { label: 'Account Settings', href: '/account/settings', icon: FaCog },
    { label: 'Devices', href: '/account/devices', icon: FaCog },
  ],
  logo,
  modalSize = ['xl', '2xl'],
  modalProps = {},
  themeColor = 'gold.500',
  forceOpen,
  onForceClose,
  hideButton = false,
  logoutRedirectPath = '/login',

  // 🆕 Customization
  buttonTextColor,
  highlightColor = '#FFD700',
  modalBg,
  modalTextColor,
  leftPaneBg,
  rightPaneBg,
  leftPaneWidth = '300px',
  rightPaneWidth = '400px',
  panePadding = 6,
  headerContent,
  footerContent,
  leftContent,
  rightContent,
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

  const buttonBg = bg500 || themeColor
  const buttonHoverBg = bg600 || bg400 || themeColor
  const resolvedButtonTextColor = buttonTextColor ?? useColorModeValue('black', highlightColor)
  const isDark = themeOverride === 'dark' || (!themeOverride && colorMode === 'dark')
  const displayName = ensName ?? shortenAddress(address)

  const resolvedModalBg = modalBg ?? (isDark ? 'black' : 'white')
  const resolvedModalTextColor = modalTextColor ?? (isDark ? highlightColor : 'black')
  const resolvedLeftBg = leftPaneBg ?? resolvedModalBg
  const resolvedRightBg = rightPaneBg ?? (isDark ? 'gray.900' : 'gray.50')

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
          color={resolvedButtonTextColor}
          _hover={{ bg: buttonHoverBg }}
          px={4}
          py={2}
          fontSize="sm"
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
          p={0}
          bg={resolvedModalBg}
          color={resolvedModalTextColor}
          aria-labelledby="wallet-modal-title"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" px={6} pt={6}>
            {headerContent ?? (
              <ModalHeader
                displayName={displayName}
                logo={logo}
                isDark={isDark}
              />
            )}
            <ModalCloseButton position="relative" top="0" right="0" />
          </Box>

          <ModalBody p={0}>
            <Box display="flex" width="100%" height="500px">
              {/* Left Side */}
              <Box
                width={leftPaneWidth}
                p={panePadding}
                overflowY="auto"
                bg={resolvedLeftBg}
              >
                {leftContent ?? (
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
                )}
              </Box>

              {/* Right Side */}
              <Box
                width={rightPaneWidth}
                p={panePadding}
                overflowY="auto"
                bg={resolvedRightBg}
              >
                {rightContent ?? (
                  <WelcomeRightContent
                    imageUrl="https://avatars.githubusercontent.com/u/143012744?v=4&size=64"
                    title="Welcome!"
                    subtitle="Let’s get started"
                    imageSize="250px"
                    titleFontSize="3xl"
                    subtitleFontSize="lg"
                    subtitleColor="gray.600"
                    spacing={4}
                    paddingX={8}
                    />
                )}
              </Box>
            </Box>
          </ModalBody>

          {footerContent ?? <Footer />}
        </ModalContent>
      </Modal>
    </>
  )
}
