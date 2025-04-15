import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { contextApp } from '../context/context-main'

export function ProtectedRoutes() {
  const { isAuthenticated } = useContext(contextApp)
  localStorage.setItem('isAuthenticatedLocalStorage', JSON.stringify(isAuthenticated))
  const isAuthenticatedLocalStorage = localStorage.getItem('isAuthenticatedLocalStorage')

  return isAuthenticatedLocalStorage
    ? <Outlet />
    : <Navigate to="/sign-in" replace />
}
