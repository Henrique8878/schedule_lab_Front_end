import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pen, Trash } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

import { GetManyLaboratoriesFn } from '@/api/get-many-laboratories'
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

import { AlertDialogLab } from './alert-dialog-lab'
import { DialogUpdateLab } from './dialog-update-lab'

export function TableLab() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get('page') || '1'

  const { data: getManyLaboratories } = useQuery({
    queryKey: ['getManyLaboratoriesKey', page],
    queryFn: () => GetManyLaboratoriesFn({ page }),
  })

  const totalPage = getManyLaboratories?.totalCount !== undefined
    ? Math.ceil(getManyLaboratories?.totalCount / 10)
    : 1

  function handlePage(page:string) {
    setSearchParams((state) => {
      state.set('page', page.toString())
      return state
    })
  }
  return (
    <>
      <section className="flex flex-col border border-muted">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[12rem]">ID do laboratório</TableHead>
              <TableHead className="w-[12rem]">Nome</TableHead>
              <TableHead className="w-[10rem]">Capacidade</TableHead>
              <TableHead className="w-[20rem]">Descrição</TableHead>
              <TableHead className="w-[15rem]">Localização</TableHead>
              <TableHead className="w-[5rem] text-center">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getManyLaboratories?.laboratories.map((lab) => (
              <TableRow key={lab.id}>
                <TableCell className="font-medium">{lab.id}</TableCell>
                <TableCell className="font-medium">{lab.name}</TableCell>
                <TableCell>{lab.capacity} pessoa(s)</TableCell>
                <TableCell>{lab.description
                  ? lab.description
                  : 'Nenhuma descrição'}
                </TableCell>
                <TableCell>{lab.localization}
                </TableCell>

                <TableCell className="cursor-pointer flex gap-8 items-center justify-center">
                  <Dialog>
                    <DialogTrigger>
                      <Pen className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogUpdateLab
                      nameLab={lab.name} capacityLab={lab.capacity}
                      descriptionLab={lab.description} localizationLab={lab.localization}
                      labId={lab.id}
                    />
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Trash />
                    </AlertDialogTrigger>
                    <AlertDialogLab labId={lab.id} />
                  </AlertDialog>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <div className="flex justify-between w-full">
        <span>Total de {getManyLaboratories?.totalCount} item(s)</span>
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
