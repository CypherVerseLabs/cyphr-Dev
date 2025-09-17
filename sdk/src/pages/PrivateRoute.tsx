// pages/PrivateRoute.tsx
import { useAccount } from 'wagmi'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return <Navigate to="/" replace />
  }

  return children
}
