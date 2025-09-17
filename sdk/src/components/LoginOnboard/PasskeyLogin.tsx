'use client'

export default function PasskeyLogin() {
  const handlePasskeyLogin = () => {
    alert('Passkey login clicked')
    // 🔐 Placeholder — integrate with WebAuthn/FIDO2 later
  }

  return (
    <button
      onClick={handlePasskeyLogin}
      className="w-full bg-purple-600 text-white py-2 rounded"
    >
      Continue with Passkey
    </button>
  )
}
