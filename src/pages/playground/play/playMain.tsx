// pages/playground/plWallets.tsx

import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import WalletModal from '../../../../sdk/src/components/ConnectButton'

const tabs = ['Mode', 'Button', 'Code']

export default function Wallets() {
  const [activeTab, setActiveTab] = useState('Mode')
  const { onClose } = useDisclosure()

  return (
    <Box>
      {/* Tabs Navigation */}
      <Flex borderBottom="1px solid #ccc" mb={4}>
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant="ghost"
            onClick={() => setActiveTab(tab)}
            borderBottom={activeTab === tab ? '2px solid #c2a225' : '2px solid transparent'}
            borderRadius="0"
            _hover={{ bg: 'gray.100' }}
            px={4}
            py={2}
          >
            {tab}
          </Button>
        ))}
      </Flex>

      {/* Tab Content */}
      <Box>
        {activeTab === 'Mode' && (
          <Text fontSize="md">This is the Mode tab. Add your content here.</Text>
        )}

        {activeTab === 'Button' && (
          <>
            {/* WalletModal always open in this tab */}
            <WalletModal
              forceOpen={true}
              onForceClose={onClose}
              hideButton={true}
              themeColor="#c2a225"
            />
          </>
        )}

        {activeTab === 'Code' && (
          <Text fontSize="md">This is the Code tab. Show your component code here.</Text>
        )}
      </Box>
    </Box>
  )
}
