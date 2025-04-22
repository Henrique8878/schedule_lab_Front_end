import { destroyCookie, parseCookies } from 'nookies'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { contextApp } from '../context/context-main'

export function LogOutFunction() {
  const { setIsAuthenticated } = useContext(contextApp)
  const navigate = useNavigate()

  const cookie = parseCookies()
  if (cookie['app.schedule.lab']) {
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
}
