'use client'

import React from 'react'
import { Box } from '@chakra-ui/react'

// Import your tab components here
import SendTabComponent from '../tabs/SendTab'
import BuyTabComponent from '../tabs/BuyTab'
import ReceiveTab from '../tabs/ReceiveTab'
// import other tabs as needed

interface ConnectModalRightPaneProps {
  rightPaneWidth: string | { base: string; md: string }
  panePadding: string | number
  resolvedRightBg: string
  rightContent?: React.ReactNode
  isLoggedIn: boolean
  activeTab: string
}

export default function ConnectModalRightPane({
  rightPaneWidth,
  panePadding,
  resolvedRightBg,
  rightContent,
  activeTab,
}: ConnectModalRightPaneProps) {
  let tabContent = null

  switch (activeTab) {
    case 'send':
      tabContent = <SendTabComponent />
      break
    case 'buy':
      tabContent = <BuyTabComponent moonpayApiKey={''} transakApiKey={''} />
      break
    case 'receive':
      tabContent = <ReceiveTab />
      break
    // Add other tabs here with your components
    case 'transactions':
      tabContent = <Box>Transactions tab content coming soon</Box>
      break
    case 'view-funds':
      tabContent = <Box>View Funds tab content coming soon</Box>
      break
    case 'switch-account':
      tabContent = <Box>Switch Account tab content coming soon</Box>
      break
    default:
      tabContent = <Box>Tab content not found</Box>
  }

  return (
    <Box
      width={rightPaneWidth}
      p={panePadding}
      bg={resolvedRightBg}
      overflowY="auto"
      height="100%"
      minHeight="400px"
    >
      {rightContent || tabContent}
    </Box>
  )
}
