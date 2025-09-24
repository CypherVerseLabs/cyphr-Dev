// components/AccountWallets/WalletList.tsx
import { VStack, Text } from '@chakra-ui/react'
import WalletItem from './WalletItem'

export default function WalletList({ wallets, loading, error, deleteWallet }: any) {
  if (loading) return <Text>Loading wallets...</Text>
  if (error) return <Text color="red.500">Error: {error}</Text>
  if (wallets.length === 0) return <Text>No wallets found.</Text>

  return (
    <VStack align="start" spacing={4}>
      {wallets.map((wallet: any) => (
        <WalletItem key={wallet.address} wallet={wallet} deleteWallet={deleteWallet} />
      ))}
    </VStack>
  )
}
