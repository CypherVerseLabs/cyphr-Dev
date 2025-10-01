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
} from '@chakra-ui/react'

import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { useAuth } from '../hooks/useAuth'

import ConnectModalFooter from '../components/WalletModal/components/ConnectModalFooter'
import ConnectModalHeader from '../components/WalletModal/components/ConnectModalHeader'
import ConnectModalLeftPane from '../components/WalletModal/components/ConnectModalLeftPane'
import ConnectModalRightPane from '../components/WalletModal/components/ConnectModalRightPane'
import ConnectButtonUI from '../components/WalletModal/components/ConnectButtonUi'

import SendTabComponent from './WalletModal/tabs/SendTab'
import BuyTabComponent from './WalletModal/tabs/BuyTab'
import DashboardTab from './WalletModal/tabs/DashboardTab'

import UnauthenticatedContent from './WalletModal/UnauthenticatedContent'

import { FaPaperPlane, FaShoppingCart } from 'react-icons/fa'

import type { TabItem, TabViewType } from './WalletModal/types/tabs'

export interface CypherModalProps {
  onLogin?: (token: string) => void
  onLogout?: () => void
  onLogoutRedirect?: () => void

  forceOpen?: boolean
  onForceClose?: () => void
  hideButton?: boolean

  hideSections?: {
    button?: boolean
    socialLogins?: boolean
    showOnlySocialLogins?: boolean
    footer?: boolean
  }

  buttonText?: string
  themeColor?: string
  buttonTextColor?: string

  modalSize?: ModalProps['size']
  navLinks?: { label: string; href: string; icon?: any }[]
  logo?: string | React.ReactNode

  onlyWallets?: boolean
  rpcUrl?: string
  chainId?: number

  activeTab?: string
  onTabChange?: (tab: string) => void

  headerContent?: React.ReactNode
  footerContent?: React.ReactNode

  backgroundColor?: string // ✅ New prop
}

export function CypherModal({
  onLogin,
  onLogout,
  onLogoutRedirect,
  forceOpen,
  onForceClose,
  hideButton = false,
  hideSections = {},

  buttonText = 'Connect Wallet',
  themeColor = '#FFD700',
  buttonTextColor = 'black',

  modalSize,
  navLinks = [],
  logo,

  onlyWallets = false,
  rpcUrl = '',
  chainId = 5150,

  activeTab,
  onTabChange,

  headerContent,
  footerContent,

  backgroundColor, // ✅ Custom background color
}: CypherModalProps) {
  const disclosure = useDisclosure()
  const toast = useToast()
  const { colorMode } = useColorMode()

  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const { clearToken, token } = useAuth()
  const { data: ensName } = useEnsName({ address })

  const isControlled = typeof forceOpen === 'boolean'
  const isOpen = isControlled ? forceOpen : disclosure.isOpen
  const onOpen = isControlled ? () => {} : disclosure.onOpen
  const onClose = isControlled ? onForceClose || (() => {}) : disclosure.onClose

  const resolvedBgColor = backgroundColor || (colorMode === 'dark' ? 'black' : 'white') // ✅ Color resolution

  const displayName = useMemo(
    () => ensName ?? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''),
    [ensName, address]
  )

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum')

  const defaultTabs: TabItem[] = [
    { label: 'Send', value: 'send', icon: FaPaperPlane },
    { label: 'Buy', value: 'buy', icon: FaShoppingCart },
    { label: 'Receive', value: 'receive' },
    { label: 'Transactions', value: 'transactions' },
    { label: 'View Funds', value: 'view-funds' },
    { label: 'Switch Account', value: 'switch-account' },
  ]

  const isControlledTab = typeof activeTab === 'string'
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTabs[0].value)
  const currentTab = isControlledTab ? activeTab : internalActiveTab

  const setTab = (tab: TabViewType) => {
    if (isControlledTab) {
      onTabChange?.(tab)
    } else {
      setInternalActiveTab(tab)
    }
  }

  useEffect(() => {
    if (token) {
      onLogin?.(token)
    }
  }, [token, onLogin])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await disconnect()
      clearToken()
      onLogout?.()
      onLogoutRedirect?.()
      onClose()

      toast({
        title: 'Logged out',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: 'Logout failed',
        description: error.message || 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const renderTabContent = (): React.ReactNode => {
    if (!isConnected) {
      if (hideSections?.socialLogins) return null

      return (
        <UnauthenticatedContent
          showWallets={true}
          rpcUrl={rpcUrl}
          chainId={chainId}
          onClose={onClose}
        />
      )
    }

    switch (currentTab) {
      case 'send':
        return <SendTabComponent />
      case 'buy':
        return <BuyTabComponent moonpayApiKey="" transakApiKey="" />
      case 'receive':
      case 'transactions':
      case 'view-funds':
      case 'switch-account':
        return (
          <DashboardTab
            onDisconnect={handleLogout}
            onSwitchAccount={() => setTab('switch-account')}
            onViewFunds={() => setTab('view-funds')}
            onTransactions={() => setTab('transactions')}
            onNetworkChange={setSelectedNetwork}
            selectedNetwork={selectedNetwork}
          />
        )
      default:
        return <Box p={4}>Tab content not available.</Box>
    }
  }

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
          buttonSize="sm"
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size={modalSize || '2xl'}>
        <ModalOverlay />
        <ModalContent p={0}>
          <ConnectModalHeader
  headerContent={headerContent}
  displayName={displayName}
  logo={logo}
  isDark={colorMode === 'dark'} // ✅
/>

          <ModalBody p={0}>
            <Box display="flex" flexDirection={{ base: 'column', md: 'row' }}>
              <ConnectModalLeftPane
                isConnected={isConnected}
                leftPaneWidth={{ base: '100%', md: '400px' }}
                panePadding={6}
                resolvedLeftBg={resolvedBgColor}
                onlyWallets={onlyWallets}
                rpcUrl={rpcUrl}
                chainId={chainId}
                onClose={onClose}
                navLinks={navLinks}
                handleLogout={handleLogout}
                location={undefined}
                tabs={isConnected ? defaultTabs : []}
                activeTab={currentTab}
                setActiveTab={setTab}
                activeTabColor={themeColor}
                inactiveTabColor="gray.500"
              />

              <ConnectModalRightPane
                rightPaneWidth={{ base: '100%', md: '600px' }}
                panePadding={6}
                resolvedRightBg={resolvedBgColor}
                rightContent={
                  !isConnected ? (
                    <UnauthenticatedContent
                      showSocialLogins={true}
                      showEmailLogin={true}
                      showPhoneLogin={true}
                      showPasskeyLogin={true}
                      rpcUrl={rpcUrl}
                      chainId={chainId}
                      onClose={onClose}
                    />
                  ) : (
                    renderTabContent()
                  )
                }
                isLoggedIn={isConnected}
                activeTab={currentTab}
              />
            </Box>
          </ModalBody>

          {!hideSections.footer && (
            <ConnectModalFooter
  footerContent={footerContent}
  backgroundColor={colorMode === 'dark' ? 'black' : 'white'} // ✅ optional override
  borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
/>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
