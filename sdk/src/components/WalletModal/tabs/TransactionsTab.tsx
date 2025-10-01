'use client'

import { Box, VStack, Heading, Text, List, ListItem } from '@chakra-ui/react'

interface Transaction {
  id: string
  date: string
  amount: string
  status: string
}

const dummyTransactions: Transaction[] = [
  { id: '1', date: '2025-09-29', amount: '0.5 ETH', status: 'Confirmed' },
  { id: '2', date: '2025-09-28', amount: '1.2 BNB', status: 'Pending' },
]

export default function TransactionsTab() {
  return (
    <Box p={4}>
      <VStack spacing={4} align="start">
        <Heading size="md">Transactions</Heading>
        {dummyTransactions.length === 0 ? (
          <Text>No transactions yet.</Text>
        ) : (
          <List spacing={3} w="100%">
            {dummyTransactions.map((tx) => (
              <ListItem
                key={tx.id}
                borderWidth="1px"
                borderRadius="md"
                p={3}
                w="100%"
                display="flex"
                justifyContent="space-between"
                bg="gray.50"
              >
                <Box>
                  <Text fontWeight="bold">ID: {tx.id}</Text>
                  <Text>Date: {tx.date}</Text>
                </Box>
                <Box textAlign="right">
                  <Text>Amount: {tx.amount}</Text>
                  <Text>Status: {tx.status}</Text>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </VStack>
    </Box>
  )
}
