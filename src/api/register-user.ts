import { api } from '@/lib/axios'

interface RegisterUserParams {
  name: string
  email: string
  password_hash: string
  category: string
}

export async function
RegisterUserFn({ name, email, password_hash, category }:RegisterUserParams) {
  await api.post('/register', {
    name,
    email,
    password_hash,
    category,
  })
}
