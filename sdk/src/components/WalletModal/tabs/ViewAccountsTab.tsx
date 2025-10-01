'use client'

import { Box, VStack, Heading, Text, List, ListItem } from '@chakra-ui/react'
import { useAccount } from 'wagmi'

interface Account {
  address: string
  balance: string
}

const dummyAccounts: Account[] = [
  { address: '0xAbc123...', balance: '1.5 ETH' },
  { address: '0xDef456...', balance: '3.2 BNB' },
]

export default function ViewAccountsTab() {
  const { address } = useAccount()

  return (
    <Box p={4}>
      <VStack spacing={4} align="start">
        <Heading size="md">Your Accounts</Heading>
        <List spacing={3} w="100%">
          {dummyAccounts.map((acc) => (
            <ListItem
              key={acc.address}
              borderWidth="1px"
              borderRadius="md"
              p={3}
              w="100%"
              bg={acc.address === address ? 'yellow.100' : 'gray.50'}
            >
              <Text fontWeight="bold">{acc.address}</Text>
              <Text>Balance: {acc.balance}</Text>
            </ListItem>
          ))}
        </List>
      </VStack>
    </Box>
  )
}
