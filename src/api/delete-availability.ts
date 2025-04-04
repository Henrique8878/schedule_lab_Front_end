import { api } from '@/lib/axios'

interface DeleteAvailabilityReturn {
  id: string
  created_at: string
  date: string
  beginHour: string
  endHour: string
  status: string
  laboratoryId: string
}

export async function DeleteAvailabilityFn(id:string) {
  const response = await api.delete<DeleteAvailabilityReturn>(`/availability/${id}`)
  return response.data
}
