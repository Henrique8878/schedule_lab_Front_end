import 'react-datepicker/dist/react-datepicker.css'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { setHours, setMinutes } from 'date-fns'
import dayjs from 'dayjs'
import { jwtDecode } from 'jwt-decode'
import { parseCookies } from 'nookies'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { CreateAvailabilityFn } from '@/api/create-availability'
import { GetManyAvailabilitiesFn } from '@/api/get-many-availabilities'
import { GetManyLaboratoriesFn } from '@/api/get-many-laboratories'
import { GetUserProfileFn } from '@/api/get-user-profile'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { ReturningFunctionCaptureUser } from '../register-lab'

interface DialogAvailabilityParams {
  sub: string
}

export function DialogAvailability({ sub }:DialogAvailabilityParams) {
  const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 18))
  const [beginHourValue, setBeginHourValue] = useState(startDate)
  const [endHourValue, setEndHourValue] = useState(startDate)
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

    const [searchParams] = useSearchParams()
    const page = searchParams.get('page') || '1'

    const { data: getManyLaboratoriesFm, refetch: RefetchLab } = useQuery({
      queryKey: ['getManyLaboratoriesKey', page],
      queryFn: () => GetManyLaboratoriesFn({ page }),
    })

    useEffect(() => {
      RefetchLab()
    }, [location.search])

    // const queryClient = useQueryClient()

    const cookie = parseCookies()
    const token = cookie['app.schedule.lab']
    const payload:ReturningFunctionCaptureUser = jwtDecode(token)

    const { data: userProfileData, refetch: refetchUserProfile } = useQuery({
      queryKey: ['GetUserProfileKey'],
      queryFn: async () => await GetUserProfileFn({ id: payload.sub }),
    })

    const { refetch } = useQuery({
      queryKey: ['getManyAvailabilitiesKey', page],
      queryFn: () => GetManyAvailabilitiesFn({ page }),
    })

    const { mutateAsync: createAvailabilityFn } = useMutation({
      mutationFn: CreateAvailabilityFn,
      onSuccess() {
        // const cached = queryClient.getQueryData(['getManyAvailabilitiesKey', page])

        // if (cached) {
        //   const cachedAvailability:GetManyAvailabilitiesFnReturn = cached as GetManyAvailabilitiesFnReturn
        //   queryClient.setQueryData(['getManyAvailabilitiesKey', page], {
        //     ...cachedAvailability,
        //     availability: [...cachedAvailability.availability, data],
        //     totalCount: cachedAvailability.totalCount + 1,
        //   })
        // }
        refetch()
        RefetchLab()
        toast.success('Laboratório reservado com sucesso !')
      },
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

        const hourBeginIsSameDay = dayjs(beginHourValue).get('h')
        const hourEndIsSameDay = dayjs(endHourValue).get('h')

        const Laboratory = getManyLaboratoriesFm?.laboratories.find((lab) => {
          return lab.id === currentLaboratoryId
        })

        const isHourBetweenBeginHourAndEndHour = Laboratory?.reservations.find((date) => {
          return (Number(date.beginHour.split('T')[0].split('-')[2]) === currentDay &&
          Number(date.endHour.split('T')[0].split('-')[2]) === currentDay) &&

          ((Number(date.endHour.split('T')[1].split(':')[0]) > hourBeginIsSameDay &&
          Number(date.endHour.split('T')[1].split(':')[0]) < hourEndIsSameDay) ||
          (Number(date.beginHour.split('T')[1].split(':')[0]) > hourBeginIsSameDay &&
          Number(date.beginHour.split('T')[1].split(':')[0]) < hourEndIsSameDay))
        })

        if (isHourBetweenBeginHourAndEndHour) {
          toast.error('Erro: Há um horário entre os horários selecionados que já foi reservado !')
          throw new Error('Há um horário entre os horários selecionados que já foi reservado !')
        }
        await createAvailabilityFn({
          laboratoryId,
          date: dayjs(startDate.toString()).format('YYYY-MM-DD'),
          beginHour: `${dayjs(beginHourValue.toString()).format('YYYY-MM-DDTHH:mm:ss.000')}Z`,
          endHour: `${dayjs(endHourValue.toString()).format('YYYY-MM-DDTHH:mm:ss.000')}Z`,
          userId: sub,
        })

        await (userProfileData?.category === 'admin'
          ? refetch()
          : refetchUserProfile())
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.response !== undefined) {
            toast.error(`Erro na reserva do laboratório: ${e.response.data.message}`)
            return
          }
          toast.error(`Erro na reserva do laboratório: ${e}`)
        }
      }
    }

    const isWeekday = (date:Date) => {
      const day = dayjs(date).day()
      return day !== 0 && day !== 6
    }

    const filterPassedBegin = (time:Date):boolean => {
      const Laboratory = getManyLaboratoriesFm?.laboratories.find((lab) => {
        return lab.id === currentLaboratoryId
      })

      const arrayBeginHours = Laboratory?.reservations.filter((lab) => lab.status === 'approved' || lab.status === 'pending').map((lab) => {
        return lab.beginHour
      })

      const arrayBeginHoursSameDay = arrayBeginHours?.filter((date) => {
        return Number(date.split('T')[0].split('-')[2]) === currentDay
      })

      const currentTime = new Date(time)
      const currentHour = currentTime.getHours()

      return arrayBeginHoursSameDay !== undefined
        ? currentHour >= 18 && currentHour <= 22 && arrayBeginHoursSameDay?.every((date) => {
          const hourFromDate = Number(date.split('T')[1].split(':')[0])
          return hourFromDate !== currentHour
        })
        : currentHour >= 18 && currentHour <= 22
    }

    function filterPassesTimeEnd(time:Date):boolean {
      const Laboratory = getManyLaboratoriesFm?.laboratories.find((lab) => {
        return lab.id === currentLaboratoryId
      })

      const arrayEndHours = Laboratory?.reservations.filter((lab) => lab.status === 'approved' || lab.status === 'pending').map((lab) => {
        return lab.endHour
      })

      const arrayEndHoursSameDay = arrayEndHours?.filter((date) => {
        return Number(date.split('T')[0].split('-')[2]) === currentDay
      })

      const currentTime = new Date(time)
      const currentHour = currentTime.getHours()

      return arrayEndHoursSameDay !== undefined
        ? currentHour >= 19 && currentHour <= 23 && arrayEndHoursSameDay?.every((date) => {
          const hourFromDate = Number(date.split('T')[1].split(':')[0])
          return hourFromDate !== currentHour
        })
        : currentHour >= 19 && currentHour <= 23
    }
    return (
      <>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preencha os dados para agendar</DialogTitle>

          </DialogHeader>
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
                    {getManyLaboratoriesFm?.laboratories.map((laboratory) => (
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
                      setBeginHourValue(date)
                      setEndHourValue(date)
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
                  selected={beginHourValue} showTimeSelect showTimeSelectOnly timeCaption="Time" dateFormat="h:mm aa" timeIntervals={60} className="
                  flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                  placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed
                  disabled:opacity-50 [&>span]:line-clamp-1" onChange={(date) => {
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
                  filterTime={filterPassedBegin}
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
                  selected={endHourValue} showTimeSelect showTimeSelectOnly timeCaption="Time" dateFormat="h:mm aa" timeIntervals={60} className="
                  flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                  placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed
                  disabled:opacity-50 [&>span]:line-clamp-1" onChange={(date) => {
                    if (date) {
                      setEndHourValue(date)
                      console.log(date)
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
                  filterTime={filterPassesTimeEnd}
                  filterDate={isWeekday}
                />
              </div>
            </main>
            <Button
              className="w-full cursor-pointer"
              disabled={isSubmitting}
              variant="fagammon"
            >Finalizar reserva
            </Button>
          </form>
        </DialogContent>
      </>
    )
}
