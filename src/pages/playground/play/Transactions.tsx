
import WalletModal from "../../../components/WalletModal/ConnectButton";
import { useDisclosure } from '@chakra-ui/react'

export default function plTransactions() {
  const { onClose } = useDisclosure()

  return (
    <WalletModal 
      forceOpen={true}    // Modal always open
      onForceClose={onClose}  // Allows closing the modal from inside
      hideButton={true}    // Hide the "Connect Wallet" button
    />
  )
}
