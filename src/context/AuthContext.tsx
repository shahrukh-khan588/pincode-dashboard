// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axiosInstance from 'src/configs/axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType, MerchantDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => void 0,
  setLoading: () => void 0,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUserState] = useState<UserDataType | MerchantDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      const storedUserData = window.localStorage.getItem('userData')

      if (storedToken) {
        setLoading(true)

        // Determine which profile endpoint to use based on stored user data
        let profileEndpoint = authConfig.meEndpoint
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData)
            if (userData.merchantId) {
              profileEndpoint = authConfig.merchantProfileEndpoint
            }
          } catch (error) {
            console.error('Error parsing stored user data:', error)
          }
        }

        await axiosInstance.get(profileEndpoint, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
          .then(async (response: any) => {
            setLoading(false)
            setUserState({ ...response.data.userData || response.data })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUserState(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    console.log('AuthContext handleLogin called with params:', params)

    const endpoint = params.userType === 'merchant'
      ? authConfig.merchantLoginEndpoint
      : authConfig.adminLoginEndpoint

    // Only send email and password to the API
    const loginData = {
      email: params.email,
      password: params.password
    }

    return axiosInstance.post(endpoint, loginData).then(async (response: any) => {
      console.log('Login successful, response:', response.data)

      params.rememberMe
        ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
        : null
      const returnUrl = router.query.returnUrl

      // Store user data - handle both userData and direct response formats
      const userData = response.data.userData || response.data
      setUserState({ ...userData })
      params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(userData)) : null

      // Redirect merchants to their profile dashboard by default
      const isMerchant = (params.userType === 'merchant') || !!(userData && (userData as any).merchantId)
      const defaultPath = isMerchant ? '/pages/user-profile/profile/' : '/'
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : defaultPath

      router.replace(redirectURL as string)

      return { success: true, data: response.data }
    })

      .catch((err: any) => {
        const errorObj = {
          success: false,
          error: {
            message: 'Login failed. Please try again.',
            code: err.code,
            status: err.response?.status,
            details: err.response?.data
          }
        }

        // Set specific error messages based on error type
        if (err.code === 'ERR_NETWORK') {
          errorObj.error.message = 'Network error: Unable to connect to the server. Please check your internet connection.'
        } else if (err.response?.status === 401) {
          errorObj.error.message = 'Invalid email or password. Please check your credentials.'
        } else if (err.response?.status === 400) {
          errorObj.error.message = 'Invalid request. Please check your input.'
        } else if (err.response?.status === 500) {
          errorObj.error.message = 'Server error. Please try again later.'
        } else if (err.response?.data?.message) {
          errorObj.error.message = err.response.data.message
        } else if (err.message) {
          errorObj.error.message = err.message
        }

        if (errorCallback) errorCallback(errorObj)

        return errorObj
      })
  }

  const handleLogout = () => {
    setUserState(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values: AuthValuesType = {
    user,
    loading,
    setUser: setUserState,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
