import { Navigate, Outlet } from 'react-router-dom'
import useAuth from "../hooks/useAuth"
import { useUser } from '../context/UserContext'

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth } = useAuth()
  const { user } = useUser()

  // Check if access token is present and user has the required role
  const isAuthorized = auth?.accessToken && allowedRoles.includes(user.role)

  // Redirect to authentication if there's no access token
  if (!auth?.accessToken) {
    return <Navigate to="/login" />
  }

  // Redirect to home if user role is not allowed
  if (!isAuthorized) {
    return <Navigate to="/unauthorized" />
  }

  return <Outlet />
}

export default ProtectedRoute