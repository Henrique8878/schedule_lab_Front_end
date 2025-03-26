import { api } from '@/lib/axios'

interface GetManyAvailabilitiesFnReturn {
  id: string
  created_at: string
  date: string
  beginHour: string
  endHour: string
  status: string
  laboratoryId: string
  laboratory:{
    id: string
    name: string
    capacity: number
    localization: string
    description: string
    userId: string
  }
}

export async function GetManyAvailabilitiesFn() {
  const response = await api.get<GetManyAvailabilitiesFnReturn[]>('/availability/get-many')
  return response.data
}
