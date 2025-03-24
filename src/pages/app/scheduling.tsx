import 'react-datepicker/dist/react-datepicker.css'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { CreateAvailabilityFn } from '@/api/create-availability'
import { GetManyLaboratoriesFn } from '@/api/get-many-laboratories'
import { Button } from '@/components/ui/button'

export function Scheduling() {
  const [startDate, setStartDate] = useState(new Date())
  const [beginHourValue, setBeginHourValue] = useState(new Date())
  const [endHourValue, setEndHourValue] = useState(new Date())
  const [currentDateCalendar, setCurrentDateCalendar] = useState<Date[] | undefined>([])
  const registerAvailabilitySchema = z.object({
    laboratoryId: z.string(),
  })

    type typeRegisterAvailabilitySchema =
    z.infer<typeof registerAvailabilitySchema>

    const {
      control, handleSubmit,
      formState: { isSubmitting },
    } =
    useForm<typeRegisterAvailabilitySchema>({
      resolver: zodResolver(registerAvailabilitySchema),
    })
    const { data: getManyLaboratoriesFm } = useQuery({
      queryKey: ['getManyLaboratoriesKey'],
      queryFn: GetManyLaboratoriesFn,
    })

    useEffect(() => {
      const newArray = getManyLaboratoriesFm?.map((lab) => {
        const arrayReservation = lab.reservations.map((reserv) => {
          return new Date(reserv.beginHour)
        })
        return arrayReservation
      })
      setCurrentDateCalendar(newArray?.flat())
    }, [getManyLaboratoriesFm])

    console.log(currentDateCalendar)
    const { mutateAsync: createAvailabilityFn } = useMutation({
      mutationFn: CreateAvailabilityFn,
    })

    async function handleRegister({ laboratoryId }
    :typeRegisterAvailabilitySchema) {
      try {
        const isSameDayStartHour = dayjs(startDate).startOf('day').isSame(dayjs(beginHourValue).startOf('day'))
        const isSameDayEndHour = dayjs(startDate).startOf('day').isSame(dayjs(endHourValue).startOf('day'))

        const isBeforeBeginHourEndHour = dayjs(beginHourValue).hour() < dayjs(endHourValue).hour()

        const isBeforeBeginHourCurrentHour = dayjs(beginHourValue).isBefore(new Date())

        if (isBeforeBeginHourCurrentHour) {
          throw new Error('Não é possível cadastrar um horário anterior ao horário atual')
        }

        if (!isBeforeBeginHourEndHour) {
          throw new Error('O horário final não pode ser anterior ao horário inicial')
        }

        if (!isSameDayEndHour || !isSameDayStartHour) {
          throw new Error('As datas não correspondem')
        }

        await createAvailabilityFn({
          laboratoryId,
          date: startDate.toISOString().split('T')[0],
          beginHour: beginHourValue.toISOString(),
          endHour: endHourValue.toISOString(),
        })
        toast.success('Laboratorio reservado !')
      } catch (e) {
        toast.error(`Erro na reserva do laboratório: ${e} `)
      }
    }

    // const filterDate = (date:Date) => {
    //   const specificdates = currentDateCalendar?.map((date) => {
    //     return date.toISOString().split('T')[0]
    //   })

    //   const retornoArray = specificdates && specificdates.some(d =>
    //     new Date(d).getFullYear() === date.getFullYear() &&
    //     new Date(d).getMonth() === date.getMonth() &&
    //     new Date(d).getDate() === date.getDate(),
    //   )

    //   if (retornoArray !== undefined) {
    //     return retornoArray
    //   }
    // }

    return (
      <>
        <Helmet title="Calendário" />
        <div className="flex justify-center items-center h-screen">
          <div className="w-[28rem] space-y-4">
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

                    <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" {...field}>
                      {getManyLaboratoriesFm?.map((laboratory) => (
                        <option key={laboratory.id} value={laboratory.id}>{laboratory.name}</option>
                      ))}

                    </select>
                  )}
                />
              </div>
              <main className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="inp_email"
                    className="text-foreground font-medium"
                  >
                    Data
                  </label>
                  <DatePicker
                    selected={startDate} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" onChange={(date) => {
                      if (date) {
                        setStartDate(date)
                      }
                      const newDate = date?.toISOString().split('T')[0]
                      console.log(newDate)
                    }}

                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="inp_email"
                    className="text-foreground font-medium"
                  >
                    Início
                  </label>
                  <DatePicker
                    selected={beginHourValue} showTimeSelect dateFormat="Pp" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" onChange={(date) => {
                      if (date) {
                        setBeginHourValue(date)
                      }
                    }}
                    excludeTimes={currentDateCalendar}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="inp_email"
                    className="text-foreground font-medium"
                  >
                    Até
                  </label>
                  <DatePicker
                    selected={endHourValue} showTimeSelect dateFormat="Pp" className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" onChange={(date) => {
                      if (date) {
                        setEndHourValue(date)
                      }
                    }}
                  />
                </div>
              </main>
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
