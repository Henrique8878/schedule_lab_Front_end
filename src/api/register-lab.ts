import { api } from '@/lib/axios'

interface RegisterLabFnParams {
  userId: string
  name: string,
  localization: string
  capacity: number
  description: string
}

export async function RegisterLabFn({ userId, name, localization, capacity, description }
:RegisterLabFnParams) {
  await api.post('/laboratory', {
    userId,
    name,
    localization,
    capacity,
    description,
  })
}
