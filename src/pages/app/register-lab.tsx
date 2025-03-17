import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { parseCookies } from 'nookies'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { RegisterLabFn } from '@/api/register-lab'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ReturningFunctionCaptureUser {
  iat: number,
  sub: string
}

export function RegisterLab() {
  const registerLaboratorySchema = z.object({
    name: z.string().min(6,
      { message: 'O nome precisa ter pelo menos 6 caracteres' }),
    localization: z.string().min(2,
      { message: 'o campo precisa ter pelo menos 2 caracteres' }),
    capacity: z.string(),
    description: z.string(),
  })

  // converter o capacity para number na hora de enviar
  type typeRegisterLaboratorySchema = z.infer<typeof registerLaboratorySchema>

  const {
    register, handleSubmit,
    formState: { isSubmitting, isValidating, errors },
  } =
  useForm<typeRegisterLaboratorySchema>({
    resolver: zodResolver(registerLaboratorySchema),
  })

  const { mutateAsync: registerLabFn } = useMutation({
    mutationFn: RegisterLabFn,
  })

  function captureIdUser():ReturningFunctionCaptureUser {
    const cookie = parseCookies()
    const token = cookie['app.schedule.lab']
    const payload:ReturningFunctionCaptureUser = jwtDecode(token)
    return payload
  }

  console.log(captureIdUser().sub)
  async function handleRegister({ name, localization, capacity, description }:typeRegisterLaboratorySchema) {
    try {
      await registerLabFn({
        userId: captureIdUser().sub,
        name,
        localization,
        capacity: Number(capacity),
        description,
      })

      toast.success('Laboratório cadastrado com sucesso!')
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response !== undefined) {
          toast.error(`Erro ao cadastrar laboratório: ${e.response.data.message}`)
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
              Registrar laboratório
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
                Localização
              </label>
              <Input
                type="text" className="border p-1 rounded-md outline-none"
                {...register('localization')}
              />
              <span className="min-h-6">

                <span className="text-xs text-red-500">{!isValidating
                  ? errors.localization?.message
                  : ''}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="text-foreground font-medium"
              >Capacidade
              </label>
              <Input
                type="number" className="border p-1 rounded-md outline-none"
                {...register('capacity')}
                min={1}
                max={100}
              />
              <span className="min-h-6">

                <span className="text-xs text-red-500">{!isValidating
                  ? errors.capacity?.message
                  : ''}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="text-foreground font-medium"
              >
                Descrição
              </label>
              <Textarea {...register('description')} />
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
