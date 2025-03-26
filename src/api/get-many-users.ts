import { api } from '@/lib/axios'

interface getManyUsersReturn {
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
    userId: string
  }[]
}

export async function GetManyUsersFn() {
  const response = await api.get<getManyUsersReturn[]>('/many-users')
  return response.data
}
