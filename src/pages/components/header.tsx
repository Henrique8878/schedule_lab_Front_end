import { Calendar, Home, Pen, User } from 'lucide-react'
import { FlaskConical } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

import { NavLink } from './nav-link'
export function Header() {
  return (
    <>
      <nav
        className="relative flex items-center space-x-6 h-8 p-8 border border-b"
      >
        <FlaskConical />
        <Separator className="h-6" orientation="vertical" />
        <NavLink to="/admin">
          <Home />
          <span>Início</span>
        </NavLink>
        <NavLink to="/admin/register-user">
          <User />
          <span>Cadastrar Admin/Usuário</span>
        </NavLink>
        <NavLink to="/admin/register-lab">
          <Pen />
          <span>Cadastrar Laboratório</span>
        </NavLink>
        <NavLink to="/admin/scheduling">
          <Calendar />
          <span>Agendamento</span>
        </NavLink>

      </nav>
    </>
  )
}
