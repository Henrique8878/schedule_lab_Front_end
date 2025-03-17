import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { AppLayout } from '../_layouts/app'
import { AuthLayout } from '../_layouts/auth'
import { DashBoard } from '../app/dashboard'
import { RegisterLab } from '../app/register-lab'
import { RegisterUser } from '../app/register-user'
import { Scheduling } from '../app/scheduling'
import { SignIn } from '../auth/sign-in'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },
      {
        path: 'register-lab',
        element: <RegisterLab />,
      },
      {
        path: 'register-user',
        element: <RegisterUser />,
      },
      {
        path: 'scheduling',
        element: <Scheduling />,
      },
    ],
  },

])
