import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Header from '../components/Header'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    // spinner ...
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Header /> 
      <main className="container py-3">
        <Outlet />      {/* page content */}
      </main>
    </>
  )
}