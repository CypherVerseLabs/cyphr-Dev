// sdk/src/pages/account/AccountDevices.tsx

import { Box, Heading, Text, Button, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export default function AccountDevices() {
  return (
    <Box>
      <Heading mb={4}>🖥 Connected Devices</Heading>
      <Text mb={6}>🖥 Connected devices content goes here.</Text>

      <Stack spacing={4}>
        <Link to="/account/wallets">
          <Button colorScheme="blue" w="100%">
            Go to Wallet Manager
          </Button>
        </Link>
      </Stack>
    </Box>
  )
}
