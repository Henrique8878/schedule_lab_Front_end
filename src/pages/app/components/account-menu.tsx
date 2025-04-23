import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { Building, ChevronDown, LogOut } from 'lucide-react'
import { destroyCookie, parseCookies } from 'nookies'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { GetUserProfileFn } from '@/api/get-user-profile'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { contextApp } from '../context/context-main'
import { ReturningFunctionCaptureUser } from '../register-lab'
import { DialogUpdate } from './dialog'

export function AccountMenu() {
  const navigate = useNavigate()
  const { setIsAuthenticated } = useContext(contextApp)

  const cookie = parseCookies()
  const token = cookie['app.schedule.lab']
  const payload:ReturningFunctionCaptureUser = jwtDecode(token)

  const { data: userProfileData } = useQuery({
    queryKey: ['GetUserProfileKey'],
    queryFn: async () => await GetUserProfileFn({ id: payload.sub }),
  })

  return (
    <div className="absolute right-8 text-muted-foreground text-xl">
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center gap-2 cursor-pointer py-2 px-4 rounded-lg left">
            <span>{userProfileData?.name}</span>
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex flex-col">
              <DropdownMenuLabel className="text-lg">{userProfileData?.name}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs">{userProfileData?.email}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs">{userProfileData?.category === 'admin'
                ? 'Admnistrador'
                : 'Usuário'}
              </DropdownMenuLabel>
            </div>
            <DropdownMenuSeparator />
            <DialogTrigger>
              <DropdownMenuItem className="flex items-center justify-start gap-2 cursor-pointer">
                <Building />
                <span>Perfil do usuário</span>
              </DropdownMenuItem>

            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center justify-start gap-2 text-red-400 cursor-pointer" onClick={() => {
                const cookie = parseCookies()
                if (cookie) {
                  destroyCookie(null, 'app.schedule.lab')
                  localStorage.removeItem('isAuthenticated')
                  setIsAuthenticated(false)
                  navigate('/sign-in')
                  try {
                    toast.success('Logout realizado com sucesso')
                    window.location.reload()
                  } catch {
                    toast.error('Erro ao realizar logout')
                  }
                }
              }}
            >
              <LogOut className="text-red-400" />
              <span>Sair do agendamento</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogUpdate />
      </Dialog>
    </div>
  )
}
