import './App.css'

import { QueryClientProvider } from '@tanstack/react-query'
import {} from '@tanstack/react-query'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { queryClient } from './lib/react-query'
import { router } from './pages/routes/routes'

export function App() {
  return (
    <>
      <HelmetProvider>
        <Helmet titleTemplate="%s | Laboratório" />
        <Toaster richColors closeButton className="w-36 h-36" />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </HelmetProvider>
    </>
  )
}
