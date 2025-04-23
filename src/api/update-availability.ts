import { api } from '@/lib/axios'

interface UpdateAvailabilityFnProps {
  id: string
  status: string
}

interface UpdateAvailabilityFnReturn {
  availability:{
    id: string
    created_at: string
    date: string
    beginHour: string
    endHour: string
    status: string
    laboratoryId: string
    laboratory:{
      id: string
      name: string
      capacity: number
      localization: string
      description: string
      startOfBlockade: number
      endOfBlockade: number
      operatingDays: string
      userId: string
    }
  }
}

export async function UpdateAvailabilityFn({ id, status }:UpdateAvailabilityFnProps) {
  const response = await api.patch<UpdateAvailabilityFnReturn>(`/availability/${id}`, {
    status,
  })
  return response.data
}
