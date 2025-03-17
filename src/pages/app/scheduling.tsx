import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { CreateAvailabilityFn } from '@/api/create-availability'
import { GetManyLaboratoriesFn } from '@/api/get-many-laboratories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Scheduling() {
  const registerAvailabilitySchema = z.object({
    laboratoryId: z.string(),
    date: z.string({ message: 'O campo deve ser uma data' }).date(),
    beginHour: z.string(),
    endHour: z.string(),
  })

    type typeRegisterAvailabilitySchema =
    z.infer<typeof registerAvailabilitySchema>

    const {
      register, control, handleSubmit,
      formState: { isSubmitting, isValidating, errors },
    } =
    useForm<typeRegisterAvailabilitySchema>({
      resolver: zodResolver(registerAvailabilitySchema),
    })
    const { data: getManyLaboratoriesFm } = useQuery({
      queryKey: ['getManyLaboratoriesKey'],
      queryFn: GetManyLaboratoriesFn,
    })

    const { mutateAsync: createAvailabilityFn } = useMutation({
      mutationFn: CreateAvailabilityFn,
    })

    async function handleRegister({ laboratoryId, date, beginHour, endHour }
    :typeRegisterAvailabilitySchema) {
      try {
        await createAvailabilityFn({
          laboratoryId,
          date,
          beginHour: `${date}T${beginHour}:00.000Z`,
          endHour: `${date}T${endHour}:00.000Z`,
        })
        toast.success('Laboratorio reservado !')
      } catch (e) {
        toast.error(`Erro na reserva do laboratório: ${e} `)
      }
    }
    return (
      <>
        <Helmet title="Calendário" />
        <div className="flex justify-center items-center h-screen">
          <div className="w-[23rem] space-y-4">
            <section className="flex flex-col gap-2">
              <h1 className="text-3xl text-center font-medium">
                Reserve um laboratório
              </h1>
              <span className="text-center">
                Preencha os campos para realizar a reserva
              </span>
            </section>
            <form
              action="" className="space-y-3"
              onSubmit={handleSubmit(handleRegister)}
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="inp_email"
                  className="text-foreground font-medium"
                >
                  Início
                </label>
                <Controller
                  name="laboratoryId" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Laboratório" />
                      </SelectTrigger>
                      <SelectContent side="bottom">
                        {getManyLaboratoriesFm?.map((laboratory) => (
                          <SelectItem
                            key={laboratory.id}
                            value={laboratory.id}
                          >
                            {laboratory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="inp_email"
                  className="text-foreground font-medium"
                >
                  Data
                </label>
                <Input
                  type="date" className="border p-1 rounded-md outline-none"
                  {...register('date')}
                />
                <span className="min-h-6">

                  <span className="text-xs text-red-500">{!isValidating
                    ? errors.date?.message
                    : ''}
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="inp_email"
                  className="text-foreground font-medium"
                >
                  Início
                </label>
                <Controller
                  name="beginHour" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Hora de início" />
                      </SelectTrigger>
                      <SelectContent side="bottom">
                        <SelectItem value="09:00">9 : 00</SelectItem>
                        <SelectItem value="10:00">10 : 00</SelectItem>
                        <SelectItem value="11:00">11 : 00</SelectItem>
                        <SelectItem value="12:00">12 : 00</SelectItem>
                        <SelectItem value="13:00">13 : 00</SelectItem>
                        <SelectItem value="14:00">14 : 00</SelectItem>
                        <SelectItem value="15:00">15 : 00</SelectItem>
                        <SelectItem value="16:00">16 : 00</SelectItem>
                        <SelectItem value="17:00">17 : 00</SelectItem>
                        <SelectItem value="18:00">18 : 00</SelectItem>
                        <SelectItem value="19:00">19 : 00</SelectItem>
                        <SelectItem value="20:00">20 : 00</SelectItem>
                        <SelectItem value="21:00">21 : 00</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="inp_email"
                  className="text-foreground font-medium"
                >
                  Até
                </label>
                <Controller
                  name="endHour" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Hora final" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">09 : 00</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Button
                className="w-full cursor-pointer"
                disabled={isSubmitting}
                variant="destructive"
              >Finalizar reserva
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
