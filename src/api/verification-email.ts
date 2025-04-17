import { api } from '@/lib/axios'

interface VerificationEmailFnParams {
  email: string
  newUser:{
    id: string
    name: string
    email: string
    password_hash: string
    category: string
    created_at: string
  }
}

export async function VerificationEmailFn({ email, newUser }:VerificationEmailFnParams) {
  await api.post(`/verify-email/${email}`, {
    newUser,
  })
}
