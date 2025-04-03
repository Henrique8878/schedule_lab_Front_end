import { api } from '@/lib/axios'

interface DeleteUserParams {
  id: string
}

export interface DeleteUserReturning {
  id: string
  created_at: string
  name: string
  email: string
  password_hash: string
  category: string
}

export async function DeleteUser({ id }:DeleteUserParams) {
  const response = await api.delete<DeleteUserReturning>(`/user/${id}`)

  return response.data
}
