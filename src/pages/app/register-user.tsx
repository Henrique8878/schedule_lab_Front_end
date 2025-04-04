import { useQuery } from '@tanstack/react-query'
import { Plus, User } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'

import { GetManyUsersFn } from '@/api/get-many-users'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'

import { DialogRegisterUser } from './components/dialog-register-user'
import { TableUser } from './components/table-user'

export function RegisterUser() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'

  function handlePage(page:string) {
    setSearchParams((state) => {
      state.set('page', page)
      return state
    })
  }

  const { data: getManyUsersFn } = useQuery({
    queryKey: ['getManyUsersKey', page],
    queryFn: () => GetManyUsersFn({ page: Number(page) }),
  })

  const totalPage = Math.ceil(getManyUsersFn?.totalCount !== undefined
    ? getManyUsersFn?.totalCount / 10
    : 0)

  return (
    <>
      <Helmet title="Registrar-adm/user" />
      <section className="flex flex-col p-10">
        <span className="text-muted-foreground text-3xl">Membros</span>
        <div className="flex justify-center items-center h-screen px-20">
          <main className="w-full flex flex-col gap-4">
            <Dialog>
              <DialogTrigger>
                <Button className="flex justify-center items-center border h-15 w-15 rounded-lg cursor-pointer" variant="outline">
                  <User size={30} />
                  <Plus size={30} />
                </Button>
              </DialogTrigger>
              <DialogRegisterUser />
            </Dialog>
            <TableUser getManyUsersFn={getManyUsersFn} page={page} totalPage={totalPage} handlePage={handlePage} />
          </main>
        </div>
      </section>
    </>
  )
}
