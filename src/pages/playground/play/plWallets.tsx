
import WalletModal from "../../../components/ConnectButton";
import { useDisclosure } from '@chakra-ui/react'

export default function plwallets() {
  const { onClose } = useDisclosure()

  return (
    <WalletModal 
      forceOpen={true}    // Modal always open
      onForceClose={onClose}  // Allows closing the modal from inside
      hideButton={true}    // Hide the "Connect Wallet" button
    />
  )
}
