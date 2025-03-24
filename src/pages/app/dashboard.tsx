import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { parseCookies } from 'nookies'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { replace, useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'

import { GetManyLaboratoriesFn } from '@/api/get-many-laboratories'
import { GetUserProfileFn } from '@/api/get-user-profile'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { contextApp } from './context/context-main'
import { ReturningFunctionCaptureUser } from './register-lab'

export function DashBoard() {
  const { setIsAdmin } = useContext(contextApp)
  const { data: getManyLaboratoriesFm } = useQuery({
    queryKey: ['getManyLaboratoriesKey'],
    queryFn: GetManyLaboratoriesFn,
  })

  function mapGetManyLaboratories() {
    const newArrayLaboratories = getManyLaboratoriesFm?.map((lab) => {
      return {
        ...getManyLaboratoriesFm,
        name: lab.name,
        lengthReservations: lab.reservations.length,
      }
    })
    return newArrayLaboratories
  }

  const cookie = parseCookies()

  const token = cookie['app.schedule.lab']
  const payload:ReturningFunctionCaptureUser = jwtDecode(token)

  const { data: userProfileData } = useQuery({
    queryKey: ['GetUserProfileKey'],
    queryFn: async () => await GetUserProfileFn({ id: payload.sub }),
  })

  const navigate = useNavigate()
  if (userProfileData?.category === 'user') {
    setIsAdmin(false)
    navigate('/user', { replace: true })
  }

  return (
    <>
      <Helmet title="Dashboard" />
      <section className="flex flex-col min-h-screen p-10 gap-10 border border-black">
        <span className="text-muted-foreground text-3xl">Dashboard</span>
        <div className="flex justify-center gap-60">
          <Card className="w-96">
            <CardHeader>
              <span className="text-xl">Total de Reservas (mês)</span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl">35 Reservas</span>
            </CardContent>
            <CardFooter>
              <span><strong className="text-emerald-400">% 5 </strong>
                em relação ao mês passado
              </span>
            </CardFooter>
          </Card>
          <Card className="w-96">
            <CardHeader>
              <span className="text-xl">Usuários cadastrados (mês)</span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl">15 Cadastros</span>
            </CardContent>
            <CardFooter>
              <span><strong className="text-red-500">% -5 </strong>
                em relação ao mês passado
              </span>
            </CardFooter>
          </Card>
        </div>
        <div className="flex justify-center">
          <BarChart width={1000} height={450} data={mapGetManyLaboratories()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar name="Quantidade de reservas" dataKey="lengthReservations" fill="#EA1A23" />
          </BarChart>
        </div>

      </section>
    </>
  )
}
