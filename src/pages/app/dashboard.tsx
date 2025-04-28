import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { parseCookies } from 'nookies'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'

import { GetManyAvailabilitiesFn } from '@/api/get-many-availabilities'
import { GetManyLaboratoriesFn } from '@/api/get-many-laboratories'
import { GetManyUsersFn } from '@/api/get-many-users'
import { GetUserProfileFn } from '@/api/get-user-profile'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { contextApp } from './context/context-main'
import { ReturningFunctionCaptureUser } from './register-lab'

export function DashBoard() {
  const { setIsAdmin } = useContext(contextApp)

  const [searchParams] = useSearchParams()

  const name = searchParams.get('name') || undefined
  const beginDate = searchParams.get('beginDate') || undefined
  const status = searchParams.get('status') || undefined
  const visibility = searchParams.get('visibility') || undefined

  const page = searchParams.get('page') || '1'
  const { data: getManyLaboratoriesFm } = useQuery({
    queryKey: ['getManyLaboratoriesKey'],
    queryFn: () => GetManyLaboratoriesFn({ page }),
  })

  const { data: getManyAvailabilitiesFn } = useQuery({
    queryKey: ['getManyAvailabilitiesKey', page, name, beginDate, status, visibility],
    queryFn: () => GetManyAvailabilitiesFn({ page, name, beginDate, status, visibility }),
  })

  const { data: getManyUsersFn } = useQuery({
    queryKey: ['getManyUsersKey'],
    queryFn: () => GetManyUsersFn({ page: 1 }),
  })

  function mapGetManyLaboratories() {
    const newArrayLaboratories = getManyLaboratoriesFm?.laboratories.map((lab) => {
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
      <section className="flex flex-col min-h-screen p-10 gap-10">
        <span className="text-muted-foreground text-3xl">Dashboard</span>
        <div className="flex justify-center gap-96">
          <Card className="w-96">
            <CardHeader>
              <span className="text-xl">Total de Reservas (mês)</span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl">{getManyAvailabilitiesFn?.availabilityInMonth} Reservas</span>
            </CardContent>

          </Card>
          <Card className="w-96">
            <CardHeader>
              <span className="text-xl">Usuários cadastrados (mês)</span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl">{getManyUsersFn?.totalCount} Cadastros</span>
            </CardContent>

          </Card>
        </div>
        <div className="flex justify-center">
          <BarChart width={1000} height={450} data={mapGetManyLaboratories()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar name="Quantidade de reservas" dataKey="lengthReservations" fill="#336754" />
          </BarChart>
        </div>

      </section>
    </>
  )
}
