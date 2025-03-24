import { api } from '@/lib/axios'
interface CreateAvailabilityParams {
  laboratoryId: string
  date: string
  beginHour: string
  endHour: string
}

export async function CreateAvailabilityFn(
  { laboratoryId, date, beginHour, endHour }
  :CreateAvailabilityParams) {
  await api.post(`/availability/${laboratoryId}`, {
    date,
    beginHour,
    endHour,
  })
}
