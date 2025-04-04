import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { DeleteAvailabilityFn } from '@/api/delete-availability'
import { GetManyAvailabilitiesFnReturn } from '@/api/get-many-availabilities'
import { GetManyLaboratoriesFn } from '@/api/get-many-laboratories'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface AlertDialogProps {
  id: string
}

export function AlertDialogAvailability({ id }:AlertDialogProps) {
  const queryClient = useQueryClient()

  const [searchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'

  const { refetch } = useQuery({
    queryKey: ['getManyLaboratoriesKey', page],
    queryFn: () => GetManyLaboratoriesFn({ page }),
  })

  const { mutateAsync: deleteAvailability } = useMutation({
    mutationFn: DeleteAvailabilityFn,
    onSuccess(data) {
      const cached = queryClient.getQueryData(['getManyAvailabilitiesKey', page])

      if (cached) {
        const cachedAvailability:GetManyAvailabilitiesFnReturn = cached as GetManyAvailabilitiesFnReturn
        const filteredAvailabilities = cachedAvailability.availability.filter((avail) => {
          return !(avail.id === data.id)
        })
        queryClient.setQueryData(['getManyAvailabilitiesKey', page], {
          ...cachedAvailability,
          availability: filteredAvailabilities,
          totalCount: cachedAvailability.totalCount - 1,
        })
      }
      toast.success('Reserva excluída com sucesso!')
      refetch()
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
