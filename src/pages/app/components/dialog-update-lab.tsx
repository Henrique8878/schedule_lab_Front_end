import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { GetManyLaboratoriesReturn } from '@/api/get-many-laboratories'
import { UpdateLab } from '@/api/update-lab'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface DialogUpdateProps {
  nameLab: string,
  capacityLab: number
  localizationLab: string
  descriptionLab: string
  labId: string
}

export function DialogUpdateLab({ nameLab, capacityLab, descriptionLab, localizationLab, labId }:DialogUpdateProps) {
  const registerLabSchema = z.object({
    name: z.string().min(3),
    capacity: z.string().min(1),
    description: z.string().optional(),
    localization: z.string().optional(),
  })

    type typeRegisterLabSchema = z.infer<typeof registerLabSchema>
    const { register, handleSubmit, formState: { isValidating, errors } } =
    useForm<typeRegisterLabSchema>({
      resolver: zodResolver(registerLabSchema),
      values: {
        name: nameLab,
        capacity: capacityLab.toString(),
        description: descriptionLab,
        localization: localizationLab,
      },
    })

    const [searchParams] = useSearchParams()
    const page = searchParams.get('page') || '1'
    const queryClient = useQueryClient()

    const { mutateAsync: updateLab } = useMutation({
      mutationFn: UpdateLab,
      onSuccess(_, { name, localization, capacity, description }) {
        const cached = queryClient.getQueryData(['getManyLaboratoriesKey', page])
        if (cached) {
          const updateCached:GetManyLaboratoriesReturn = cached as GetManyLaboratoriesReturn
          const newCached = updateCached.laboratories.map((lab) => {
            if (lab.id === labId) {
              return {
                ...lab,
                name,
                localization,
                capacity,
                description,
              }
            }
            return lab
          })
          queryClient.setQueryData(['getManyLaboratoriesKey', page], {
            ...updateCached,
            laboratories: newCached,
          })
        }
        toast.success('Laboratório atualizado com sucesso')
      },
    })

    async function handleUpdate({ name, localization, capacity, description }: typeRegisterLabSchema) {
      try {
        await updateLab({ name, localization, capacity: Number(capacity), description, labId })
      } catch (e) {
        toast.error('Erro ao atualizar laboratório')
        console.error(e)
      }
    }
    return (
      <>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preencha os dados para atualizar</DialogTitle>

          </DialogHeader>
          <form
            action="" className="space-y-3"
            onSubmit={handleSubmit(handleUpdate)}
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
                autoComplete="off"
                max={100}
                min={1}
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
              >Descrição
              </label>
              <Textarea {...register('description')} />
              <span className="min-h-6">
                <span className="text-xs text-red-500">{!isValidating
                  ? errors.description?.message
                  : ''}
                </span>
              </span>
            </div>
            <Button className="w-full cursor-pointer text-md" variant="fagammon">Atualizar</Button>
          </form>
        </DialogContent>
      </>
    )
}
