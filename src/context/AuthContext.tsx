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
  logout: () => Promise.resolve(),
  refreshMerchantProfile: () => Promise.resolve(null)
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

  // ** Session Expiry (24 hours)
  const SESSION_EXPIRY_KEY = 'sessionExpiry'
  const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000
  let logoutTimer: ReturnType<typeof setTimeout> | null = null

  const clearLogoutTimer = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer)
      logoutTimer = null
    }
  }

  const scheduleAutoLogout = () => {
    if (typeof window === 'undefined') return
    const expiryStr = window.localStorage.getItem(SESSION_EXPIRY_KEY)
    if (!expiryStr) return
    const expiresAt = Number(expiryStr)
    const now = Date.now()
    const remaining = Math.max(0, expiresAt - now)
    clearLogoutTimer()
    if (remaining === 0) {
      handleLogout()
    } else {
      logoutTimer = setTimeout(() => {
        handleLogout()
      }, remaining)
    }
  }

  const isSessionExpired = (): boolean => {
    if (typeof window === 'undefined') return false
    const expiryStr = window.localStorage.getItem(SESSION_EXPIRY_KEY)
    if (!expiryStr) return true
    const expiresAt = Number(expiryStr)

    return Number.isFinite(expiresAt) ? Date.now() >= expiresAt : true
  }

  // ** Function to fetch latest merchant profile data
  const fetchMerchantProfile = async (token: string) => {
    try {
      const response = await axiosInstance.get(authConfig.merchantProfileEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return response.data
    } catch (error) {
      console.error('Error fetching merchant profile:', error)

      return null
    }
  }

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      const storedUserData = window.localStorage.getItem('userData')

      if (storedToken && storedUserData) {
        // Enforce 24h session expiry
        if (isSessionExpired()) {
          window.localStorage.removeItem('userData')
          window.localStorage.removeItem('refreshToken')
          window.localStorage.removeItem('accessToken')
          window.localStorage.removeItem(SESSION_EXPIRY_KEY)
          setUserState(null)
          setLoading(false)
          router.replace('/login')

          return
        }
        try {
          const userData = JSON.parse(storedUserData)

          // If user is a merchant, fetch latest profile data to get current verification status
          if (userData && userData.merchantId) {
            const latestProfile = await fetchMerchantProfile(storedToken)
            if (latestProfile) {
              // Update user data with latest verification status
              const updatedUserData = { ...userData, ...latestProfile }
              setUserState(updatedUserData)

              // Update stored data with latest information
              window.localStorage.setItem('userData', JSON.stringify(updatedUserData))
            } else {
              // If API call fails, use stored data
              setUserState(userData)
            }
          } else {
            // For admin users, use stored data as is
            setUserState(userData)
          }

          setLoading(false)

          // Ensure auto-logout is scheduled
          scheduleAutoLogout()
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          localStorage.removeItem(SESSION_EXPIRY_KEY)
          setUserState(null)
          setLoading(false)
        }
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
      let userData = response.data.userData || response.data

      // For merchants, fetch complete profile data to get phoneNumber, businessAddress, etc.
      const isMerchant = (params.userType === 'merchant') || !!(userData && (userData as any).merchantId)
      if (isMerchant && response.data.accessToken) {
        try {
          const completeProfile = await fetchMerchantProfile(response.data.accessToken)
          if (completeProfile) {
            // Merge login data with complete profile data
            userData = { ...userData, ...completeProfile }
            console.log('Complete merchant profile fetched:', completeProfile)
          }
        } catch (error) {
          console.error('Failed to fetch complete merchant profile:', error)

          // Continue with login data if profile fetch fails
        }
      }

      setUserState({ ...userData })
      if (params.rememberMe) {
        window.localStorage.setItem('userData', JSON.stringify(userData))

        // Set session expiry to 24 hours from now
        window.localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_MAX_AGE_MS))
        scheduleAutoLogout()
      }

      // Redirect merchants based on their approval status
      let defaultPath = '/'
      if (isMerchant) {
        // Check merchant verification status
        const merchantStatus = (userData as any).verificationStatus
        if (merchantStatus === 'verified') {
          defaultPath = '/pages/user-profile/profile/' // or '/merchant/profile'
        } else {
          defaultPath = '/merchant/account-status' // Redirect to status page if not verified
        }
      }

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
    window.localStorage.removeItem(SESSION_EXPIRY_KEY)
    clearLogoutTimer()
    router.push('/login')
  }

  // ** Function to refresh merchant profile data
  const refreshMerchantProfile = async () => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    if (storedToken && user && (user as any).merchantId) {
      const latestProfile = await fetchMerchantProfile(storedToken)
      if (latestProfile) {
        const updatedUserData = { ...user, ...latestProfile }
        setUserState(updatedUserData)
        window.localStorage.setItem('userData', JSON.stringify(updatedUserData))

        return updatedUserData
      }
    }

    return null
  }

  const values: AuthValuesType = {
    user,
    loading,
    setUser: setUserState,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    refreshMerchantProfile
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
