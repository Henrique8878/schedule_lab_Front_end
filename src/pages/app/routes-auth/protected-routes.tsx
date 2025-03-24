import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { contextApp } from '../context/context-main'

export function ProtectedRoutes() {
  const { isAuthenticated } = useContext(contextApp)

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/sign-in" replace />
}
