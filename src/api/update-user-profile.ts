import { api } from '@/lib/axios'

interface UpdateUserProfileParams {
  id: string
  name: string
  category: string
}

export async function UpdateUserProfileFn(
  { id, name, category }:UpdateUserProfileParams) {
  await api.patch(`/user-profile/${id}`, {
    name,

    category,
  })
}
