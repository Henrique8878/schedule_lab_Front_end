import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash } from 'lucide-react'

import { getManyUsersReturn } from '@/api/get-many-users'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface GetUserParams {
  getManyUsersFn: getManyUsersReturn | undefined
  page: string
  totalPage: number
  handlePage: (page:string)=>void
}

import {
  AlertDialog,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { AlertDialogContentComponent } from './alert-dialog-content'

export function TableUser({ getManyUsersFn, page, totalPage, handlePage }:GetUserParams) {
  return (
    <>
      <section className="flex flex-col border border-muted">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[12rem]">ID do usuário</TableHead>
              <TableHead className="w-[12rem]">Nome</TableHead>
              <TableHead className="w-[25rem]">E-mail</TableHead>
              <TableHead className="w-[15rem]">Criado há</TableHead>
              <TableHead className="w-[15rem]">Categoria</TableHead>
              <TableHead className="w-[5rem]">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getManyUsersFn?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{formatDistanceToNow(user.created_at, { locale: ptBR, addSuffix: true })}</TableCell>
                <TableCell>{user.category === 'admin'
                  ? 'Admnistrador'
                  : 'Usuário'}
                </TableCell>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <TableCell className="cursor-pointer">
                      <Button variant="outline" className="cursor-pointer">
                        <Trash />
                      </Button>
                    </TableCell>
                  </AlertDialogTrigger>
                  <AlertDialogContentComponent userId={user.id} />
                </AlertDialog>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <div className="flex justify-between w-full">
        <span>Total de {getManyUsersFn?.totalCount} item(s)</span>
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
