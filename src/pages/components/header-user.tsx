import { Calendar, FlaskConical } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

import { AccountMenu } from '../app/components/account-menu'
import { NavLink } from './nav-link'

export function HeaderUser() {
  return (
    <>
      <nav
        className="relative flex items-center space-x-6 h-8 p-8 border border-b"
      >
        <FlaskConical />
        <Separator className="h-6" orientation="vertical" />

        <NavLink to="/user">
          <Calendar />
          <span>Agendamento</span>
        </NavLink>
        <AccountMenu />
      </nav>
    </>
  )
}
