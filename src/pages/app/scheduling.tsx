import 'react-datepicker/dist/react-datepicker.css'

import { Calendar, Plus } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'

import { DialogAvailability } from './components/dialog-availability'
import { TableAvailability } from './components/table-availability'

export function Scheduling() {
  return (
    <>
      <Helmet title="Calendário" />

      <section className="flex flex-col p-10">
        <span className="text-muted-foreground text-3xl">Agendamentos</span>
        <div className="flex justify-center items-center h-screen px-20">

          <>
            <main className="w-full flex flex-col gap-4">
              <Dialog>
                <DialogTrigger>
                  <Button className="flex justify-center items-center border h-15 w-15 rounded-lg cursor-pointer" variant="outline">
                    <Calendar size={30} />
                    <Plus size={30} />
                  </Button>
                </DialogTrigger>
                <DialogAvailability />
              </Dialog>

              <TableAvailability />
            </main>
          </>

        </div>
      </section>

    </>
  )
}
