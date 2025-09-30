// src/pages/Onramp.tsx
'use client'


export default function Onramp() {
  return (
    <div>
      <h1>Buy Crypto</h1>
      <iframe
        src="https://buy.ramp.network/?hostAppName=YourApp&hostLogoUrl=https://yourapp.com/logo.png"
        width="100%"
        height="600"
        frameBorder="0"
      />
    </div>
  )
}
