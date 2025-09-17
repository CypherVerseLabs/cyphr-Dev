import { Routes, Route } from 'react-router-dom'
import Layout from '../sdk/src/components/Layout'
import Dashboard from '../sdk/src/pages/account/Dashboard'
import Wallets from '../sdk/src/pages/Wallets'
import Home from '../sdk/src/pages/Home'
import PrivateRoute from '../sdk/src/pages/PrivateRoute'


// ✅ New account pages
import AccountLayout from '../sdk/src/pages/account/AccountLayout'
import AccountOverview from '../sdk/src/pages/account/AccountOverview'
import AccountSettings from '../sdk/src/pages/account/AccountSettings'
import AccountWallets from '../sdk/src/pages/account/AccountWallets'
import AccountDevices from '../sdk/src/pages/account/AccountDevices'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/wallets"
          element={
            <PrivateRoute>
              <Wallets />
            </PrivateRoute>
          }
        />

        {/* ✅ Nested Account Routes */}
        <Route
          path="/account/*"
          element={
            <PrivateRoute>
              <AccountLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<AccountOverview />} />
          <Route path="settings" element={<AccountSettings />} />
          <Route path="wallets" element={<AccountWallets />} />
          <Route path="devices" element={<AccountDevices />} />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}
