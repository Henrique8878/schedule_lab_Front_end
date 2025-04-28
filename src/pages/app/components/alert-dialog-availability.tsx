import { useMutation, useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { parseCookies } from 'nookies'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { DeleteAvailabilityFn } from '@/api/delete-availability'
import { GetManyAvailabilitiesFn } from '@/api/get-many-availabilities'
import { GetUserProfileFn } from '@/api/get-user-profile'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { ReturningFunctionCaptureUser } from '../register-lab'

interface AlertDialogProps {
  id: string
  category: string | undefined
}

export function AlertDialogAvailability({ id, category }:AlertDialogProps) {
  // const queryClient = useQueryClient()

  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'

  const cookie = parseCookies()
  const token = cookie['app.schedule.lab']
  const payload:ReturningFunctionCaptureUser = jwtDecode(token)

  const { data: userProfileData, refetch: refetchUserProfile } = useQuery({
    queryKey: ['GetUserProfileKey'],
    queryFn: async () => await GetUserProfileFn({ id: payload.sub }),
  })

  const name = searchParams.get('name') || undefined
  const beginDate = searchParams.get('beginDate') || undefined
  const status = searchParams.get('status') || undefined
  const visibility = searchParams.get('visibility') || undefined

  const { refetch } = useQuery({
    queryKey: ['getManyAvailabilitiesKey', page, name, beginDate, status, visibility],
    queryFn: () => GetManyAvailabilitiesFn({ page, name, beginDate, status, visibility }),
  })

  const navigate = useNavigate()
  const removedAvailability = searchParams.get('removedAvailability')

  const { mutateAsync: deleteAvailability } = useMutation({
    mutationFn: DeleteAvailabilityFn,
    async onSuccess() {
      // const cached = queryClient.getQueryData(['getManyAvailabilitiesKey', page])

      // if (cached) {
      //   const cachedAvailability:GetManyAvailabilitiesFnReturn = cached as GetManyAvailabilitiesFnReturn
      //   const filteredAvailabilities = cachedAvailability.availability.filter((avail) => {
      //     return !(avail.id === data.id)
      //   })
      //   queryClient.setQueryData(['getManyAvailabilitiesKey', page], {
      //     ...cachedAvailability,
      //     availability: filteredAvailabilities,
      //     totalCount: cachedAvailability.totalCount - 1,
      //   })
      // }
      if (removedAvailability) {
        setSearchParams((state) => {
          state.set('removedAvailability', `${id}+${new Date().getMilliseconds()}`)
          return state
        })
      } else {
        navigate(location.search
          ? `${location.pathname}${location.search}&removedAvailability=${new Date().getMilliseconds()}`
          : `${location.pathname}?removedAvailability=${new Date().getMilliseconds()}`)
      }
      toast.error('Reserva excluída !')
      console.log(userProfileData?.category)
      await (category === 'admin'
        ? refetch()
        : refetchUserProfile())
    },
  })

  return (
    <>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja excluir este usuário?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o usuário
            e removerá seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction className="bg-[#336754]" onClick={() => deleteAvailability(id)}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  )
}
