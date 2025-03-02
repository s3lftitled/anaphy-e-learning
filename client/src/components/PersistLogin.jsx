import { Outlet, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import useTokenRefresh from "../hooks/useRefreshToken"
import useAuth from "../hooks/useAuth"

const PersistLogin = () => {
  const [ isLoading, setIsLoading ] = useState(true)
  const refreshAccessToken = useTokenRefresh()
  const { auth }= useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await refreshAccessToken()
      } catch (error) {
        console.error("Token refresh failed:", error)
        navigate('/login')
      } finally {
        setIsLoading(false)
      }
    }
    !auth?.accessToken ? verifyToken() : setIsLoading(false)
  }, [])

  return (
    <>
      { isLoading ? 'Loading...' : <Outlet />}
    </>
  )
}

export default PersistLogin