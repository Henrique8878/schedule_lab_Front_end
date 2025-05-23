import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { jwtDecode } from 'jwt-decode'
import { destroyCookie, parseCookies } from 'nookies'
import { useContext } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { GetUserProfileFn, GetUserProfileFnReturn } from '@/api/get-user-profile'
import { UpdateUserProfileFn } from '@/api/update-user-profile'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { contextApp } from '../context/context-main'
import { ReturningFunctionCaptureUser } from '../register-lab'

export function DialogUpdate() {
  const navigate = useNavigate()

  const { setIsAuthenticated } = useContext(contextApp)

  const { isAdmin } = useContext(contextApp)
  const dialogUpdateSchema = z.object({
    name: z.string(),
    category: z.enum(['user', 'admin']),
  })

  type typeDialogUpdateSchema = z.infer<typeof dialogUpdateSchema>

  const cookie = parseCookies()
  const token = cookie['app.schedule.lab']
  const payload:ReturningFunctionCaptureUser = jwtDecode(token)

  const { data: userProfileData } = useQuery({
    queryKey: ['GetUserProfileKey'],
    queryFn: async () => await GetUserProfileFn({ id: payload.sub }),
  })

  const queryClient = useQueryClient()

  const { mutateAsync: updateUserProfileFn } = useMutation({
    mutationFn: UpdateUserProfileFn,
    onSuccess(_, { name, category }) {
      const cached = queryClient.getQueryData(['GetUserProfileKey'])

      const cachedReturn = cached as GetUserProfileFnReturn

      if (cachedReturn.category.toLowerCase() !== category.toLowerCase()) {
        const cookie = parseCookies()
        if (cookie) {
          destroyCookie(null, 'app.schedule.lab')
          localStorage.removeItem('isAuthenticated')
          setIsAuthenticated(false)
          navigate('/sign-in')
          try {
            window.location.reload()
            toast.success('Dados atualizados, faça o login novamente para recarregá-los')
          } catch {
            toast.error('Erro ao realizar a atualização de dados')
          }
        }
      }

      if (cached) {
        queryClient.setQueryData(['GetUserProfileKey'], {
          ...cached,
          name,

          category,
        })
      }
    },
  })

  const { register, handleSubmit, control } = useForm<typeDialogUpdateSchema>({
    resolver: zodResolver(dialogUpdateSchema),
    defaultValues: {
      name: userProfileData?.name,

    },
  })

  async function handleuserUpdateSubmit({ name, category }:typeDialogUpdateSchema) {
    try {
      await updateUserProfileFn({
        id: payload.sub,
        name,

        category,
      })
      toast.success('Usuário atualizado !')
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.data) {
          toast.error(`Erro na atualização do usuário : ${e}`)
        }
      }
      toast.error('Erro na atualização do usuário')
    }
  }
  return (

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar perfil</DialogTitle>
        <DialogDescription>Edite seu perfil de acordo com o formulário abaixo e,
          após isso, salve as alterações no botão ao final.
        </DialogDescription>
      </DialogHeader>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit(handleuserUpdateSubmit)}>
        <div className="flex gap-5">
          <Label>Nome</Label>
          <Input type="text" {...register('name')} />
        </div>

        <div className="flex gap-5 ">
          <Label>Selecione</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                {...field}
              >
                {isAdmin
                  ? (
                    <>
                      <option value="">Administrador ou Usuário</option>
                      <option value="admin">Administrador</option>
                      <option value="user">Usuário</option>
                    </>
                    )
                  : (
                    <>
                      <option value="">Selecione</option>
                      <option value="user">Usuário</option>
                    </>
                    )}
              </select>
            )}
          />

        </div>
        <Button type="submit" variant="fagammon" className="pointer">Salvar alterações</Button>

      </form>
    </DialogContent>

  )
}
