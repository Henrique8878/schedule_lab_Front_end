import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'

import { GetManyLaboratoriesFn } from '@/api/get-many-laboratories'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export function DashBoard() {
  const { data: getManyLaboratoriesFm } = useQuery({
    queryKey: ['getManyLaboratoriesKey'],
    queryFn: GetManyLaboratoriesFn,
  })

  console.log(getManyLaboratoriesFm)
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
          <BarChart width={1000} height={450} data={getManyLaboratoriesFm}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar name="Quantidade de reservas" dataKey="quantityReservations" fill="#EA1A23" />
          </BarChart>
        </div>

      </section>
    </>
  )
}
