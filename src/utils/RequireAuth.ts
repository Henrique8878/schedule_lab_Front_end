import { parseCookies } from 'nookies'
import React from 'react'
import { useNavigate } from 'react-router-dom'

// Componente para proteger rotas
export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const cookies = parseCookies() // Obtém todos os cookies

  // Verifica se o cookie de autenticação existe
  const token = cookies['app.schedule.lab']

  if (!token) {
    // Se o token não existir, redireciona para o login
    navigate('/sign-in', { replace: true })
    return null // Retorna null enquanto o redirecionamento ocorre
  }

  // Se o token existir, renderiza o conteúdo protegido
  return { children }
}
