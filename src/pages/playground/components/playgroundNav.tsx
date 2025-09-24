

import { VStack, Heading, Divider, Link as ChakraLink } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'

export const playgroundLinks = [
  {
    label: '👛 Wallets',
    children: [
      { label: 'Overview', href: '/playground/wallets' },
      { label: 'Connect Button', href: '/playground/connect-button' },
      { label: 'Connect Embed', href: '/playground/connect-embed' },
      { label: 'Headless Connect', href: '/playground/headless-connect' },
      { label: 'In-App Wallets', href: '/playground/in-app-wallets' },
      { label: 'Ecosystem Wallets', href: '/playground/ecosystem-wallets' },
      { label: 'Authentication (SIWE)', href: '/playground/siwe-auth' },
      { label: 'Social Profiles', href: '/playground/social-profiles' },
      { label: 'Headless Components', href: '/playground/headless-components' },
      { label: 'Transactions', href: '/playground/native-balance' },
    ]
  },
  { label: '💸 Transactions', href: '/playground/native-balance' },
  { label: '📜 Contracts', href: '/playground/feature-cards' },
  { label: '🌉 Bridge', href: '/playground/api-test' },
  { label: '🪙 Tokens', href: '/playground/native-balance' },
  { label: '🧩 Account Abstraction', href: '/playground/feature-cards' },
  { label: '📘 API Reference', href: '/playground/api-test' },
];



export default function PlaygroundNav({ title = 'Playground Nav' }: { title?: string }) {
  const location = useLocation()

  return (
    <VStack align="start" spacing={4} minW="220px" mt={2}>
      <Heading size="sm">{title}</Heading>
      <Divider />
      {playgroundLinks.map((link) => (
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
