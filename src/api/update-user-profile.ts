import { api } from '@/lib/axios'

interface UpdateUserProfileParams {
  id: string
  name: string
  email: string
  category: string
}

export async function UpdateUserProfileFn(
  { id, name, email, category }:UpdateUserProfileParams) {
  await api.patch(`/user-profile/${id}`, {
    name,
    email,
    category,
  })
}
