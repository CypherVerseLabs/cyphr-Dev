import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from '../sdk/src/pages/account/Dashboard'
import Home from './pages/Home'
import PrivateRoute from '../sdk/src/pages/PrivateRoute'

import AccountLayout from '../sdk/src/pages/account/AccountLayout'
import AccountOverview from '../sdk/src/pages/account/AccountOverview'
import AccountSettings from '../sdk/src/pages/account/AccountSettings'
import AccountWallets from '../sdk/src/pages/account/AccountWallets'
import AccountDevices from '../sdk/src/pages/account/AccountDevices'
import NFTs from '../sdk/src/pages/account/NFTs'

import Company from './pages/company'
import Products from './pages/products'
import Solutions from './pages/solutions'
import Resources from './pages/resources'
import DevTools from './pages/devTools'
import SDKs from './pages/sdks'
import Login from './pages/login/login'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/company" element={<Company />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/devTools" element={<DevTools />} />
        <Route path="/sdks" element={<SDKs />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Authenticated Account Routes */}
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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="nfts" element={<NFTs />} />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}
