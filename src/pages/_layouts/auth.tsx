import { FlaskConical } from 'lucide-react'
import { Outlet } from 'react-router-dom'
export function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="flex flex-col justify-between bg-muted p-8">
        <div className="flex space-x-2">
          <FlaskConical />
          <span>Agendamento.Laboratório</span>
        </div>
        <span className="text-muted-foreground">
          Painel do parceiro &copy; - {new Date().getFullYear()}
        </span>
      </div>
      <div className="relative"><Outlet /></div>
    </div>
  )
}
