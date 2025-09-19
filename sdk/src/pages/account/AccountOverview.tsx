// sdk/src/pages/account/AccountOverview.tsx

import { Box, Heading, Text, Button, Stack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export default function AccountOverview() {
  return (
    <Box>
      <Heading mb={4}>👤 Account</Heading>
      <Text mb={6}>Account overview content goes here.</Text>

      <Stack spacing={4}>
        <Link to="/account/settings">
          <Button colorScheme="blue" w="100%">
            Edit Wallet
          </Button>
        </Link>
        {/* Add more cards/links here later */}
      </Stack>
    </Box>
  )
}
