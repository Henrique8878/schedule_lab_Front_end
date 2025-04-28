import { api } from '@/lib/axios'
interface CreateAvailabilityParams {
  laboratoryId: string
  userId: string
  date: string
  beginHour: string
  endHour: string
  visibility: string
}

interface CreateAvailabilityReturn {
  status: string;
  date: Date;
  id: string;
  created_at: Date;
  beginHour: Date;
  endHour: Date;
  visibility: string
  laboratoryId: string;
  laboratory: {
    id: string;
    name: string;
    capacity: number;
    localization: string;
    description: string;
    startOfBlockade: number
    endOfBlockade: number
    operatingDays: string
    userId: string;
  }
}

export async function CreateAvailabilityFn(
  { laboratoryId, date, beginHour, endHour, userId, visibility }
  :CreateAvailabilityParams) {
  const response = await api.post<CreateAvailabilityReturn>(`/availability/${laboratoryId}`, {
    date,
    beginHour,
    endHour,
    userId,
    visibility,
  })

  return response.data
}
