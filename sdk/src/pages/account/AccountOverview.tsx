import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  VStack,
  HStack,
  Link as ChakraLink,
  Divider,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'My Account', href: '/account' },
  { label: 'My Wallets', href: '/account/wallets' },
  { label: 'NFTs', href: '/account/nfts' },
  { label: 'Settings', href: '/account/settings' },
  { label: 'Devices', href: '/account/devices' },
]

export default function AccountOverview() {
  return (
    <HStack align="start" spacing={8} p={6}>
      {/* Sidebar Navigation */}
      <VStack align="start" spacing={4} minW="200px" mt={2}>
        <Heading size="md">👤 Account overview</Heading>
        <Divider />
        {navLinks.map((link) => (
          <ChakraLink
            key={link.href}
            as={Link}
            to={link.href}
            fontWeight="medium"
            _hover={{ color: 'blue.400' }}
          >
            {link.label}
          </ChakraLink>
        ))}
      </VStack>

      {/* Main Content */}
      <Box flex="1">
        <Heading mb={4}>👤 Account overview</Heading>
        <Text mb={6}>Account overview content goes here.</Text>

        <Stack spacing={4}>
          <Link to="/wallets">
            <Button colorScheme="blue" w="100%">
              Go to Wallet Manager
            </Button>
          </Link>
          {/* Add more cards/links here later */}
        </Stack>
      </Box>
    </HStack>
  )
}
