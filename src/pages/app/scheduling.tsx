import 'react-datepicker/dist/react-datepicker.css'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { setHours, setMinutes } from 'date-fns'
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
  const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 18))
  const [beginHourValue, setBeginHourValue] = useState(setHours(setMinutes(new Date(), 0), 18))
  const [endHourValue, setEndHourValue] = useState(setHours(setMinutes(new Date(), 0), 18))
  const [currentLaboratoryId, setCurrentLaboratoryId] = useState<string>('')
  const [currentDay, setCurrentDay] = useState<number | undefined>(startDate.getDate())
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
    const { data: getManyLaboratoriesFm, refetch } = useQuery({
      queryKey: ['getManyLaboratoriesKey'],
      queryFn: GetManyLaboratoriesFn,
    })

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
          throw new Error('O horário final não pode ser anterior ou igual ao horário inicial')
        }

        if (!isSameDayEndHour || !isSameDayStartHour) {
          throw new Error('As datas não correspondem')
        }

        await createAvailabilityFn({
          laboratoryId,
          date: dayjs(startDate.toString()).format('YYYY-MM-DD'),
          beginHour: `${dayjs(beginHourValue.toString()).format('YYYY-MM-DDTHH:mm:ss.000')}Z`,
          endHour: `${dayjs(endHourValue.toString()).format('YYYY-MM-DDTHH:mm:ss.000')}Z`,
        })
        toast.success('Laboratorio reservado !')
        refetch()
      } catch (e) {
        toast.error(`Erro na reserva do laboratório: ${e} `)
      }
    }

    const isWeekday = (date:Date) => {
      const day = dayjs(date).day()
      return day !== 0 && day !== 6
    }

    const filterPassedTime = (time) => {
      const Laboratory = getManyLaboratoriesFm?.find((lab) => {
        return lab.id === currentLaboratoryId
      })

      const arrayEndHours = Laboratory?.reservations.map((lab) => {
        return lab.endHour
      })

      const arrayEndHoursSameDay = arrayEndHours?.filter((date) => {
        return Number(date.split('T')[0].split('-')[2]) === currentDay
      })

      const latestHour = arrayEndHoursSameDay && arrayEndHoursSameDay.reduce((latest, current) => {
        return dayjs(latest).isAfter(current)
          ? latest
          : current
      }, `${new Date().getFullYear()}-${Number(new Date().getMonth() + 1) > 9
? ''
: 0}${Number(new Date().getMonth()) + 1}-${new Date().getDate()}T18:00`)

      console.log(latestHour)
      const currentTime = new Date(time)
      const currentHour = currentTime.getHours()

      return currentHour >= 18 && currentHour <= 22 && currentHour >= Number(latestHour?.split('T')[1].split(':')[0])
    }

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

                    <select
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" {...field} onChange={(e) => {
                        const selectedId = e.target.value
                        field.onChange(e)
                        setCurrentLaboratoryId(selectedId)
                      }}
                    >
                      <option value="">Escolha um laboratório</option>
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
                      setCurrentDay(date?.getDate())
                    }}
                    minDate={new Date()}
                    holidays={[
                      { date: '2025-04-21', holidayName: 'Tiradentes' },
                      { date: '2025-05-01', holidayName: 'Dia do trabalho' },
                      { date: '2025-06-19', holidayName: 'Corpus Christi' },
                      { date: '2025-09-07', holidayName: 'Independência do Brasil' },
                      { date: '2025-10-12', holidayName: 'Nossa Senhora Aparecida' },
                      { date: '2025-11-02', holidayName: 'Finados' },
                    ]}
                    filterDate={isWeekday}
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
                    selected={beginHourValue} showTimeSelect dateFormat="Pp" timeIntervals={60} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" onChange={(date) => {
                      if (date) {
                        setBeginHourValue(date)
                      }
                    }}
                    minDate={new Date()}
                    holidays={[
                      { date: '2025-04-21', holidayName: 'Tiradentes' },
                      { date: '2025-05-01', holidayName: 'Dia do trabalho' },
                      { date: '2025-06-19', holidayName: 'Corpus Christi' },
                      { date: '2025-09-07', holidayName: 'Independência do Brasil' },
                      { date: '2025-10-12', holidayName: 'Nossa Senhora Aparecida' },
                      { date: '2025-11-02', holidayName: 'Finados' },
                    ]}
                    filterTime={filterPassedTime}
                    filterDate={isWeekday}
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
                    selected={endHourValue} showTimeSelect dateFormat="Pp" timeIntervals={60} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" onChange={(date) => {
                      if (date) {
                        setEndHourValue(date)
                      }
                    }}
                    minDate={new Date()}
                    holidays={[
                      { date: '2025-04-21', holidayName: 'Tiradentes' },
                      { date: '2025-05-01', holidayName: 'Dia do trabalho' },
                      { date: '2025-06-19', holidayName: 'Corpus Christi' },
                      { date: '2025-09-07', holidayName: 'Independência do Brasil' },
                      { date: '2025-10-12', holidayName: 'Nossa Senhora Aparecida' },
                      { date: '2025-11-02', holidayName: 'Finados' },
                    ]}
                    filterTime={filterPassedTime}
                    filterDate={isWeekday}
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
