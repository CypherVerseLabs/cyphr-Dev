import WalletModal from "../../../sdk/src/components/Modal";
import { useDisclosure } from '@chakra-ui/react'

export default function Login() {
  const { onClose } = useDisclosure()

  return (
    <WalletModal 
      forceOpen={true}    // Modal always open
      onForceClose={onClose}  // Allows closing the modal from inside
      hideButton={true}    // Hide the "Connect Wallet" button
    />
  )
}


