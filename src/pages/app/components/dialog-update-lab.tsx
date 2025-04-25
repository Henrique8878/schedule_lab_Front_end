import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { GetManyLaboratoriesReturn } from '@/api/get-many-laboratories'
import { UpdateLab } from '@/api/update-lab'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DialogClose,
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
  startOfBlockade: number,
  endOfBlockade: number
  operatingDays: string
}

export function DialogUpdateLab({ nameLab, capacityLab, descriptionLab, localizationLab, labId, startOfBlockade, endOfBlockade, operatingDays }:DialogUpdateProps) {
  const [stateSegunda, setStateSegunda] = useState(false)
  const [stateTerca, setStateTerca] = useState(false)
  const [stateQuarta, setStateQuarta] = useState(false)
  const [stateQuinta, setStateQuinta] = useState(false)
  const [stateSexta, setStateSexta] = useState(false)
  const [stateSabado, setStateSabado] = useState(false)
  const [stateDomingo, setStateDomingo] = useState(false)

  const registerLabSchema = z.object({
    name: z.string().min(3),
    capacity: z.string().min(1),
    description: z.string().optional(),
    localization: z.string().optional(),
    startOfBlockade: z.string().optional(),
    endOfBlockade: z.string().optional(),
    operatingDays: z.string().optional(),
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
        startOfBlockade: String(startOfBlockade),
        endOfBlockade: String(endOfBlockade),
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

    function StringDaysOfWeek() {
      const daysOfWeek = `${stateSegunda !== false
  ? 'segunda:'
  : ''}${stateTerca !== false
  ? 'terça:'
  : ''}${stateQuarta !== false
  ? 'quarta:'
  : ''}${stateQuinta !== false
  ? 'quinta:'
  : ''}${stateSexta !== false
  ? 'sexta:'
  : ''}${stateSabado !== false
  ? 'sábado:'
  : ''}${stateDomingo !== false
  ? 'domingo'
  : ''}`

      return daysOfWeek
    }

    async function handleUpdate({ name, localization, capacity, description, startOfBlockade, endOfBlockade }: typeRegisterLabSchema) {
      try {
        await updateLab({
          name,
          localization,
          capacity: Number(capacity),
          description,
          startOfBlockade: Number(startOfBlockade),
          endOfBlockade: Number(endOfBlockade),
          labId,
          operatingDays: StringDaysOfWeek() === ''
            ? operatingDays
            : StringDaysOfWeek(),
        })
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
            <main className="flex gap-8">
              <section>
                <div className="border-3 border-muted p-4 rounded-xl">
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
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 border-3 border-muted p-4 rounded-xl">
                  <span className="text-foreground font-medium">Dias de funcionamento</span>
                  <div className="flex items-center gap-2 ">
                    <Checkbox checked={stateSegunda} onClick={() => setStateSegunda(!stateSegunda)} className="cursor-pointer" />
                    <span>Segunda</span>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Checkbox checked={stateTerca} onClick={() => setStateTerca(!stateTerca)} className="cursor-pointer" />
                    <span>Terça</span>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Checkbox checked={stateQuarta} onClick={() => setStateQuarta(!stateQuarta)} className="cursor-pointer" />
                    <span>Quarta</span>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Checkbox checked={stateQuinta} onClick={() => setStateQuinta(!stateQuinta)} className="cursor-pointer" />
                    <span>Quinta</span>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Checkbox checked={stateSexta} onClick={() => setStateSexta(!stateSexta)} className="cursor-pointer" />
                    <span>Sexta</span>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Checkbox checked={stateSabado} onClick={() => setStateSabado(!stateSabado)} className="cursor-pointer" />
                    <span>Sábado</span>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Checkbox checked={stateDomingo} onClick={() => setStateDomingo(!stateDomingo)} className="cursor-pointer" />
                    <span>Domingo</span>
                  </div>
                </div>
                <div className="border-3 border-muted p-4 rounded-xl">
                  <div className="flex flex-col gap-2 ">
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
                </div>
              </section>
            </main>
            <DialogClose><Button className="w-full cursor-pointer text-md" variant="fagammon">Atualizar</Button></DialogClose>
          </form>
        </DialogContent>
      </>
    )
}
