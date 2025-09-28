'use client'

import ConnectModal from '../../components/ConnectModal'  // Adjust the path if needed

export default function Login() {
  const onClose = () => {
    // Implement what should happen when modal closes forcibly, if needed
    // For now, maybe just a no-op or console.log
    console.log('Modal force closed')
  }

  return (
    <ConnectModal
      forceOpen={true}     // Modal always open
      onForceClose={onClose} // Allows closing the modal from inside
      hideButton={true}     // Hide the connect wallet button
    />
  )
}
