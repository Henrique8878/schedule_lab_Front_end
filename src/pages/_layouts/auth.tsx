import { Outlet } from 'react-router-dom'

import LogoInteiraFagammon from '../components/assets/Logo540.png'
export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="flex flex-col justify-between bg-muted p-8">
        <div className="flex">
          <img src={LogoInteiraFagammon} className="w-72" />
        </div>
        <span className="text-muted-foreground">
          Painel do parceiro &copy; - {new Date().getFullYear()}
        </span>
      </div>
      <div className="relative"><Outlet /></div>
    </div>
  )
}
