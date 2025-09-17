'use client'

import React, { useRef, useEffect, useState } from 'react'

export function WalletLoginCard() {
  const [password, setPassword] = useState('')
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (logoRef.current) {
        const { left, top, width, height } = logoRef.current.getBoundingClientRect()
        const x = (e.clientX - left - width / 2) / 20
        const y = (e.clientY - top - height / 2) / 20
        logoRef.current.style.transform = `translate(${x}px, ${y}px)`
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleUnlock = () => {
    console.log('Unlocking wallet with password:', password)
    // TODO: implement actual unlock logic
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUnlock()
    }
  }

  return (
    <div className="w-full max-w-[400px] mx-auto p-6 bg-white rounded-2xl shadow-lg text-center space-y-6">
      <div className="flex justify-center">
        <img
          ref={logoRef}
          src="/fox.svg"
          alt="Cyph Logo"
          className="w-20 h-20 transition-transform duration-150 hover:scale-110"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
        <p className="text-gray-500 text-sm">Enter your password to unlock your wallet</p>
      </div>

      <div className="space-y-3">
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="current-password"
          aria-label="Wallet password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          type="button"
          onClick={handleUnlock}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-md font-medium transition-all"
        >
          🔓 Unlock
        </button>
      </div>

      <div className="text-sm text-gray-500 space-y-1">
        <p>
          <a href="#" className="text-orange-600 hover:underline">
            Forgot password?
          </a>
        </p>
        <p>
          Need help?{' '}
          <a
            href="https://support.metamask.io"
            className="text-orange-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Cyph Support
          </a>
        </p>
      </div>
    </div>
  )
}
