import { VStack, Button } from '@chakra-ui/react'
import { useLocation, Link as RouterLink } from 'react-router-dom'

interface ConnectedUserMenuProps {
  navLinks: { label: string; href: string }[]
  onLogout: () => void
  onClose: () => void
}

export default function ConnectedUserMenu({
  navLinks,
  onLogout,
  onClose,
}: ConnectedUserMenuProps) {
  const location = useLocation()

  return (
    <VStack spacing={4} align="stretch">
      <VStack spacing={2} align="stretch">
        {navLinks.map((link) => (
          <Button
            key={link.href}
            as={RouterLink}
            to={link.href}
            onClick={onClose}
            colorScheme={location.pathname.startsWith(link.href) ? 'yellow' : 'gray'}
            variant="outline"
          >
            {link.label}
          </Button>
        ))}
      </VStack>

      <Button onClick={onLogout} colorScheme="red" variant="outline">
        Log Out
      </Button>
    </VStack>
  )
}
