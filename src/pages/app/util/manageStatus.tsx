export type typeStatus = 'pending' | 'approved' | 'rejected'

export function ManageStatus(status:typeStatus) {
  const statusMap = {
    pending: {
      label: 'Pendente',
      color: 'yellow',
      icon: <div className="w-2 h-2 bg-yellow-500 rounded-full" />,
    },
    approved: {
      label: 'Aprovado',
      color: 'green',
      icon: <div className="w-2 h-2 bg-green-500 rounded-full" />,
    },
    rejected: {
      label: 'Rejeitado',
      color: 'red',
      icon: <div className="w-2 h-2 bg-red-500 rounded-full" />,
    },
  }

  return (
    <div className={`flex gap-4 items-center ${statusMap[status].color}`}>
      {statusMap[status].icon}
      <span>{statusMap[status].label}</span>
    </div>
  )
}
