import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import dayjs from 'dayjs'
import { jwtDecode } from 'jwt-decode'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Trash } from 'lucide-react'
import { parseCookies } from 'nookies'
import { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { GetManyAvailabilitiesFn, GetManyAvailabilitiesFnReturn } from '@/api/get-many-availabilities'
import { GetUserProfileFn } from '@/api/get-user-profile'
import { UpdateAvailabilityFn } from '@/api/update-availability'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { contextApp } from '../context/context-main'
import { ReturningFunctionCaptureUser } from '../register-lab'
import { ManageStatus, typeStatus } from '../util/manageStatus'
import { AlertDialogAvailability } from './alert-dialog-availability'

interface TableAvailabilityParams {
  token: string
}

export function TableAvailability({ token }:TableAvailabilityParams) {
  const { isAdmin } = useContext(contextApp)
  const [searchParams, setSearchParams] = useSearchParams()

  console.log(token)

  const page = searchParams.get('page') || '1'

  function handlePage(page:string) {
    setSearchParams((state) => {
      state.set('page', page)
      return state
    })
  }

  const { data: getManyAvailabilities } = useQuery({
    queryKey: ['getManyAvailabilitiesKey', page],
    queryFn: () => GetManyAvailabilitiesFn({ page }),
  })

  const totalPage = getManyAvailabilities?.totalCount !== undefined
    ? Math.ceil(getManyAvailabilities?.totalCount / 10)
    : 1

  const queryClient = useQueryClient()

  const { mutateAsync: updateAvailability } = useMutation({
    mutationFn: UpdateAvailabilityFn,
    onSuccess(data) {
      const cached = queryClient.getQueryData(['getManyAvailabilitiesKey', page])

      if (cached) {
        const cachedAvailability:GetManyAvailabilitiesFnReturn = cached as GetManyAvailabilitiesFnReturn
        const cachedAvailabilityUpdated = cachedAvailability.availability.map((reserv) => {
          if (reserv.id === data.availability.id) {
            return {
              ...reserv,
              status: data.availability.status,
            }
          }
          return reserv
        })
        queryClient.setQueryData(['getManyAvailabilitiesKey', page], {
          ...cachedAvailability,
          availability: cachedAvailabilityUpdated,
        })
      }
      toast.success('Reserva atualizada com sucesso!')
    },
  })

  const cookie = parseCookies()
  const tokenId = cookie['app.schedule.lab']
  const payload:ReturningFunctionCaptureUser = jwtDecode(tokenId)

  const { data: userProfileData } = useQuery({
    queryKey: ['GetUserProfileKey'],
    queryFn: async () => await GetUserProfileFn({ id: payload.sub }),
  })

  console.log(userProfileData?.category)
  return (
    <>
      <section className="flex flex-col border border-muted">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[12rem]">Laboratório</TableHead>
              <TableHead className="w-[6rem]">Criado há</TableHead>
              <TableHead className="w-[8rem]">Data</TableHead>
              <TableHead className="w-[8rem]">Hora Início</TableHead>
              <TableHead className="w-[8rem]">Até</TableHead>
              <TableHead className="w-[10rem]">Status</TableHead>

              {token && isAdmin && (
                <>
                  <TableHead className="w-[8rem]">Aprovar/Rejeitar</TableHead>
                  <TableHead className="w-[20rem] text-center">Ação</TableHead>

                </>
              )}

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
                  </Dialog>
                  <span>{reserv.laboratory.name}</span>
                </TableCell>
                <TableCell className="font-medium">{formatDistanceToNow(reserv.created_at, { locale: ptBR, addSuffix: true })}</TableCell>
                <TableCell>{dayjs(reserv.date).add(1, 'day').format('DD/MM/YYYY')}</TableCell>
                <TableCell>{dayjs(reserv.beginHour).add(3, 'hours').format('HH:mm')}
                </TableCell>
                <TableCell>{dayjs(reserv.endHour).add(3, 'hours').format('HH:mm')}
                </TableCell>
                <TableCell>{ManageStatus(reserv.status as typeStatus)}
                </TableCell>

                {token && isAdmin && (
                  <>
                    <TableCell className="flex gap-4">
                      <Button
                        variant="outline" className="cursor-pointer"
                        onClick={() => updateAvailability({ id: reserv.id, status: 'approved' })}
                        disabled={reserv.status === 'approved'}
                      >Aprovar
                      </Button>
                      <Button
                        variant="outline" className="cursor-pointer"
                        onClick={() => updateAvailability({ id: reserv.id, status: 'rejected' })}
                        disabled={reserv.status === 'rejected'}
                      >Rejeitar
                      </Button>
                    </TableCell>

                    <TableCell className="text-center">

                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button variant="outline" className="cursor-pointer">
                            <Trash />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogAvailability id={reserv.id} category={userProfileData?.category} />
                      </AlertDialog>
                    </TableCell>

                  </>
                )}

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
              handlePage((Number(page) - 1).toString())} disabled={Number(page) === 1}
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
    </>
  )
}
