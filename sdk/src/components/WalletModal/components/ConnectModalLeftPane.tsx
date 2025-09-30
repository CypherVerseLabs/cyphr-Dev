import { Box, VStack } from '@chakra-ui/react'
import UnauthenticatedContent from '../UnauthenticatedContent'
import AuthenticatedContent from '../AuthenticatedContent'
import { Location } from 'react-router-dom'
import { IconType } from 'react-icons'

interface ConnectModalLeftPaneProps {
  isConnected: boolean
  leftPaneWidth: string
  panePadding: string | number
  resolvedLeftBg: string
  onlyWallets: boolean
  rpcUrl: string
  chainId: number
  onClose: () => void
  navLinks: { label: string; href: string; icon?: IconType }[]
  handleLogout: () => void
  location?: Location // ✅ Optional now
  onOpenWalletActions?: () => void
}

export default function ConnectModalLeftPane({
  isConnected,
  leftPaneWidth,
  panePadding,
  resolvedLeftBg,
  onlyWallets,
  rpcUrl,
  chainId,
  onClose,
  navLinks,
  handleLogout,
  location,
}: ConnectModalLeftPaneProps) {
  return (
    <Box width={leftPaneWidth} p={panePadding} overflowY="auto" bg={resolvedLeftBg}>
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
            currentPath={location?.pathname ?? ''} // ✅ Optional chaining to avoid undefined error
          />
        )}
      </VStack>
    </Box>
  )
}
