import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import dayjs from 'dayjs'
import { jwtDecode } from 'jwt-decode'
import { Search, Trash } from 'lucide-react'
import { parseCookies } from 'nookies'

import { GetUserProfileFn } from '@/api/get-user-profile'
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

export function TableAvailabilityUser() {
  const cookie = parseCookies()
  const token = cookie['app.schedule.lab']
  const payload:ReturningFunctionCaptureUser = jwtDecode(token)

  // const { isAdmin } = useContext(contextApp)
  // const [searchParams, setSearchParams] = useSearchParams()

  // const page = searchParams.get('page') || '1'

  // function handlePage(page:string) {
  //   setSearchParams((state) => {
  //     state.set('page', page)
  //     return state
  //   })
  // }

  const { data: userProfileData } = useQuery({
    queryKey: ['GetUserProfileKey'],
    queryFn: async () => await GetUserProfileFn({ id: payload.sub }),
  })

  // const queryClient = useQueryClient()

  //   const { mutateAsync: updateAvailability } = useMutation({
  //     mutationFn: UpdateAvailabilityFn,
  //     onSuccess(data) {
  //       const cached = queryClient.getQueryData(['getManyAvailabilitiesKey', page])

  //       if (cached) {
  //         const cachedAvailability:GetManyAvailabilitiesFnReturn = cached as GetManyAvailabilitiesFnReturn
  //         const cachedAvailabilityUpdated = cachedAvailability.availability.map((reserv) => {
  //           if (reserv.id === data.availability.id) {
  //             return {
  //               ...reserv,
  //               status: data.availability.status,
  //             }
  //           }
  //           return reserv
  //         })
  //         queryClient.setQueryData(['getManyAvailabilitiesKey', page], {
  //           ...cachedAvailability,
  //           availability: cachedAvailabilityUpdated,
  //         })
  //       }
  //       toast.success('Reserva atualizada com sucesso!')
  //     },
  //   })
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

              <TableHead className="w-[20rem] text-center">Ação</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {userProfileData?.manyAvailability.map((avail) => (
              <TableRow key={avail.id}>
                <TableCell className="flex gap-4 items-center font-medium">
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="outline" className="cursor-pointer">
                        <Search />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  {userProfileData.manyLaboratory.map((lab) => (
                    <span key={lab.id}>{lab.id === avail.id
                      ? lab.name
                      : 'Nenhum laboratório associado'}
                    </span>
                  ))}

                </TableCell>
                <TableCell className="font-medium">{formatDistanceToNow(avail.created_at, { locale: ptBR, addSuffix: true })}</TableCell>
                <TableCell>{dayjs(avail.date).add(1, 'day').format('DD/MM/YYYY')}</TableCell>
                <TableCell>{dayjs(avail.beginHour).add(3, 'hours').format('HH:mm')}
                </TableCell>
                <TableCell>{dayjs(avail.endHour).add(3, 'hours').format('HH:mm')}
                </TableCell>
                <TableCell>{ManageStatus(avail.status as typeStatus)}
                </TableCell>

                <TableCell className="text-center">

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant="outline" className="cursor-pointer">
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogAvailability id={avail.id} />
                  </AlertDialog>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <div className="flex justify-between w-full">
        <span>Total de {userProfileData?.manyAvailability.length} item(s)</span>

      </div>
    </>
  )
}
