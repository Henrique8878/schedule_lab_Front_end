import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { useContext } from 'react'
import { } from 'react-auth-kit'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { AuthenticateFn } from '@/api/authenticate'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { contextApp } from '../app/context/context-main'

export function SignIn() {
  const { setIsAuthenticated } = useContext(contextApp)
  const formSignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const navigate = useNavigate()

  type typeFormSignUpSchema = z.infer<typeof formSignUpSchema>

  const { register, handleSubmit, formState: { isSubmitting } } =
  useForm<typeFormSignUpSchema>({
    resolver: zodResolver(formSignUpSchema),
  })

  const { mutateAsync: authenticateFn } = useMutation({
    mutationFn: AuthenticateFn,
  })

  async function handleSignIn({ email, password }:typeFormSignUpSchema) {
    try {
      const { token } = await authenticateFn({
        email,
        password,
      })
      console.log(token)
      setCookie(undefined, 'app.schedule.lab', token)

      toast.success('Usuário autenticado com sucesso')

      const cookie = parseCookies()
      if (cookie) {
        setIsAuthenticated(true)
      }
      navigate('/admin', { replace: true })
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response !== undefined) {
          toast.error(`Erro na autenticação do usuário: 
            ${e.response.data.message}`)
        }
      }
    }
  }

  return (

    <>
      <Helmet title="Sign-in" />
      <div className="flex justify-center items-center h-screen">
        <div className="w-[23rem] space-y-4">
          <section className="flex flex-col gap-2">
            <h1 className="text-3xl text-center font-medium">
              Faça login para reservar seu laboratório
            </h1>
            <span className="text-center">
              Acesse sua conta para gerenciar suas
              reservas e agendar horários de uso do laboratório.
            </span>
          </section>
          <form
            action="" className="space-y-6"
            onSubmit={handleSubmit(handleSignIn)}
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="inp_email"
                className="text-foreground font-medium"
              >
                E-mail
              </label>
              <Input
                type="text" className="border p-1 rounded-md outline-none"
                {...register('email')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="inp_email"
                className="text-foreground font-medium"
              >Senha
              </label>
              <Input
                type="password" className="border p-1 rounded-md outline-none"
                {...register('password')}
              />
            </div>
            <Button
              className="w-full cursor-pointer"
              disabled={isSubmitting}
              variant="fagammon"
            >Fazer login
            </Button>

          </form>
          <p className="text-center">
            Ao continuar, você concorda com nossos<br />
            <a className="underline underline-offset-4">
              termos de serviço
            </a> e
            <a className="underline underline-offset-4">
              políticas de privacidade
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
