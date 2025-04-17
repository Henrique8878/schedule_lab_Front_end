import { api } from '@/lib/axios'

export interface GetManyLaboratoriesReturn {
  laboratories:{
    id: string
    name: string
    created_at: string
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
      status: string
      laboratoryId: string
    }[]
  }[],
  totalCount: number
}

interface GetLaboratoriesParams {
  page: string
}

export async function GetManyLaboratoriesFn({ page }:GetLaboratoriesParams) {
  const response = await api.get<GetManyLaboratoriesReturn>(`/laboratory?page=${page}`)
  return response.data
}
