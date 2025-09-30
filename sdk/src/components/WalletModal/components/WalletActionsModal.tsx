// src/components/WalletActionsTabs.tsx
'use client'

import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react'
import SendTab from './tabs/SendTab'
import ReceiveTab from './tabs/ReceiveTab'
import BuyTab from './tabs/BuyTab'

export default function WalletActionsTabs() {
  const bg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('black', 'white')

  return (
    <Box
      w="full"
      h="full"
      bg={bg}
      color={textColor}
      p={4}
      borderRadius="md"
    >
      <Tabs isFitted variant="enclosed">
        <TabList mb="4">
          <Tab>Send</Tab>
          <Tab>Receive</Tab>
          <Tab>Buy</Tab>
        </TabList>
        <TabPanels h="100%">
          <TabPanel p={0}>
            <SendTab />
          </TabPanel>
          <TabPanel p={0}>
            <ReceiveTab />
          </TabPanel>
          <TabPanel p={0}>
            <BuyTab moonpayApiKey={''} transakApiKey={''} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
