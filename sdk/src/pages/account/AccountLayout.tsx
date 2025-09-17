import { Outlet, NavLink } from 'react-router-dom'

export default function AccountLayout() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

      {/* Sub-nav */}
      <nav className="flex gap-4 mb-6 border-b pb-2">

        <NavLink to="/account/dashboard" className={({ isActive }) => isActive ? 'font-bold' : ''}>
  📊 Dashboard
</NavLink>
        <NavLink to="/account/settings" className={({ isActive }) => isActive ? 'font-bold' : ''}>
  ⚙️ Settings
</NavLink>
<NavLink to="/account/nft" className={({ isActive }) => isActive ? 'font-bold' : ''}>
  🎨 NFT's
</NavLink>
<NavLink to="/account/wallets" className={({ isActive }) => isActive ? 'font-bold' : ''}>
  👛 Wallets
</NavLink>
<NavLink to="/account/devices" className={({ isActive }) => isActive ? 'font-bold' : ''}>
  🖥 Devices
</NavLink>

      </nav>

      <Outlet />
    </div>
  )
}
