import api from "../utils/api"
import useAuth from "./useAuth"

const useTokenRefresh = () => {
  const { setAuth } = useAuth()

  const refreshAccessToken = async () => {
    try {
      const refreshResponse = await api.post(
        '/token/api/refresh', {},
        { withCredentials: true }
      )

      const newAccessToken = refreshResponse.data.accessToken

      setAuth({ accessToken: newAccessToken })

      return newAccessToken
    } catch (refreshError) {
      console.error("Error refreshing token:", refreshError)
      throw refreshError
    }
  }

  return refreshAccessToken
}

export default useTokenRefresh