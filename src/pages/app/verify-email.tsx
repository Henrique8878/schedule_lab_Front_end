import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { FirstAuthenticateFn } from '@/api/first-authenticate'
import { Progress } from '@/components/ui/progress'

import { contextApp } from './context/context-main'

interface HandleSignInParams {
  email: string
}

export function VerifyEmail() {
  const { setIsAuthenticated } = useContext(contextApp)
  const [progress, setProgress] = useState(50)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const { mutateAsync: firstAuthenticateFn } = useMutation({
    mutationFn: FirstAuthenticateFn,
  })

  async function handleSignIn({ email }:HandleSignInParams) {
    try {
      const { token } = await firstAuthenticateFn({
        email,
      })
      setCookie(undefined, 'app.schedule.lab', token)

      toast.success('Usuário autenticado com sucesso')

      const cookie = parseCookies()
      if (cookie) {
        setIsAuthenticated(true)
      }
      setProgress(100)
      navigate('/admin', { replace: true })
      window.location.reload()
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response !== undefined) {
          toast.error(`Erro na autenticação do usuário: 
              ${e.response.data.message}`)
        }
      }
    }
  }

  useEffect(() => {
    try {
      handleSignIn({ email })
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(`Errona verificação do E-mail: ${e.message}`)
      }

      toast.error('Erro no servidor')
    }
  })

  return (
    <main className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col gap-6">
        <span>Carregando perfil</span>
        <Progress value={progress} />
      </div>
    </main>
  )
}
