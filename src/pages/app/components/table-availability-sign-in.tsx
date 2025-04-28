import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { setHours, setMinutes } from 'date-fns'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileKey, Search } from 'lucide-react'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as z from 'zod'

import { GetManyAvailabilitiesFn } from '@/api/get-many-availabilities'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ManageStatus, typeStatus } from '../util/manageStatus'
import { DialogLabDetails } from './dialog-lab-details'

export function TableAvailabilitySignIn() {
  const [startDate, setStartDate] = useState<Date | null>(setHours(setMinutes(new Date(), 0), 18))
  const [beginDateValue, setBeginDateValue] = useState<Date | null | undefined>(startDate)
  const [searchParams, setSearchParams] = useSearchParams()

  const filterAvailabilitySchema = z.object({
    name: z.string().optional().nullable(),
    status: z.enum(['approved', 'rejected', 'all']).optional(),
    visibility: z.enum(['private', 'public', 'all']).optional(),
  })

    type typeFilterAvailabilitySchema = z.infer<typeof filterAvailabilitySchema>

    const { register, handleSubmit, control } = useForm({
      resolver: zodResolver(filterAvailabilitySchema),
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

    const page = searchParams.get('page') || '1'
    const name = searchParams.get('name') || undefined
    const beginDate = searchParams.get('beginDate') || undefined
    const status = searchParams.get('status') || undefined
    const visibility = searchParams.get('visibility') || undefined

    function handlePage(page:string) {
      setSearchParams((state) => {
        state.set('page', page)
        return state
      })
    }

    const { data: getManyAvailabilities } = useQuery({
      queryKey: ['getManyAvailabilitiesKey', page, name, beginDate, status, visibility],
      queryFn: () => GetManyAvailabilitiesFn({ page, name, beginDate, status, visibility }),
    })

    const totalPage = getManyAvailabilities?.totalCount !== undefined
      ? (getManyAvailabilities.totalCount === 0
          ? 1
          : Math.ceil(getManyAvailabilities?.totalCount / 10))
      : 1

    const navigate = useNavigate()

    return (
      <>
        <Helmet title="Todos os agendamentos" />
        <div className="h-screen w-full flex flex-col items-center justify-center gap-8 p-16">
          <Button className="absolute top-6 right-6 cursor-pointer" variant="fagammon" onClick={() => navigate('/sign-in')}>Voltar para o login</Button>
          <span className="text-muted-foreground text-3xl">Todos os agendamentos</span>
          <section className="flex flex-col gap-6 border border-muted">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[12rem]">Laboratório</TableHead>

                  <TableHead className="w-[8rem]">Data</TableHead>
                  <TableHead className="w-[8rem]">Hora Início</TableHead>
                  <TableHead className="w-[8rem]">Até</TableHead>
                  <TableHead className="w-[10rem]">Status</TableHead>
                  <TableHead className="w-[10rem]">Agendamento</TableHead>
                  <TableHead className="w-[10rem]">Inscrição</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {getManyAvailabilities?.availability.map((reserv) => (
                  <TableRow key={reserv.id}>
                    <TableCell className="flex gap-4 items-center font-medium">
                      <Dialog>
                        <DialogTrigger>
                          <Button variant="outline" className="cursor-pointer">
                            <Search />
                          </Button>
                        </DialogTrigger>
                        <DialogLabDetails
                          laboratoryName={reserv.laboratory.name} laboratoryCapacity={reserv.laboratory.capacity}
                          laboratoryDescription={reserv.laboratory.description} laboratoryLocalization={reserv.laboratory.localization}
                          laboratoryDaysOperating={reserv.laboratory.operatingDays}
                          laboratoryStartOfBlockade={reserv.laboratory.startOfBlockade}
                          laboratoryEndOfBlockade={reserv.laboratory.endOfBlockade}
                        />
                      </Dialog>
                      <span>{reserv.laboratory.name}</span>
                    </TableCell>
                    <TableCell>{dayjs(reserv.date).add(1, 'day').format('DD/MM/YYYY')}</TableCell>
                    <TableCell>{dayjs(reserv.beginHour).add(3, 'hours').format('HH:mm')}
                    </TableCell>
                    <TableCell>{dayjs(reserv.endHour).add(3, 'hours').format('HH:mm')}
                    </TableCell>
                    <TableCell>{ManageStatus(reserv.status as typeStatus)}
                    </TableCell>
                    <TableCell>{reserv.visibility === 'private'
                      ? <div className="flex gap-2"><FileKey /><span>Privado</span></div>
                      : <div className="flex gap-2"><FileKey /><span>Público</span></div>}
                    </TableCell>
                    <TableCell>{reserv.visibility === 'public'
                      ? <Button className="cursor-pointer" variant="default" disabled={reserv.status === 'rejected'}>Inscrever-se</Button>
                      : ''}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
          <div className="flex justify-between w-full">
            <span>Total de {getManyAvailabilities?.totalCount} item(s)</span>
            <div className="flex gap-2 items-center justify-center">
              <span>Página {Number(page)} de {totalPage === 0
                ? 1
                : totalPage}
              </span>
              <Button variant="outline" className="cursor-pointer" onClick={() => handlePage('1')} disabled={Number(page) === 1}>
                <ChevronsLeft />
                <span className="sr-only">Primeira página</span>
              </Button>
              <Button
                variant="outline" className="cursor-pointer" onClick={() =>
                  handlePage((Number.isNaN(page)
                    ? 1
                    : Number(page) - 1).toString())} disabled={Number(page) === 1}
              >
                <ChevronLeft />
                <span className="sr-only">Página anterior</span>
              </Button>
              <Button
                variant="outline" className="cursor-pointer"
                onClick={() => handlePage((Number(page) + 1).toString())}
                disabled={Number(page) === totalPage}
              >
                <ChevronRight />
                <span className="sr-only">Próxima página</span>
              </Button>
              <Button
                variant="outline" className="cursor-pointer"
                onClick={() => handlePage(totalPage.toString())} disabled={Number(page) === totalPage}
              >
                <ChevronsRight />
                <span className="sr-only">Última página</span>
              </Button>
            </div>
          </div>
        </div>
      </>

    )
}
