'use client'

import CypherModal from "../../../sdk/src/components/ConnectModal";

export default function Login() {
  const onClose = () => {
    // Implement what should happen when modal closes forcibly, if needed
    // For now, maybe just a no-op or console.log
    console.log('Modal force closed')
  }

  return (
    <CypherModal
  forceOpen={true}
  onForceClose={onClose}
  hideSections={{
    button: true,
    socialLogins: true,
    footer: true,
    
  }}
/>

  )
}
