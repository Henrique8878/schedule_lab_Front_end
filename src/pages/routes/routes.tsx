import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { AppLayout } from '../_layouts/app'
import { AppUserLayout } from '../_layouts/app-user-layout'
import { AuthLayout } from '../_layouts/auth'
import { DashBoard } from '../app/dashboard'
import { RegisterLab } from '../app/register-lab'
import { RegisterUser } from '../app/register-user'
import { ProtectedRoutes } from '../app/routes-auth/protected-routes'
import { Scheduling } from '../app/scheduling'
import { SignIn } from '../auth/sign-in'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/sign-in" replace />,
      },
      {
        path: 'sign-in',
        element: <SignIn />,
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoutes />,
    children: [
      {
        path: '',
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
    ],
  }, {
    path: '/user',
    element: <ProtectedRoutes />,
    children: [
      {
        path: '',
        element: <AppUserLayout />,
        children: [
          {
            path: '',
            element: <Scheduling />,
          },
        ],
      },

    ],
  },

])
