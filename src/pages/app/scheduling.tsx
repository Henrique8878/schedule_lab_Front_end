import 'react-datepicker/dist/react-datepicker.css'

import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { Calendar, Plus } from 'lucide-react'
import { parseCookies } from 'nookies'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate } from 'react-router-dom'

import { GetUserProfileFn } from '@/api/get-user-profile'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'

import { DialogAvailability } from './components/dialog-availability'
import { TableAvailability } from './components/table-availability'
import { TableAvailabilityUser } from './components/table-availability-user'
import { ReturningFunctionCaptureUser } from './register-lab'

export function Scheduling() {
  const cookie = parseCookies()
  const token = cookie['app.schedule.lab']
  const payload:ReturningFunctionCaptureUser = jwtDecode(token)

  const location = useLocation()

  const navigate = useNavigate()

  const { data: userProfileData } = useQuery({
    queryKey: ['GetUserProfileKey'],
    queryFn: async () => await GetUserProfileFn({ id: payload.sub }),
  })

  return (
    <>
      <Helmet title="Calendário" />

      <section className="flex flex-col p-10">
        {token
          ? (
            <>
              <span className="text-muted-foreground text-3xl">Agendamentos</span>
            </>
            )
          : (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-3xl">Agendamentos</span>
                <Button variant="outline" className="cursor-pointer px-10 py-4 text-lg" onClick={() => navigate('/sign-in')}>Login</Button>
              </div>
            </>
            )}

        <div className="flex justify-center items-center h-screen px-20">

          <>
            <main className="w-full flex flex-col gap-4">

              {location.pathname !== '/user/public-table' && (
                <>
                  <Dialog>
                    <DialogTrigger>
                      <Button className="flex justify-center items-center border h-15 w-15 rounded-lg cursor-pointer" variant="outline">
                        <Calendar size={30} />
                        <Plus size={30} />
                      </Button>
                    </DialogTrigger>
                    <DialogAvailability sub={payload.sub} />
                  </Dialog>
                </>
              )}

              {location.pathname === '/user/public-table'
                ? (
                  <TableAvailability token={token} isPublic />
                  )
                : userProfileData?.category === 'admin'
                  ? (
                    <TableAvailability token={token} isPublic={false} />
                    )

                  : (
                    <TableAvailabilityUser />
                    )}

            </main>
          </>

        </div>
      </section>

    </>
  )
}
