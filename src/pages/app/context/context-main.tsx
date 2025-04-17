import React, { createContext, ReactNode, useState } from 'react'

interface typeNodeChildren {
  children: ReactNode
}

interface typeContext {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  isAdmin: boolean
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
  changeStatusAvailability: boolean
  changeSetStatusAvailability: React.Dispatch<React.SetStateAction<boolean>>
  name: string,
  setName: React.Dispatch<React.SetStateAction<string>>,
  email: string,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  password_hash: string,
  setPassword_hash: React.Dispatch<React.SetStateAction<string>>,
  category: string,
  setCategory: React.Dispatch<React.SetStateAction<string>>
}

export const contextApp = createContext({

} as typeContext)

export function ContextMain({ children }:typeNodeChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated))
  const [isAdmin, setIsAdmin] = useState<boolean>(true)
  const [changeStatusAvailability, changeSetStatusAvailability] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password_hash, setPassword_hash] = useState('')
  const [category, setCategory] = useState('')

  return (
    <contextApp.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      isAdmin,
      setIsAdmin,
      changeSetStatusAvailability,
      changeStatusAvailability,
      name,
      setName,
      email,
      setEmail,
      password_hash,
      setPassword_hash,
      category,
      setCategory,
    }}
    >
      {children}
    </contextApp.Provider>
  )
}
