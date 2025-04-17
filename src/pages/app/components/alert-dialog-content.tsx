import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
interface AlertDialogContentComponentParams {
  userId: string
}

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { DeleteUser } from '@/api/delete-user'

type cachedUserType = {
  users:{
    id: string
    created_at: string
    name: string
    email: string
    password_hash: string
    category: string
  }[],
  totalCount: number
}

export function AlertDialogContentComponent({ userId }:AlertDialogContentComponentParams) {
  const queryClient = useQueryClient()

  const [searchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: DeleteUser,
    onSuccess(data) {
      const cached = queryClient.getQueryData(['getManyUsersKey', page])

      if (cached) {
        const cachedUser:cachedUserType = cached as cachedUserType
        const removedUser = cachedUser.users.filter((user) => {
          return !(user.id === data.id)
        })
        queryClient.setQueryData(['getManyUsersKey', page], {
          ...cachedUser,
          users: removedUser,
          totalCount: cachedUser.totalCount - 1,
        })
      }

      toast.success('Usuário removido!')
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
          <AlertDialogAction onClick={() => deleteUser({ id: userId })} className="bg-[#336754]">Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  )
}
