import { api } from '@/lib/axios'

interface DialogRegisterSignUpEventProps {
  name: string
  email: string
  telephone: string
  availabilityId: string
}

export async function CreateSignUpEvent({ name, email, telephone, availabilityId }:DialogRegisterSignUpEventProps) {
  const signUpEvent = await api.post('/sign-up-event', {
    name,
    email,
    telephone,
    availabilityId,
  })
  return signUpEvent.data
}
