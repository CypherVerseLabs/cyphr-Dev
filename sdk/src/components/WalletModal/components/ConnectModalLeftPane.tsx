import { Box, VStack, Button, useColorModeValue } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { TabViewType } from '../types/tabs'
import UnauthenticatedContent from '../UnauthenticatedContent'

interface TabItem {
  label: string
  value: TabViewType
  icon?: IconType
}

interface ConnectModalLeftPaneProps {
  isConnected: boolean
  leftPaneWidth: string | { base: string; md: string }
  panePadding: string | number
  resolvedLeftBg: string
  onlyWallets: boolean
  rpcUrl: string
  chainId: number
  onClose: () => void
  navLinks: { label: string; href: string; icon?: IconType }[]
  handleLogout: () => void
  location?: any

  tabs: TabItem[]
  activeTab: string
  setActiveTab: (tab: TabViewType) => void
  activeTabColor?: string
  inactiveTabColor?: string

  // Optional if not yet used
  onTabSelect?: (tab: string) => void
}

export default function ConnectModalLeftPane({
  isConnected,
  leftPaneWidth,
  panePadding,
  resolvedLeftBg,
  rpcUrl,
  chainId,
  onClose,
  handleLogout,
  tabs,
  activeTab,
  setActiveTab,
  activeTabColor = 'gold.400',
  inactiveTabColor = 'gray.500',
  onTabSelect,
}: ConnectModalLeftPaneProps) {
  const hoverBg = useColorModeValue('gray.100', 'gray.700')

  if (!isConnected) {
  return (
    <Box width={leftPaneWidth} p={panePadding} overflowY="auto" bg={resolvedLeftBg}>
      <UnauthenticatedContent
  showWallets={true}
  rpcUrl={rpcUrl}
  chainId={chainId}
  onClose={onClose}
/>
    </Box>
  )
}

  return (
    <Box width={leftPaneWidth} p={panePadding} overflowY="auto" bg={resolvedLeftBg}>
      <VStack spacing={4} align="stretch">
        {tabs.map(({ label, value, icon: Icon }) => (
          <Button
            key={value}
            onClick={() => {
              setActiveTab(value)
              onTabSelect?.(value)
            }}
            variant={activeTab === value ? 'solid' : 'ghost'}
            color={activeTab === value ? activeTabColor : inactiveTabColor}
            leftIcon={Icon ? <Icon /> : undefined}
            justifyContent="flex-start"
            fontWeight={activeTab === value ? 'bold' : 'normal'}
            size="md"
            _hover={{
              bg: activeTab === value ? hoverBg : hoverBg,
            }}
          >
            {label}
          </Button>
        ))}

        <Box flexGrow={1} />
        
        <Button
          mt={4}
          colorScheme="red"
          variant="outline"
          onClick={handleLogout}
        >
          Disconnect Wallet
        </Button>
      </VStack>
    </Box>
  )
}
