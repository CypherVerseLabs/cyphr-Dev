'use client'

import React, { useEffect, useMemo, useState } from 'react'
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

// ✅ Injected from SDK consumer (don't hardcode)
import { useAuth } from '../hooks/useAuth'

import ConnectModalFooter from '../components/WalletModal/components/ConnectModalFooter'
import ConnectModalHeader from '../components/WalletModal/components/ConnectModalHeader'
import ConnectModalLeftPane from '../components/WalletModal/components/ConnectModalLeftPane'
import ConnectModalRightPane from '../components/WalletModal/components/ConnectModalRightPane'
import ConnectButtonUI from '../components/WalletModal/components/ConnectButtonUi'
import WalletActionsTabs from '../components/WalletModal/components/WalletActionsModal'

export interface CypherModalProps {
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

  // ✅ Optional logout handler override
  onLogoutRedirect?: () => void
}

const shortenAddress = (addr?: string) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''

export function CypherModal({
  rpcUrl = 'http://localhost:8545',
  chainId = 5150,
  onlyWallets = false,
  onLogin,
  onLogout,
  onLogoutRedirect,
  themeOverride,
  buttonText = 'Connect Wallet',
  navLinks = [
    { label: 'My Wallets', href: '/wallets', icon: FaWallet },
    { label: 'Settings', href: '/settings', icon: FaCog },
  ],
  logo,
  modalSize,
  modalProps = {},
  themeColor = 'gold.500',
  forceOpen,
  onForceClose,
  hideButton = false,
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
}: CypherModalProps) {
  const disclosure = useDisclosure()
  const toast = useToast()
  const { colorMode } = useColorMode()

  const isControlled = typeof forceOpen === 'boolean'
  const isOpen = isControlled ? forceOpen : disclosure.isOpen
  const onOpen = isControlled ? () => {} : disclosure.onOpen
  const onClose = isControlled ? (onForceClose || (() => {})) : disclosure.onClose

  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { clearToken, token } = useAuth()
  const { data: ensName } = useEnsName({ address })
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const isDark = themeOverride === 'dark' || (!themeOverride && colorMode === 'dark')
  const displayName = useMemo(() => ensName ?? shortenAddress(address), [ensName, address])
  const modalBgResolved = modalBg ?? (isDark ? 'black' : 'white')
  const textColorResolved = modalTextColor ?? (isDark ? highlightColor : 'black')
  const leftBg = leftPaneBg ?? modalBgResolved
  const rightBg = rightPaneBg ?? (isDark ? 'gray.900' : 'gray.50')
  const finalSize = modalSize ?? useBreakpointValue({ base: 'sm', md: 'xl', lg: '2xl' }) ?? '2xl'

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await disconnect()
      clearToken()
      onClose()
      onLogout?.()
      onLogoutRedirect?.()
      toast({
        title: 'Logged out',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: 'Logout failed',
        description: error?.message || 'Please try again',
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
        />
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={finalSize}
        motionPreset="slideInBottom"
        {...modalProps}
      >
        <ModalOverlay />
        <ModalContent
          p={0}
          bg={modalBgResolved}
          color={textColorResolved}
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
                resolvedLeftBg={leftBg}
                onlyWallets={onlyWallets}
                rpcUrl={rpcUrl}
                chainId={chainId}
                onClose={onClose}
                navLinks={navLinks}
                handleLogout={handleLogout} location={undefined}              />

              <ConnectModalRightPane
                rightPaneWidth={rightPaneWidth}
                panePadding={panePadding}
                resolvedRightBg={rightBg}
                rightContent={isConnected ? <WalletActionsTabs /> : rightContent}
                isLoggedIn={isConnected}
              />
            </Box>
          </ModalBody>

          <ConnectModalFooter footerContent={footerContent} />
        </ModalContent>
      </Modal>
    </>
  )
}
export default CypherModal;