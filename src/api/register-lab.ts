import { api } from '@/lib/axios'

interface RegisterLabFnParams {
  userId: string
  name: string,
  localization: string
  capacity: number
  description: string
  startOfBlockade: number
  endOfBlockade: number
}

interface RegisterLabReturning {
  id: string
  name: string
  capacity: number
  localization: string
  description: string
  startOfBlockade: number
  endOfBlockade: number
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

export async function RegisterLabFn({ userId, name, localization, capacity, description, startOfBlockade, endOfBlockade }
:RegisterLabFnParams) {
  console.log(typeof startOfBlockade)
  const response = await api.post<RegisterLabReturning>('/laboratory', {
    userId,
    name,
    localization,
    capacity,
    description,
    startOfBlockade,
    endOfBlockade,
  })

  return response.data
}
