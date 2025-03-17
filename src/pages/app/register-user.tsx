import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { RegisterUserFn } from '@/api/register-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function RegisterUser() {
  const registerUserSchema = z.object({
    name: z.string().min(3,
      { message: 'O nome precisa ter pelo menos 3 caracteres' }),
    email: z.string().email({ message: 'E-mail inválido' }),
    password_hash: z.string().min(8,
      { message: 'A senha precisa ter pelo menos 8 caracteres' }),
    category: z.enum(['admin', 'user']),
  })

  type typeRegisterUserSchema = z.infer<typeof registerUserSchema>

  const { register, control, handleSubmit, formState: { isSubmitting, isValidating, errors } } =
  useForm<typeRegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
  })

  const { mutateAsync: registerUserFn } = useMutation({
    mutationFn: RegisterUserFn,
  })
  async function handleRegister({ name, email, password_hash, category }:typeRegisterUserSchema) {
    try {
      await registerUserFn({
        name,
        email,
        password_hash,
        category,
      })
      toast.success('Cadastro realizado com sucesso !')
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response !== undefined) {
          toast.error(`Erro no cadastro: ${e.response.data.message}`)
        }
      }
    }
  }
  return (
    <>
      <Helmet title="Registrar-adm/user" />
      <div className="flex justify-center items-center h-screen">
        <div className="w-[23rem] space-y-4">
          <section className="flex flex-col gap-2">
            <h1 className="text-3xl text-center font-medium">
              Registrar
            </h1>
            <span className="text-center">
              Preencha os campos para o cadastro!
            </span>
          </section>
          <form
            action="" className="space-y-3"
            onSubmit={handleSubmit(handleRegister)}
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="text-foreground font-medium"
              >
                Nome
              </label>
              <Input
                type="text" className="border p-1 rounded-md outline-none"
                {...register('name')}
              />
              <span className="min-h-6">

                <span className="text-xs text-red-500">{!isValidating
                  ? errors.name?.message
                  : ''}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="text-foreground font-medium"
              >
                email
              </label>
              <Input
                type="text" className="border p-1 rounded-md outline-none"
                {...register('email')}
              />
              <span className="min-h-6">

                <span className="text-xs text-red-500">{!isValidating
                  ? errors.email?.message
                  : ''}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="text-foreground font-medium"
              >Senha
              </label>
              <Input
                type="password" className="border p-1 rounded-md outline-none"
                {...register('password_hash')}
              />
              <span className="min-h-6">

                <span className="text-xs text-red-500">{!isValidating
                  ? errors.password_hash?.message
                  : ''}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="text-foreground font-medium"
              >
                Categoria
              </label>
              <Controller
                name="category" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Admnistrador ou Usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admnistrador</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <Button
              className="w-full cursor-pointer"
              disabled={isSubmitting}
              variant="destructive"
            >Finalizar cadastro
            </Button>
          </form>
          <p className="text-center">
            Ao continuar, você concorda com nossos<br />
            <a href="" className="underline underline-offset-4">
              termos de serviço
            </a> e
            <a href="" className="underline underline-offset-4">
              {' '}políticas de privacidade
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
