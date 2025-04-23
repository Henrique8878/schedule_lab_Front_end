import { api } from '@/lib/axios'

interface UpdateLabParams {
  labId: string
  name: string
  capacity: number
  localization: string | undefined
  description: string | undefined
  startOfBlockade: number | undefined,
  endOfBlockade: number | undefined
  operatingDays: string | undefined
}

export async function UpdateLab({ labId, name, capacity, localization, description, startOfBlockade, endOfBlockade, operatingDays }:UpdateLabParams) {
  const response = await api.patch(`/laboratory/${labId}`, {
    name,
    capacity,
    localization,
    description,
    startOfBlockade,
    endOfBlockade,
    operatingDays,
  })

  return response.data
}
