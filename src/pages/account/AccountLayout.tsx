// sdk/src/pages/account/AccountLayout.tsx

import { HStack, Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import SidebarNav from '../../../sdk/src/components/WalletModal/SidebarNav' // adjust path if needed

export default function AccountLayout() {
  return (
    <HStack align="start" spacing={8} p={6}>
      {/* Sidebar Navigation */}
      <SidebarNav title="👤 Account Menu" />

      {/* Outlet renders child routes like Dashboard, Wallets, etc. */}
      <Box flex="1">
        <Outlet />
      </Box>
    </HStack>
  )
}
