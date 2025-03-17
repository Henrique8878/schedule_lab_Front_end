import { api } from '@/lib/axios'

interface AuthenticateParams {
  email: string
  password: string
}

interface ReturnAuthenticateFn {
  token: string
}

export async function AuthenticateFn({ email, password }:AuthenticateParams) {
  const response = await api.post<ReturnAuthenticateFn>('/authenticate', {
    email,
    password,
  })

  return response.data
}
