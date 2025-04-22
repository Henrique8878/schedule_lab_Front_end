import { api } from '@/lib/axios'

interface GetUserProfileFnParams {
  id: string
}

export interface GetUserProfileFnReturn {
  id: string
  created_at: string
  name: string
  email: string
  password_hash: string
  category: string
  manyLaboratory:{
    id: string
    name: string
    capacity: number
    localization: string
    description: string
    startOfBlockade: number
    endOfBlockade: number
    quantityReservations: number
    userid: string,
  }[]
  manyAvailability:{
    id: string
    created_at: string
    date: string
    beginHour: string
    endHour: string
    status: string
    laboratoryId: string
    userId: string
  }[]
}

export async function GetUserProfileFn({ id }:GetUserProfileFnParams) {
  const response = await api.get<GetUserProfileFnReturn>(`/user-profile/${id}`)
  return response.data
}
