import axios from 'axios'

// Create axios instance with base configuration
// Using a completely separate instance to avoid mock adapter interference
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080', // Update this with your actual API base URL
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
      const token = window.localStorage.getItem('accessToken')
      if (token) {
        config.headers = config.headers || {}
        if (!('Authorization' in config.headers)) {
          ; (config.headers as any).Authorization = `Bearer ${token}`
        }
      }
    }

    console.log('Axios request:', config.method?.toUpperCase(), config.url)

    return config
  },
  (error) => {
    console.error('Axios request error:', error)

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
