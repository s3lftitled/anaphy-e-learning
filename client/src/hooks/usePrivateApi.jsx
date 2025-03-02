import { useEffect } from "react"
import useTokenRefresh from "./useRefreshToken"
import useAuth from "./useAuth"
import { privateAxios } from "../utils/api"

const usePrivateApi = () => {
  const refreshAccessToken = useTokenRefresh()
  const { auth } = useAuth()

  useEffect(() => {
    const requestIntercept = privateAxios.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const responseIntercept = privateAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config

        if (!prevRequest?.sent && (error?.response?.status === 401)) {
          prevRequest.sent = true
          const newAccessToken = await refreshAccessToken()
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return privateAxios(prevRequest)
        }

        return Promise.reject(error)
      }
    )

    return () => {
      privateAxios.interceptors.response.eject(responseIntercept)
      privateAxios.interceptors.request.eject(requestIntercept)
    }
  }, [refreshAccessToken, auth])

  return privateAxios
}

export default usePrivateApi