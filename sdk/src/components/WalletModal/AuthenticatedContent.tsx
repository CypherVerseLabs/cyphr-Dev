'use client'

import { VStack, Button } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate, matchPath } from 'react-router-dom'
import { IconType } from 'react-icons'



interface NavLink {
  label: string
  href: string
  icon?: IconType
}

interface AuthenticatedContentProps {
  navLinks: NavLink[]
  onLogout: () => void
  onClose: () => void
  currentPath: string
  logoutRedirectPath?: string
}

export default function AuthenticatedContent({
  navLinks,
  onLogout,
  onClose,
  currentPath,
  logoutRedirectPath = '/login',
}: AuthenticatedContentProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    onClose()
    navigate(logoutRedirectPath)
  }

  return (
    <VStack spacing={4} align="stretch">
      <VStack spacing={2} align="stretch">
        {navLinks.map((link) => {
          const isActive = !!matchPath({ path: link.href, end: false }, currentPath)
          return (
            <Button
              key={link.href}
              as={RouterLink}
              to={link.href}
              onClick={onClose}
              colorScheme={isActive ? 'yellow' : 'gray'}
              variant="outline"
              aria-current={isActive ? 'page' : undefined}
              leftIcon={link.icon ? <link.icon /> : undefined}
            >
              {link.label}
            </Button>
          )
        })}
      </VStack>

      <Button onClick={handleLogout} colorScheme="red" variant="outline">
        Disconnect Wallet
      </Button>
    </VStack>
  )
}
