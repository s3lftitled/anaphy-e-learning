import { createContext, useContext } from "react"
import { useQuery, QueryClient, QueryClientProvider } from "react-query"
import { useNavigate } from "react-router-dom"
import usePrivateApi from "../hooks/usePrivateApi"

// Create the context
const UserContext = createContext({ user: null })

// Create a query client for React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
      cacheTime: 10 * 60 * 1000, // Cache persists for 10 minutes
      retry: 1, // Only retry once on failure
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
  },
})

export const AppProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>{children}</UserProvider>
    </QueryClientProvider>
  )
}

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const privateAxios = usePrivateApi();

  // React Query to handle user data fetching
  const { 
    data: user, 
    isLoading, 
    error, 
    isError 
  } = useQuery(
    "user", 
    async () => {
      try {
        const refreshResponse = await privateAxios.post('/token/api/refresh', {}, { 
          withCredentials: true 
        })
        
        const { accessToken, userId } = refreshResponse.data
        
        const userResponse = await privateAxios.get(`/user/api/v1/fetch-user/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        
        return userResponse.data.user
      } catch (error) {
        console.error("Authentication error:", error);
        throw error;
      }
    }, 
    {
      retry: 1,
      onError: (error) => {
        console.error("Failed to authenticate user:", error);
        navigate("/login", { 
          state: { 
            from: window.location.pathname,
            error: "Your session has expired. Please log in again."
          } 
        })
      }
    }
  )
  
  if (isLoading) {
    return null
  }

  if (isError) {
    // You might want a more graceful error state here
    // This will only briefly show before redirect
    return <div>Session expired. Redirecting to login...</div>;
  }

  return (
    <UserContext.Provider value={{ 
      user,
      isAuthenticated: !!user,
      refetchUser: () => queryClient.invalidateQueries("user")
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)