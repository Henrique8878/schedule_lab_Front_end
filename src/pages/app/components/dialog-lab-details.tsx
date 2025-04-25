import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { CardLabDetails } from './card-lab-details'

interface DialogLabDetailsParams {
  laboratoryName: string
  laboratoryCapacity: number
  laboratoryDescription: string
  laboratoryLocalization: string
  laboratoryDaysOperating: string
  laboratoryStartOfBlockade: number
  laboratoryEndOfBlockade: number
}

export function DialogLabDetails({
  laboratoryName, laboratoryCapacity, laboratoryDescription, laboratoryLocalization,
  laboratoryDaysOperating, laboratoryStartOfBlockade, laboratoryEndOfBlockade,
}:DialogLabDetailsParams) {
  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">{laboratoryName}</DialogTitle>
          <DialogDescription className="text-lg">
            Aqui está uma breve descrição do {laboratoryName}
          </DialogDescription>
        </DialogHeader>
        <CardLabDetails
          labCapacity={laboratoryCapacity}
          labDescription={laboratoryDescription}
          labLocalization={laboratoryLocalization}
          labDaysOperating={laboratoryDaysOperating}
          labStartOfBlockade={laboratoryStartOfBlockade}
          labEndOfBlockade={laboratoryEndOfBlockade}
        />
      </DialogContent>
    </>
  )
}
