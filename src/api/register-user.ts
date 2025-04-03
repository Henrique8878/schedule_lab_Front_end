import { api } from '@/lib/axios'

interface RegisterUserParams {
  name: string
  email: string
  password_hash: string
  category: string
}

export interface returningUser {
  newUser:{
    id: string
    name: string
    email: string
    password_hash: string
    category: string
    created_at: string
  }
}

export async function
RegisterUserFn({ name, email, password_hash, category }:RegisterUserParams) {
  const response = await api.post<returningUser>('/register', {
    name,
    email,
    password_hash,
    category,
  })
  return response.data
}
