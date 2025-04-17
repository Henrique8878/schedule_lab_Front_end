import { api } from '@/lib/axios'

interface AuthenticateParams {
  email: string
}

interface ReturnAuthenticateFn {
  token: string
}

export async function FirstAuthenticateFn({ email }:AuthenticateParams) {
  const response = await api.post<ReturnAuthenticateFn>('/first-authenticate', {
    email,
  })

  return response.data
}
