import 'react-datepicker/dist/react-datepicker.css'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { setHours, setMinutes } from 'date-fns'
import { jwtDecode } from 'jwt-decode'
import { Calendar, Plus } from 'lucide-react'
import { parseCookies } from 'nookies'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { GetUserProfileFn } from '@/api/get-user-profile'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { DialogAvailability } from './components/dialog-availability'
import { TableAvailability } from './components/table-availability'
import { TableAvailabilityUser } from './components/table-availability-user'
import { ReturningFunctionCaptureUser } from './register-lab'

export function Scheduling() {
  const [startDate, setStartDate] = useState<Date | null>(setHours(setMinutes(new Date(), 0), 18))
  const [beginDateValue, setBeginDateValue] = useState<Date | null | undefined>(startDate)

  const [, setSearchParams] = useSearchParams()

  const cookie = parseCookies()
  const token = cookie['app.schedule.lab']
  const payload:ReturningFunctionCaptureUser = jwtDecode(token)

  const location = useLocation()

  const navigate = useNavigate()

  const filterAvailabilitySchema = z.object({
    name: z.string().optional().nullable(),
    status: z.enum(['approved', 'rejected', 'all']).optional(),
    visibility: z.enum(['private', 'public', 'all']).optional(),
  })

  type typeFilterAvailabilitySchema = z.infer<typeof filterAvailabilitySchema>

  const { register, handleSubmit, control } = useForm({
    resolver: zodResolver(filterAvailabilitySchema),
  })

  const { data: userProfileData } = useQuery({
    queryKey: ['GetUserProfileKey'],
    queryFn: async () => await GetUserProfileFn({ id: payload.sub }),
  })

  function handleFilter(data:typeFilterAvailabilitySchema) {
    setSearchParams((state) => {
      if (data.name) {
        state.set('name', data.name)
      } else {
        state.delete('name')
      }

      if (data.status) {
        state.set('status', data.status)
      } else {
        state.delete('status')
      }

      if (beginDateValue) {
        state.set('beginDate', String(beginDateValue))
      } else {
        state.delete('beginDate')
      }

      if (data.visibility) {
        state.set('visibility', data.visibility)
      } else {
        state.delete('visibility')
      }

      return state
    })
  }

  return (
    <>
      <Helmet title="Calendário" />

      <section className="flex flex-col p-10">
        {token
          ? (
            <>
              <span className="text-muted-foreground text-3xl">Agendamentos</span>
            </>
            )
          : (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-3xl">Agendamentos</span>
                <Button variant="outline" className="cursor-pointer px-10 py-4 text-lg" onClick={() => navigate('/sign-in')}>Login</Button>
              </div>
            </>
            )}

        <div className="flex justify-center items-center h-screen px-20">

          <>
            <main className="w-full flex flex-col gap-8">

              {location.pathname !== '/user/public-table' && (
                <>
                  <Dialog>
                    <DialogTrigger>
                      <Button className="flex justify-center items-center border h-15 w-15 rounded-lg cursor-pointer" variant="outline">
                        <Calendar size={30} />
                        <Plus size={30} />
                      </Button>
                    </DialogTrigger>
                    <DialogAvailability sub={payload.sub} />
                  </Dialog>
                </>
              )}
              {location.pathname !== '/user' && (
                <div>
                  <form action="" className="flex gap-12 items-end " onSubmit={handleSubmit(handleFilter)}>
                    <section className="flex flex-col gap-2">
                      <Label>Nome do laboratório</Label>
                      <Input type="text" className="h-9" {...register('name')} placeholder="Nome do laboratório" />
                    </section>
                    <section className="flex flex-col gap-2">
                      <Label>Data do agendamento</Label>
                      <DatePicker
                        selected={startDate} className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                                      placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                                      disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" onChange={(date) => {
                          setStartDate(date)
                          setBeginDateValue(date)
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
                        placeholderText="Selecione uma data"
                        isClearable
                      />
                    </section>
                    <section className="flex flex-col gap-2">
                      <Label>Status</Label>
                      <Controller
                        name="status" control={control} render={({ field }) => (
                          <select
                            className="flex h-9 w-full items-center justify-between rounded-md border border-input
                            bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground
                            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                            disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" {...field}
                          >
                            <option value="">Selecione</option>
                            <option value="all">Todos os status</option>
                            <option value="approved">Aprovado</option>
                            <option value="rejected">Rejeitado</option>
                          </select>
                        )}
                      />
                    </section>
                    <section className="flex flex-col gap-2">
                      <Label>Visibilidade</Label>
                      <Controller
                        name="visibility" control={control} render={({ field }) => (
                          <select
                            className="flex h-9 w-full items-center justify-between rounded-md border border-input
                            bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground
                            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                            disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" {...field}
                          >
                            <option value="">Selecione</option>
                            <option value="all">Todos</option>
                            <option value="private">Privado</option>
                            <option value="public">Público</option>
                          </select>
                        )}
                      />
                    </section>
                    <Button variant="outline" className="cursor-pointer" onClick={() => {}}>Filtrar resultados</Button>
                  </form>
                </div>

              )}
              {location.pathname === '/user/public-table'
                ? (
                  <TableAvailability token={token} isPublic />
                  )
                : userProfileData?.category === 'admin'
                  ? (
                    <TableAvailability token={token} isPublic={false} />
                    )

                  : (
                    <TableAvailabilityUser />
                    )}

            </main>
          </>

        </div>
      </section>

    </>
  )
}
