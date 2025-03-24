import { api } from '@/lib/axios'

interface GetUserProfileFnParams {
  id: string
}

interface GetUserProfileFnReturn {
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
    quantityReservations: number
    userid: string,
  }[]
}

export async function GetUserProfileFn({ id }:GetUserProfileFnParams) {
  const response = await api.get<GetUserProfileFnReturn>(`/user-profile/${id}`)
  return response.data
}
