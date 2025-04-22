import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { parseCookies } from 'nookies'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { GetManyLaboratoriesFn } from '@/api/get-many-laboratories'
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
    startOfBlockade: z.string(),
    endOfBlockade: z.string(),
  })

  type typeRegisterLaboratorySchema = z.infer<typeof registerLaboratorySchema>

  const {
    register, handleSubmit,
    formState: { isSubmitting, isValidating, errors },
  } =
    useForm<typeRegisterLaboratorySchema>({
      resolver: zodResolver(registerLaboratorySchema),
    })

  // const queryClient = useQueryClient()

  const [searchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'
  const { /** data: getManyLaboratories,**/ refetch } = useQuery({
    queryKey: ['getManyLaboratoriesKey', page],
    queryFn: () => GetManyLaboratoriesFn({ page }),
  })

  // const totalPage = getManyLaboratories?.totalCount !== undefined
  //   ? Math.ceil(getManyLaboratories?.totalCount / 10)
  //   : 1

  const { mutateAsync: registerLabFn } = useMutation({
    mutationFn: RegisterLabFn,
    onSuccess() {
      // const cached = queryClient.getQueryData(['getManyLaboratoriesKey', page])
      // console.log(`O dado é: ${data}`)

      // if (cached) {
      //   const cachedLab:GetManyLaboratoriesReturn = cached as GetManyLaboratoriesReturn

      //   queryClient.setQueryData(['getManyLaboratoriesKey', page], {
      //     ...cachedLab,
      //     laboratories: [...cachedLab.laboratories, data],
      //     totalCount: cachedLab.totalCount + 1,
      //   })
      // }
      refetch()
      toast.success('Laboratório cadastrado com sucesso!')
    },
  })

  function captureIdUser():ReturningFunctionCaptureUser {
    const cookie = parseCookies()
    const token = cookie['app.schedule.lab']
    const payload:ReturningFunctionCaptureUser = jwtDecode(token)
    return payload
  }

  async function handleRegister({ name, localization, capacity, description, startOfBlockade, endOfBlockade }:typeRegisterLaboratorySchema) {
    try {
      await registerLabFn({
        userId: captureIdUser().sub,
        name: name.toLowerCase(),
        localization,
        capacity: Number(capacity),
        description,
        startOfBlockade: Number(startOfBlockade),
        endOfBlockade: Number(endOfBlockade),
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
              Localização
            </label>
            <Input
              type="text" className="border p-1 rounded-md outline-none"
              {...register('localization')}
              autoComplete="off"
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
              autoComplete="off"
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
          <div className="flex flex-col gap-2">
            <label
              htmlFor=""
              className="text-foreground font-medium"
            >Funcionamento (De) -- HORAS
            </label>
            <Input
              type="number" className="border p-1 rounded-md outline-none"
              {...register('startOfBlockade')}
              min={6}
              max={21}
              autoComplete="off"
            />
            <span className="min-h-6">
              <span className="text-xs text-red-500">{!isValidating
                ? errors.startOfBlockade?.message
                : ''}
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor=""
              className="text-foreground font-medium"
            >Funcionamento (Até) -- HORAS
            </label>
            <Input
              type="number" className="border p-1 rounded-md outline-none"
              {...register('endOfBlockade')}
              min={8}
              max={23}
              autoComplete="off"
            />
            <span className="min-h-6">
              <span className="text-xs text-red-500">{!isValidating
                ? errors.endOfBlockade?.message
                : ''}
              </span>
            </span>
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
