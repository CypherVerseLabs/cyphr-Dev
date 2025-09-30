import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/account/Dashboard'
import Home from './pages/Home'
import PrivateRoute from './pages/PrivateRoute'

import AccountLayout from './pages/account/AccountLayout'
import AccountOverview from './pages/account/AccountOverview'
import AccountSettings from './pages/account/AccountSettings/AccountSettings'
import AccountWallets from './pages/account/AccountWallets'
import AccountDevices from './pages/account/AccountDevices'
import NFTs from './pages/account/NFTs'

import Company from './pages/company'
import Products from './pages/products'
import Solutions from './pages/solutions'
import Resources from './pages/resources'
import DevTools from './pages/devTools'
import SDKs from './pages/sdks'
import Login from './pages/login/login'
import MainLayout from './components/Layouts/MainLayout'

import PlaygroundLayout from './pages/playground/components/PlayLayout'
import Wallets from './pages/playground/play/plWallets'
import PlayMain from './pages/playground/play/playMain'
import Onramp from './pages/account/Onramp'
import Receive from './pages/account/Receive'
import Send from './pages/account/Send'






export default function App() {
  return (
    <Routes>

        {/* 🔓 Public Routes */}
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/company" element={<Company />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/devTools" element={<DevTools />} />
        <Route path="/sdks" element={<SDKs />} />
        
        {/* ✅ Authenticated Account Routes */}
        
        {/* 🔑 Auth route with AuthLayout (optional: no header or different one) */}  

      {/* 🔒 Protected /account/* routes using PrivateRoute and AccountLayout */}
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

          <Route path="send" element={<Send />} />
          <Route path="receive" element={<Receive />} />
          <Route path="buy" element={<Onramp />} />

        </Route>
      </Route>

      {/* 🧪 Playground Routes */}
      <Route path="/playground" element={<PlaygroundLayout />}>
  <Route index element={<PlayMain />} />           // shows at /playground
  <Route path="wallets" element={<Wallets />} />     // shows at /playground/wallets
</Route>
      {/* 404 fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}
