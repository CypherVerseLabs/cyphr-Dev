// components/SidebarNav.tsx
import {
  VStack,
  Heading,
  Divider,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: '📊 Dashboard', href: '/account/dashboard' },
  { label: '👤 My Account', href: '/account' },
  { label: '👛 Wallets', href: '/account/wallets' },
  { label: '🖼️ NFTs', href: '/account/nfts' },
  { label: '⚙️ Settings', href: '/account/settings' },
  { label: '🖥 Devices', href: '/account/devices' },
]

export default function SidebarNav({ title }: { title: string }) {
  const location = useLocation()

  return (
    <VStack align="start" spacing={4} minW="200px" mt={2}>
      <Heading size="md">{title}</Heading>
      <Divider />
      {navLinks.map((link) => (
        <ChakraLink
          key={link.href}
          as={Link}
          to={link.href}
          fontWeight="medium"
          _hover={{ color: 'blue.400' }}
          color={location.pathname === link.href ? 'blue.500' : undefined}
        >
          {link.label}
        </ChakraLink>
      ))}
    </VStack>
  )
}
