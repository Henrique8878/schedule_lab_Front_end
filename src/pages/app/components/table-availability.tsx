import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import dayjs from 'dayjs'
import { jwtDecode } from 'jwt-decode'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Trash } from 'lucide-react'
import { parseCookies } from 'nookies'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
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

import { ReturningFunctionCaptureUser } from '../register-lab'
import { ManageStatus, typeStatus } from '../util/manageStatus'
import { AlertDialogAvailability } from './alert-dialog-availability'
import { DialogLabDetails } from './dialog-lab-details'

interface TableAvailabilityParams {
  token: string
  isPublic: boolean
}

export function TableAvailability({ isPublic }:TableAvailabilityParams) {
  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

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
    ? (getManyAvailabilities.totalCount === 0
        ? 1
        : Math.ceil(getManyAvailabilities?.totalCount / 10))
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

      toast.error('Reserva cancelada !')
    },
  })

  const cookie = parseCookies()
  const tokenId = cookie['app.schedule.lab']
  const payload:ReturningFunctionCaptureUser = jwtDecode(tokenId)

  const { data: userProfileData } = useQuery({
    queryKey: ['GetUserProfileKey'],
    queryFn: async () => await GetUserProfileFn({ id: payload.sub }),
  })
  console.log(page, totalPage)
  console.log(location.pathname, location.search)
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

              {isPublic === false && (
                <>
                  <TableHead className="w-[8rem]">Rejeitar</TableHead>
                  <TableHead className="w-[8rem] text-center">Ação</TableHead>

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
                <TableCell className="font-medium">{formatDistanceToNow(reserv.created_at, { locale: ptBR, addSuffix: true })}</TableCell>
                <TableCell>{dayjs(reserv.date).add(1, 'day').format('DD/MM/YYYY')}</TableCell>
                <TableCell>{dayjs(reserv.beginHour).add(3, 'hours').format('HH:mm')}
                </TableCell>
                <TableCell>{dayjs(reserv.endHour).add(3, 'hours').format('HH:mm')}
                </TableCell>
                <TableCell>{ManageStatus(reserv.status as typeStatus)}
                </TableCell>

                {isPublic === false && (
                  <>
                    <TableCell className="flex gap-4">
                      {/* <Button
                        variant="outline" className="cursor-pointer"
                        onClick={() => {
                          updateAvailability({ id: reserv.id, status: 'approved' })
                          const update = searchParams.get('updateStatus')

                          if (update) {
                            setSearchParams((state) => {
                              state.set('updateStatus', new Date().toString())
                              return state
                            })
                          } else {
                            navigate(location.pathname + location.search
                              ? location.search + `?updateStatus=${new Date()}`
                              : `?updateStatus=${new Date()}`)
                          }
                        }}
                        disabled={reserv.status === 'approved' || reserv.status === 'rejected'}
                      >Aprovar
                      </Button> */}
                      <Button
                        variant="outline" className="cursor-pointer"
                        onClick={() => {
                          updateAvailability({ id: reserv.id, status: 'rejected' })
                          const update = searchParams.get('updateStatus')

                          if (update) {
                            setSearchParams((state) => {
                              state.set('updateStatus', new Date().getMilliseconds().toString())
                              return state
                            })
                          } else {
                            navigate(location.search
                              ? `${location.pathname}${location.search}&updateStatus=${new Date().getMilliseconds()}`
                              : `${location.pathname}?updateStatus=${new Date().getMilliseconds()}`)
                          }
                        }}
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
    </>
  )
}
