'use client'

import { CypherModal } from "../../../sdk/src/components/ConnectModal";

interface LoginProps {
  phoneNumber?: string;
}

export default function Login({ phoneNumber }: LoginProps) {
  const onClose = () => {
    console.log('Modal force closed');
  }

  // You can use phoneNumber here if needed, e.g.
  console.log('Phone Number:', phoneNumber);

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
  );
}
