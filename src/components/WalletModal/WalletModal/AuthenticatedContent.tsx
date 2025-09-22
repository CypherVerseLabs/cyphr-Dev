// AuthenticatedContent.tsx
'use client'

import { VStack, Button } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

interface NavLink {
  label: string
  href: string
}

interface AuthenticatedContentProps {
  navLinks: NavLink[]
  onLogout: () => void
  onClose: () => void
  currentPath: string
}

export default function AuthenticatedContent({
  navLinks,
  onLogout,
  onClose,
  currentPath,
}: AuthenticatedContentProps) {
  return (
    <VStack spacing={4} align="stretch">
      <VStack spacing={2} align="stretch">
        {navLinks.map((link) => (
          <Button
            key={link.href}
            as={RouterLink}
            to={link.href}
            onClick={onClose}
            colorScheme={
              currentPath.startsWith(link.href) ? 'yellow' : 'gray'
            }
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
