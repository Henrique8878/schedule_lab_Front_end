import { api } from '@/lib/axios'
interface CreateAvailabilityParams {
  laboratoryId: string
  userId: string
  date: string
  beginHour: string
  endHour: string
}

interface CreateAvailabilityReturn {
  status: string;
  date: Date;
  id: string;
  created_at: Date;
  beginHour: Date;
  endHour: Date;
  laboratoryId: string;
  laboratory: {
    id: string;
    name: string;
    capacity: number;
    localization: string;
    description: string;
    startOfBlockade: number
    endOfBlockade: number
    userId: string;
  }
}

export async function CreateAvailabilityFn(
  { laboratoryId, date, beginHour, endHour, userId }
  :CreateAvailabilityParams) {
  const response = await api.post<CreateAvailabilityReturn>(`/availability/${laboratoryId}`, {
    date,
    beginHour,
    endHour,
    userId,
  })

  return response.data
}
