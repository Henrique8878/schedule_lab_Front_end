import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, User, XIcon } from 'lucide-react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { GetManyUsersFn } from '@/api/get-many-users'
import { RegisterUserFn } from '@/api/register-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function RegisterUser() {
  const [isOpenModal, setisOpenModal] = useState(false)

  const registerUserSchema = z.object({
    name: z.string().min(3,
      { message: 'O nome precisa ter pelo menos 3 caracteres' }),
    email: z.string().email({ message: 'E-mail inválido' }),
    password_hash: z.string().min(8,
      { message: 'A senha precisa ter pelo menos 8 caracteres' }),
    category: z.enum(['admin', 'user']),
  })

  type typeRegisterUserSchema = z.infer<typeof registerUserSchema>

  const { register, control, handleSubmit, formState: { isSubmitting, isValidating, errors } } =
  useForm<typeRegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
  })

  const { mutateAsync: registerUserFn } = useMutation({
    mutationFn: RegisterUserFn,
  })
  async function handleRegister({ name, email, password_hash, category }:typeRegisterUserSchema) {
    try {
      await registerUserFn({
        name,
        email,
        password_hash,
        category,
      })
      toast.success('Cadastro realizado com sucesso !')
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response !== undefined) {
          toast.error(`Erro no cadastro: ${e.response.data.message}`)
        }
      }
    }
  }

  const { data: getManyUsersFn } = useQuery({
    queryKey: ['getManyUsersKey'],
    queryFn: () => GetManyUsersFn({ page: 1 }),
  })

  return (
    <>
      <Helmet title="Registrar-adm/user" />
      <div className="flex justify-center items-center h-screen px-20">
        {isOpenModal
          ? (
            <>
              <div>
                <div
                  className="fixed inset-0 bg-black/90 z-20" // Fechar o modal ao clicar no overlay
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-[32rem] space-y-4 border border-muted-foreground rounded-xl p-8 bg-white">
                  <XIcon className="absolute right-5 top-5 cursor-pointer" size={30} onClick={() => setisOpenModal(false)} />
                  <section className="flex flex-col gap-2">
                    <h1 className="text-3xl text-center font-medium">
                      Registrar
                    </h1>
                    <span className="text-center">
                      Preencha os campos para o cadastro!
                    </span>
                  </section>
                  <form
                    action="" className="space-y-3"
                    onSubmit={handleSubmit(handleRegister)}
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor=""
                        className="text-foreground font-medium"
                      >
                        Nome
                      </label>
                      <Input
                        type="text" className="border p-1 rounded-md outline-none"
                        {...register('name')}
                      />
                      <span className="min-h-6">
                        <span className="text-xs text-red-500">{!isValidating
                          ? errors.name?.message
                          : ''}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor=""
                        className="text-foreground font-medium"
                      >
                        email
                      </label>
                      <Input
                        type="text" className="border p-1 rounded-md outline-none"
                        {...register('email')}
                      />
                      <span className="min-h-6">
                        <span className="text-xs text-red-500">{!isValidating
                          ? errors.email?.message
                          : ''}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor=""
                        className="text-foreground font-medium"
                      >Senha
                      </label>
                      <Input
                        type="password" className="border p-1 rounded-md outline-none"
                        {...register('password_hash')}
                      />
                      <span className="min-h-6">
                        <span className="text-xs text-red-500">{!isValidating
                          ? errors.password_hash?.message
                          : ''}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor=""
                        className="text-foreground font-medium"
                      >
                        Categoria
                      </label>
                      <Controller
                        name="category" control={control} render={({ field }) => (
                          <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1" {...field}>
                            <option value="">Admnistrador ou Usuário</option>
                            <option value="admin">Admnistrador</option>
                            <option value="user">Usuário</option>
                          </select>
                        )}
                      />
                    </div>
                    <Button
                      className="w-full cursor-pointer"
                      disabled={isSubmitting}
                      variant="destructive"
                    >Finalizar cadastro
                    </Button>
                  </form>
                  <p className="text-center">
                    Ao continuar, você concorda com nossos<br />
                    <a href="" className="underline underline-offset-4">
                      termos de serviço
                    </a> e
                    <a href="" className="underline underline-offset-4">
                      {' '}políticas de privacidade
                    </a>
                  </p>
                </div>
              </div>
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Criado há</TableHead>
                    <TableHead className="text-right">Categoria</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
            )
          : (
            <main className="w-full flex flex-col gap-4">
              <div className="flex justify-center items-center border h-15 w-15 rounded-lg cursor-pointer" onClick={() => setisOpenModal(true)}>
                <User size={30} />
                <Plus size={30} />
              </div>
              <section className="flex flex-col border border-muted">
                <Table>
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[12rem]">Nome</TableHead>
                      <TableHead className="w-[25rem]">E-mail</TableHead>
                      <TableHead className="w-[15rem]">Criado há</TableHead>
                      <TableHead className="w-[15rem]">Categoria</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getManyUsersFn?.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium p-4">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatDistanceToNow(user.created_at, { locale: ptBR, addSuffix: true })}</TableCell>
                        <TableCell>{user.category === 'admin'
                          ? 'Admnistrador'
                          : 'Usuário'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </section>
              <div className="flex justify-between w-full">
                <span>Total de {getManyUsersFn?.totalCount} item(s)</span>
                <div>
                  <Button variant="outline" className="cursor-pointer">
                    <ChevronsLeft />
                  </Button>
                  <Button variant="outline" className="cursor-pointer">
                    <ChevronLeft />
                  </Button>
                  <Button variant="outline" className="cursor-pointer">
                    <ChevronRight />
                  </Button>
                  <Button variant="outline" className="cursor-pointer">
                    <ChevronsRight />
                  </Button>
                </div>
              </div>
            </main>
            )}
      </div>
    </>
  )
}
