import { Calendar, Home, Pen, User } from 'lucide-react'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'

import { AccountMenu } from '../app/components/account-menu'
import logoFagammon from './assets/images.jpeg'
import { NavLink } from './nav-link'
export function Header() {
  return (
    <>
      <nav
        className="relative flex items-center space-x-6 h-8 p-8 border border-b"
      >
        <img src={logoFagammon} alt="" className="w-12 h-12" />
        <Separator className="h-6" orientation="vertical" />

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-md">Início</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>
                  <NavLink to="/admin">
                    <Home />
                    <span>Início</span>
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-md">Cadastrar</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>
                  <NavLink to="/admin/register-user">
                    <User />
                    <span>Admin/Usuário</span>
                  </NavLink>
                </NavigationMenuLink>
                <NavigationMenuLink>
                  <NavLink to="/admin/register-lab">
                    <Pen />
                    <span>Laboratório</span>
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-md">Agendar</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>
                  <NavLink to="/admin/scheduling">
                    <Calendar />
                    <span>Agendamento</span>
                  </NavLink>
                </NavigationMenuLink>

              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <AccountMenu />
      </nav>
    </>
  )
}
