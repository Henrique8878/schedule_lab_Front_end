import { api } from '@/lib/axios'

export interface GetManyLaboratoriesReturn {
  id: string
  name: string
  capacity: number
  localization: string
  description: string
  quantityReservations: number
  userid: string,
  reservations:{
    id: string
    created_at: string
    date: string
    beginHour: string
    endHour: string
    laboratoryId: string
  }[]
}

export async function GetManyLaboratoriesFn() {
  const response = await api.get<GetManyLaboratoriesReturn[]>('/laboratory')
  return response.data
}
