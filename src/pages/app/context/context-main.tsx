import React, { ReactNode, useState } from 'react'
import { createContext } from 'react'

interface typeNodeChildren {
  children: ReactNode
}

interface typeContext {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  isAdmin: boolean
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
}

export const contextApp = createContext({

} as typeContext)

export function ContextMain({ children }:typeNodeChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(true)

  return (
    <contextApp.Provider value={{ isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin }}>
      {children}
    </contextApp.Provider>
  )
}
