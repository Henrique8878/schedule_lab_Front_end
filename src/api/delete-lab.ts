import { api } from '@/lib/axios'

interface DeleteLabParams {
  labId: string
}

interface DeleteLabReturning {
  id: string
  name: string
  capacity: number
  localization: string
  description: string
  startOfBlockade: number
  endOfBlockade: number
  operatingDays: string
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

export async function DeleteLab({ labId }:DeleteLabParams) {
  const response = await api.delete<DeleteLabReturning>(`/laboratory/${labId}`)
  return response.data
}
