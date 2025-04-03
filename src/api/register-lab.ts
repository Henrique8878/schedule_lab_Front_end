import { api } from '@/lib/axios'

interface RegisterLabFnParams {
  userId: string
  name: string,
  localization: string
  capacity: number
  description: string
}

interface RegisterLabReturning {
  id: string
  name: string
  capacity: number
  localization: string
  description: string
  quantityReservations: number
  userid: string,
  reservations:{
    id: string
    created_at: string
    date: string
    beginHour: string
    endHour: string
    laboratoryId: string
  }[]
}

export async function RegisterLabFn({ userId, name, localization, capacity, description }
:RegisterLabFnParams) {
  const response = await api.post<RegisterLabReturning>('/laboratory', {
    userId,
    name,
    localization,
    capacity,
    description,
  })

  return response.data
}
