import { api } from '@/lib/axios'

interface UpdateLabParams {
  labId: string
  name: string
  capacity: number
  localization: string | undefined
  description: string | undefined
}

export async function UpdateLab({ labId, name, capacity, localization, description }:UpdateLabParams) {
  const response = await api.patch(`/laboratory/${labId}`, {
    name,
    capacity,
    localization,
    description,
  })

  return response.data
}
