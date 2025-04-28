import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { GetManyUsersFn } from '@/api/get-many-users'
import { RegisterUserFn } from '@/api/register-user'
import { VerificationEmailFn } from '@/api/verification-email'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export function DialogRegisterUser() {
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

  const [searchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'

  useQuery({
    queryKey: ['getManyUsersKey', page],
    queryFn: () => GetManyUsersFn({ page: Number(page) }),
  })

  const { mutateAsync: registerUserFn } = useMutation({
    mutationFn: RegisterUserFn,
  })

  const { mutateAsync: verify_email } = useMutation({
    mutationFn: VerificationEmailFn,
    onSuccess() {
      toast.success('Um link de verificação foi enviado neste E-mail')
    },
  })

  async function handleRegister({ name, email, password_hash, category }:typeRegisterUserSchema) {
    try {
      const { newUser } = await registerUserFn({
        name,
        email,
        password_hash,
        category,
      })

      await verify_email({ email, newUser })
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preencha os dados para cadastrar</DialogTitle>

        </DialogHeader>

        <form
          action="" className="space-y-3"
          onSubmit={handleSubmit(handleRegister)}
          autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"

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
              autoComplete="off"

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
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input
                bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" {...field}
                >
                  <option value="">Selecione</option>
                  <option value="admin">Admnistrador</option>
                  <option value="user">Usuário</option>
                </select>
              )}
            />
          </div>
          <Button
            className="w-full cursor-pointer text-md"
            disabled={isSubmitting}
            variant="fagammon"
          >Cadastrar
          </Button>
        </form>
      </DialogContent>

    </>
  )
}
