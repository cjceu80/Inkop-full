import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { LoginPage } from './auth/LoginPage'
import { ProtectedRoute } from './auth/ProtectedRoute'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [{ index: true, element: <App /> }],
  },
])
