import axios from 'axios'

// Create axios instance with base configuration
// Using a completely separate instance to avoid mock adapter interference
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', // Backend runs on port 3000
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },

  // Disable any interceptors that might interfere
  adapter: axios.defaults.adapter
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach Authorization header from localStorage if available
    if (typeof window !== 'undefined') {
      // Enforce 24h session expiry before any request
      const expiryStr = window.localStorage.getItem('sessionExpiry')
      if (expiryStr) {
        const expiresAt = Number(expiryStr)
        if (Number.isFinite(expiresAt) && Date.now() >= expiresAt) {
          window.localStorage.removeItem('userData')
          window.localStorage.removeItem('refreshToken')
          window.localStorage.removeItem('accessToken')
          window.localStorage.removeItem('sessionExpiry')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }

          // Throw to cancel the request
          throw new axios.Cancel('Session expired')
        }
      }
      const token = window.localStorage.getItem('accessToken')
      if (token) {
        config.headers = config.headers || {}
        if (!('Authorization' in config.headers)) {
          ; (config.headers as any).Authorization = `Bearer ${token}`
        }
      }
    }

    console.log('🚀 Axios Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers,
      data: config.data
    })

    return config
  },
  (error) => {
    console.error('❌ Axios request error:', error)

    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Axios response:', response.status, response.config.url)

    return response
  },
  (error) => {
    console.error('Axios response error:', error.response?.status, error.config?.url, error.message)

    return Promise.reject(error)
  }
)

export default axiosInstance
