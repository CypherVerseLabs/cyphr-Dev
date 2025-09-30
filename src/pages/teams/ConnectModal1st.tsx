'use client'

import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalProps,
  useDisclosure,
  useColorMode,
  useToast,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react'

import { IconType } from 'react-icons'
import { FaWallet, FaCog } from 'react-icons/fa'
import { useAccount, useDisconnect, useEnsName } from 'wagmi'

import { useLocation, useNavigate } from 'react-router-dom'
import ConnectButtonUI from '../../../sdk/src/components/WalletModal/components/ConnectButtonUi'
import ConnectModalFooter from '../../../sdk/src/components/WalletModal/components/ConnectModalFooter'
import ConnectModalHeader from '../../../sdk/src/components/WalletModal/components/ConnectModalHeader'
import ConnectModalLeftPane from '../../../sdk/src/components/WalletModal/components/ConnectModalLeftPane'
import ConnectModalRightPane from '../../../sdk/src/components/WalletModal/components/ConnectModalRightPane'



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
  containerHeight?: string | number

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

  hideSections?: {
    button?: boolean
    header?: boolean
    footer?: boolean
    leftPane?: boolean
    rightPane?: boolean
    socialLogins?: boolean
  }
}

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
  modalSize,
  modalProps = {},
  themeColor = 'gold.500',
  forceOpen,
  onForceClose,
  hideButton = false,
  logoutRedirectPath = '/login',
  containerHeight = '440px',

  buttonTextColor,
  highlightColor = '#FFD700',
  modalBg,
  modalTextColor,
  leftPaneBg,
  rightPaneBg = '#000000',
  leftPaneWidth = '400px',
  rightPaneWidth = '600px',
  panePadding = 6,
  headerContent,
  footerContent,
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

  // Responsive modal size if modalSize prop is not provided
  const responsiveModalSize = useBreakpointValue({ base: 'sm', md: 'xl', lg: '2xl' })

  const finalModalSize = modalSize ?? responsiveModalSize ?? '2xl'

  const isDark = themeOverride === 'dark' || (!themeOverride && colorMode === 'dark')
  const displayName = React.useMemo(() => ensName ?? shortenAddress(address), [ensName, address])

  const resolvedModalBg = modalBg ?? (isDark ? 'black' : 'white')
  const resolvedModalTextColor = modalTextColor ?? (isDark ? highlightColor : 'black')
  const resolvedLeftBg = leftPaneBg ?? resolvedModalBg
  const resolvedRightBg = rightPaneBg ?? (isDark ? 'gray.900' : 'gray.50')

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      disconnect?.()
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
      console.error('Logout error:', error)
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
        <ConnectButtonUI
          onOpen={onOpen}
          isConnected={isConnected}
          displayName={displayName}
          buttonText={buttonText}
          isLoggingOut={isLoggingOut}
          themeColor={themeColor}
          buttonTextColor={buttonTextColor}
          aria-label={isConnected ? `Open wallet menu for ${displayName}` : 'Connect Wallet'}
        />
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={finalModalSize}
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
          <ConnectModalHeader
            headerContent={headerContent}
            displayName={displayName}
            logo={logo}
            isDark={isDark}
          />

          <ModalBody p={0}>
            <Box display="flex" width="100%" height={containerHeight}>
              <ConnectModalLeftPane
                isConnected={isConnected}
                leftPaneWidth={leftPaneWidth}
                panePadding={panePadding}
                resolvedLeftBg={resolvedLeftBg}
                onlyWallets={onlyWallets}
                rpcUrl={rpcUrl}
                chainId={chainId}
                onClose={onClose}
                navLinks={navLinks}
                handleLogout={handleLogout}
                location={location}
              />
              <ConnectModalRightPane
                rightPaneWidth={rightPaneWidth}
                panePadding={panePadding}
                resolvedRightBg={resolvedRightBg}
                rightContent={rightContent} isLoggedIn={false}
                />
            </Box>
          </ModalBody>

          <ConnectModalFooter footerContent={footerContent} />
        </ModalContent>
      </Modal>
    </>
  )
}
function useAuth(): { clearToken: any; token: any } {
  throw new Error('Function not implemented.')
}

