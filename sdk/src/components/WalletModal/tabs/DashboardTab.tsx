import { VStack, Center, HStack, Button, Box, Select, Spacer, Image, Text } from '@chakra-ui/react'
import { useState } from 'react'
import TransactionsTabComponent from './TransactionsTab'
import ViewFundsTabComponent from './ViewAccountsTab'
import SwitchAccountTabComponent from './NetworkSelector'

// Add this prop to your interface:
interface DashboardTabProps {
  onDisconnect: () => void
  onSwitchAccount: () => void
  onViewFunds: () => void
  onTransactions: () => void
  onNetworkChange: (network: string) => void
  selectedNetwork: string
}

export default function DashboardTab({
  onDisconnect,
  onSwitchAccount,
  onViewFunds,
  onTransactions,
  selectedNetwork,
  onNetworkChange,
}: DashboardTabProps) {
  const [selectedTab, setSelectedTab] = useState<'transactions' | 'view-funds' | 'switch-account'>('transactions')

  // You may also use props to sync this from parent if needed

  return (
    <VStack spacing={6} h="full" p={4} align="stretch">
      <Center>
        <Image src="/path-to-your-logo.png" alt="Logo" boxSize="100px" objectFit="contain" />
      </Center>

      {/* Navigation Buttons */}
      <HStack spacing={4}>
        <Button
          colorScheme="blue"
          flex={1}
          onClick={() => {
            setSelectedTab('transactions')
            onTransactions()
          }}
        >
          Transactions
        </Button>
        <Button
          colorScheme="green"
          flex={1}
          onClick={() => {
            setSelectedTab('view-funds')
            onViewFunds()
          }}
        >
          View Funds
        </Button>
        <Button
          colorScheme="purple"
          flex={1}
          onClick={() => {
            setSelectedTab('switch-account')
            onSwitchAccount()
          }}
        >
          Switch Account
        </Button>
      </HStack>

      {/* Network Selector */}
      <Box w="full">
        <Text fontWeight="bold" mb={2}>Select Network</Text>
        <Select
          value={selectedNetwork}
          onChange={(e) => onNetworkChange(e.target.value)}
        >
          {['Sepolia', 'BNB', 'ETH'].map((network) => (
            <option key={network} value={network}>
              {network}
            </option>
          ))}
        </Select>
      </Box>

      {/* Spacer pushes the disconnect button down */}
      <Spacer />

      {/* Dynamic Content */}
      <Box flex="1" w="full">
        {selectedTab === 'transactions' && <TransactionsTabComponent />}
        {selectedTab === 'view-funds' && <ViewFundsTabComponent />}
        {selectedTab === 'switch-account' && <SwitchAccountTabComponent onNetworkChange={function (_network: string): void {
  throw new Error('Function not implemented.')
}} />}
      </Box>

      {/* Disconnect button */}
      <Box pt={8}>
        <Button colorScheme="red" variant="outline" w="full" onClick={onDisconnect}>
          Disconnect Wallet
        </Button>
      </Box>
    </VStack>
  )
}
