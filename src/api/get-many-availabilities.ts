import { api } from '@/lib/axios'

export interface GetManyAvailabilitiesFnReturn {
  availability:{
    id: string
    created_at: string
    date: string
    beginHour: string
    endHour: string
    status: string
    laboratoryId: string
    userId: string
    laboratory:{
      id: string
      name: string
      capacity: number
      localization: string
      description: string
      startOfBlockade: number
      endOfBlockade: number
      operatingDays: string
      userId: string
    }
  }[],
  availabilityInMonth: number,
  totalCount: number

}

interface GetManyAvailabilitiesProps {
  page: string
}

export async function GetManyAvailabilitiesFn({ page }:GetManyAvailabilitiesProps) {
  const response = await api.get<GetManyAvailabilitiesFnReturn>(`/availability/get-many?page=${page}`)
  return response.data
}
