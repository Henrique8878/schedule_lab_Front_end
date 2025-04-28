import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { CreateSignUpEvent } from '@/api/create-sign-up-event'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
interface DialogRegisterSignUpEventProps {
  availabilityId: string
}

export function DialogRegisterSignUpEvent({ availabilityId }:DialogRegisterSignUpEventProps) {
  const registerUserSchema = z.object({
    name: z.string().min(3,
      { message: 'O nome precisa ter pelo menos 3 caracteres' }),
    email: z.string().email({ message: 'E-mail inválido' }),
    telephone: z.string(),

  })

  type typeRegisterUserSchema = z.infer<typeof registerUserSchema>
  const { register, handleSubmit, formState: { isSubmitting, isValidating, errors } } =
    useForm<typeRegisterUserSchema>({
      resolver: zodResolver(registerUserSchema),
    })

  const { mutateAsync: createSignUpEvent } = useMutation({
    mutationFn: CreateSignUpEvent,
  })

  async function handleRegister({ name, email, telephone }:typeRegisterUserSchema) {
    try {
      await createSignUpEvent({
        name,
        email,
        telephone,
        availabilityId,
      })
      toast.success('Inscrição realizada com sucesso')
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message)
      } else {
        toast.error('Erro ao realizar a inscrição')
      }
    }
  }

  return (
    <>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preencha os dados para se inscrever</DialogTitle>

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
            >Telefone
            </label>
            <Input
              type="text" className="border p-1 rounded-md outline-none"
              {...register('telephone')}
              autoComplete="off"

            />
            <span className="min-h-6">
              <span className="text-xs text-red-500">{!isValidating
                ? errors.telephone?.message
                : ''}
              </span>
            </span>
          </div>

          <DialogClose>
            <Button
              type="submit"
              className="w-full cursor-pointer text-md"
              disabled={isSubmitting}
              variant="fagammon"
            >Inscrever
            </Button>
          </DialogClose>

        </form>
      </DialogContent>

    </>
  )
}
