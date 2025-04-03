import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { parseCookies } from 'nookies'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { GetManyLaboratoriesReturn } from '@/api/get-many-laboratories'
import { RegisterLabFn } from '@/api/register-lab'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { ReturningFunctionCaptureUser } from '../register-lab'

export function DialogRegisterLab() {
  const registerLaboratorySchema = z.object({
    name: z.string().min(6,
      { message: 'O nome precisa ter pelo menos 6 caracteres' }),
    localization: z.string().min(2,
      { message: 'o campo precisa ter pelo menos 2 caracteres' }),
    capacity: z.string(),
    description: z.string(),
  })

  type typeRegisterLaboratorySchema = z.infer<typeof registerLaboratorySchema>

  const {
    register, handleSubmit,
    formState: { isSubmitting, isValidating, errors },
  } =
    useForm<typeRegisterLaboratorySchema>({
      resolver: zodResolver(registerLaboratorySchema),
    })

  const queryClient = useQueryClient()

  const [searchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'

  const { mutateAsync: registerLabFn } = useMutation({
    mutationFn: RegisterLabFn,
    onSuccess(data) {
      const cached = queryClient.getQueryData(['getManyLaboratoriesKey', page])

      if (cached) {
        const cachedLab:GetManyLaboratoriesReturn = cached as GetManyLaboratoriesReturn
        queryClient.setQueryData(['getManyLaboratoriesKey'], {
          ...cachedLab,
          laboratories: [...cachedLab.laboratories, data],
        })
      }
      toast.success('Laboratório cadastrado com sucesso!')
    },
  })

  function captureIdUser():ReturningFunctionCaptureUser {
    const cookie = parseCookies()
    const token = cookie['app.schedule.lab']
    const payload:ReturningFunctionCaptureUser = jwtDecode(token)
    return payload
  }

  async function handleRegister({ name, localization, capacity, description }:typeRegisterLaboratorySchema) {
    try {
      await registerLabFn({
        userId: captureIdUser().sub,
        name: name.toLowerCase(),
        localization,
        capacity: Number(capacity),
        description,
      })
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preencha os dados para cadastrar</DialogTitle>
        </DialogHeader>
        <form
          action="" className="space-y-3"
          onSubmit={handleSubmit(handleRegister)}
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor=""
              className="text-foreground font-medium"
            >
              Nome do laboratoŕio
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
