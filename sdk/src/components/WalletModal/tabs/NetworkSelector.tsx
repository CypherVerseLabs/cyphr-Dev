'use client'

import { Box, Select, Text } from '@chakra-ui/react'
import { useState } from 'react'

const networks = [
  { label: 'Sepolia', value: 'sepolia' },
  { label: 'BNB Chain', value: 'bnb' },
  { label: 'Ethereum', value: 'eth' },
  { label: 'Polygon', value: 'polygon' },
]

interface NetworkSelectorProps {
  onNetworkChange: (network: string) => void
  selectedNetwork?: string
}

export default function NetworkSelector({
  onNetworkChange,
  selectedNetwork = 'sepolia',
}: NetworkSelectorProps) {
  const [network, setNetwork] = useState(selectedNetwork)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNetwork(e.target.value)
    onNetworkChange(e.target.value)
  }

  return (
    <Box w="full" maxW="300px">
      <Text mb={2} fontWeight="bold">
        Select Network
      </Text>
      <Select value={network} onChange={handleChange} placeholder="Select network">
        {networks.map((net) => (
          <option key={net.value} value={net.value}>
            {net.label}
          </option>
        ))}
      </Select>
    </Box>
  )
}
