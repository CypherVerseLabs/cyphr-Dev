'use client'

import { useState } from 'react'

export default function PhoneLogin() {
  const [phone, setPhone] = useState('')

  const handlePhoneLogin = () => {
    alert(`Phone login: ${phone}`)
    // 🔒 Replace with actual login logic (e.g., OTP or third-party)
  }

  return (
    <div className="space-y-2">
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone number"
        className="w-full border px-3 py-2 rounded"
      />
      <button
        onClick={handlePhoneLogin}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Continue with Phone
      </button>
    </div>
  )
}
