import { api } from '@/lib/axios'

export interface getManyUsersReturn {
  users:{
    id: string
    created_at: string
    name: string
    email: string
    password_hash: string
    category: string
    isVerified: boolean
    expires_at: string
    manyLaboratory:{
      id: string
      name: string
      capacity: number
      localization: string
      description: string
      startOfBlockade: number
      endOfBlockade: number
      operatingDays: string
      userId: string
    }[]
  }[],
  totalCount: number
}

interface getManyUsersParams {
  page: number
}

export async function GetManyUsersFn({ page }:getManyUsersParams) {
  const response = await api.get<getManyUsersReturn>(`/many-users?page=${page.toString()}`)
  return response.data
}
