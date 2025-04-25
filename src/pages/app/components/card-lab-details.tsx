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
  labDaysOperating: string
  labStartOfBlockade: number
  labEndOfBlockade: number
}

import { Separator } from '@/components/ui/separator'

export function CardLabDetails({
  labCapacity, labDescription, labLocalization,
  labDaysOperating, labStartOfBlockade, labEndOfBlockade,
}:CardLabDetailsParams) {
  const stringDays = labDaysOperating !== undefined && labDaysOperating

  const arrayStringDays = String(stringDays).split(':')
  const deleteSpaceStringDays = arrayStringDays.filter(day => day !== '')

  const keyValueDay:Record<string, string> = {
    segunda: 'Segunda',
    terça: 'Terça',
    quarta: 'Quarta',
    quinta: 'Quinta',
    sexta: 'Sexta',
    sábado: 'Sábado',
    domingo: 'Domingo',
  }

  function formatHours(number:number):string {
    return number > 9
      ? `${number}:00`
      : `0${number}:00`
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-normal">Capacidade: {labCapacity} pessoa(s)</CardTitle>
          <CardDescription>Descrição: {labDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <span>Localização: {labLocalization}</span>
          <span>Dias de funcionamento:</span>
          {deleteSpaceStringDays.map((day) => (
            <div className="flex flex-col" key={day}>

              <span>{keyValueDay[day]}</span>
              <Separator />
            </div>
          ))}
          <span>Horário de funcionamento : {formatHours(labStartOfBlockade)}  às  {formatHours(labEndOfBlockade)} </span>
        </CardContent>

      </Card>
    </>
  )
}
