import { FlaskConical, Plus } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'

import { DialogRegisterLab } from './components/dialog-register-lab'
import { TableLab } from './components/table-lab'
export interface ReturningFunctionCaptureUser {
  iat: number,
  sub: string
}

export function RegisterLab() {
  // converter o capacity para number na hora de enviar

  return (
    <>
      <Helmet title="Registrar-adm/user" />
      <section className="flex flex-col p-10">
        <span className="text-muted-foreground text-3xl">Laboratórios</span>
        <div className="flex justify-center items-center h-screen px-20">

          <>
            <main className="w-full flex flex-col gap-4">
              <Dialog>
                <DialogTrigger>
                  <div className="flex justify-center items-center border h-15 w-15 rounded-lg cursor-pointer">
                    <FlaskConical size={30} />
                    <Plus size={30} />
                  </div>
                </DialogTrigger>
                <DialogRegisterLab />
              </Dialog>

              <TableLab />
            </main>
          </>

        </div>
      </section>
    </>
  )
}
