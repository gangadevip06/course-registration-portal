import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

// Wraps pages that require authentication. Redirects unauthenticated
// users to the login page, preserving where they were headed.
// Pass `adminOnly` to also restrict the route to admin accounts.
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useApp()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
