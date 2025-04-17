import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface CardLabDetailsParams {
  labCapacity: number
  labDescription: string
  labLocalization: string
}

export function CardLabDetails({ labCapacity, labDescription, labLocalization }:CardLabDetailsParams) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-normal">Capacidade: {labCapacity} pessoa(s)</CardTitle>
          <CardDescription>Descrição: {labDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <span>Localização: {labLocalization}</span>
        </CardContent>

      </Card>
    </>
  )
}
