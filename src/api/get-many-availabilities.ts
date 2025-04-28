import { api } from '@/lib/axios'

export interface GetManyAvailabilitiesFnReturn {
  availability:{
    id: string
    created_at: string
    date: string
    beginHour: string
    endHour: string
    status: string
    visibility: string
    laboratoryId: string
    userId: string
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
    },
    manySignUpEvent:{
      id: string
      name: string
      email: string
      telephone: string
      availabilityId: string
    }[]
  }[],
  availabilityInMonth: number,
  totalCount: number

}

interface GetManyAvailabilitiesProps {
  page: string
  name: string | undefined | null
  beginDate: string | undefined | null
  status: string | undefined | null
  visibility: string | undefined | null
}

export async function GetManyAvailabilitiesFn({ page, name, beginDate, status, visibility }:GetManyAvailabilitiesProps) {
  const response = await api.get<GetManyAvailabilitiesFnReturn>(`/availability/get-many?page=${page}`, {
    params: {
      name,
      beginDate,
      status,
      visibility,
    },
  })
  return response.data
}
