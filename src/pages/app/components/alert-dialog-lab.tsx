import { toast } from 'sonner'

import { DeleteLab } from '@/api/delete-lab'
import { GetManyLaboratoriesReturn } from '@/api/get-many-laboratories'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
interface AlertDialogParams {
  labId: string
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'

export function AlertDialogLab({ labId }:AlertDialogParams) {
  const queryClient = useQueryClient()

  const [searchParams] = useSearchParams()
  const page = searchParams.get('page') || '1'
  const { mutateAsync: deleteLab } = useMutation({
    mutationFn: DeleteLab,
    onSuccess(data) {
      const cached = queryClient.getQueryData(['getManyLaboratoriesKey', page])

      if (cached) {
        const CachedLab:GetManyLaboratoriesReturn = cached as GetManyLaboratoriesReturn
        const removedLab = CachedLab.laboratories.filter((lab) => {
          return !(lab.id === data.id)
        })
        queryClient.setQueryData(['getManyLaboratoriesKey', page], {
          ...CachedLab,
          laboratories: removedLab,
          totalCount: CachedLab.totalCount - 1,
        })
      }

      toast.success('Laboratório removido')
    },
  })

  return (
    <>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja excluir este laboratório?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o laboratório
            e removerá seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteLab({ labId })} className="bg-[#336754]">Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  )
}
