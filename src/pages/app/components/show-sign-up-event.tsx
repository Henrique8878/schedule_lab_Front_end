import { DialogContent, DialogHeader } from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface ShowSignUpEventProps {
  manySignUpEvent: {
    id: string
    name: string
    email: string
    telephone: string

  }[]
}

export function ShowSignUpEvent({ manySignUpEvent }:ShowSignUpEventProps) {
  return (
    <>
      <DialogContent>
        <DialogHeader>Inscritos</DialogHeader>
        <Table>

          <TableHeader>
            <TableRow>
              <TableHead className="w-[10rem]">Nome</TableHead>
              <TableHead className="w-[10rem]">Email</TableHead>
              <TableHead className="w-[10rem]">Telefone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manySignUpEvent.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.name}</TableCell>
                <TableCell>{event.email}</TableCell>
                <TableCell>{event.telephone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </>
  )
}
