import { Outlet } from 'react-router-dom'

import { HeaderUser } from '../components/header-user'
export function AppUserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderUser />
      <Outlet />
    </div>
  )
}
